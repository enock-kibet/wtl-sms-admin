<script setup lang="ts">
import type { Classes, iClasses } from '@/data/models/classes'
import type { Courses } from '@/data/models/courses'
import type { Instructors } from '@/data/models/instructors'
import type { iAcademicYear } from '@/data/models/schools'
import ClassSideForm from '@/views/modal/ClassSideForm.vue'

// 👉 Event
// const event = ref(structuredClone(blankEvent))
const isClassHandlerSidebarActive = ref(false)

// watch(isEventHandlerSidebarActive, val => {
//   if (!val)
//     event.value = structuredClone(blankEvent)
// })

const headers = [
  { title: 'Class Title', key: 'title' },
  { title: 'Lecturer', key: 'lecturer' },
  { title: 'Course', key: 'course' },
  { title: 'Students', key: 'students' },

  // { title: 'School', key: 'school' },
  // { title: 'Department', key: 'department' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Updated At', key: 'updated_at' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const searchQuery = ref('')
const selectedRows = ref([])

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'Inactive' },
])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const selectedClass = ref<iClasses>({
  id: undefined,
  course_id: '',
  title: '',
  department_id: '',
  description: '',
  academic_year_id: '',
  instructor_id: '',
  scheduled_at: '',
  duration: '',
  status: '',
  attachments: [],
  course_code: '',
})

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'active')
    return { text: 'Active', color: 'success' }
  if (statusMsg === 'ongoing')
    return { text: 'Ongoing', color: 'success' }
  if (statusMsg === 'upcoming')
    return { text: 'Upcoming', color: 'success' }
  if (statusMsg === 'past')
    return { text: 'Past', color: 'warning' }
  if (statusMsg === 'inactive')
    return { text: 'Inactive', color: 'error' }

  return { text: statusMsg, color: 'default' }
}

const { data: classesData, execute: fetchClasses } = await useApi<any>(createUrl('/class/list',
  {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const classes = computed((): Classes[] => classesData.value.data)
const totalClasses = computed(() => classesData.value.total)

const deleteClass = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchClasses()
}

const addClass = () => {
  selectedClass.value = {
    id: undefined,
    scheduled_at: '',
    duration: '',
    title: '',
    description: '',
    academic_year_id: '',
    instructor_id: '',
    status: 'active',
    attachments: [],
    course_code: '',
  }
  isClassHandlerSidebarActive.value = true
}

const editClass = (iclasses: iClasses) => {
  selectedClass.value = iclasses
  isClassHandlerSidebarActive.value = true
}

const { data: instructorsData, execute: fetchInstructors } = await useApi<any>(createUrl('/administrator/instructors',
  {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const instructors = computed((): Instructors[] => instructorsData.value.data)

const { data: academicYearsData, execute: fetchAcademicYears } = await useApi<any>(createUrl('/academic-year/list',
  {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const academicYears = computed((): iAcademicYear[] => academicYearsData.value.data)

const { data: coursesData, execute: fetchCourses } = await useApi<any>(createUrl('/course/list',
  {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const courses = computed((): Courses[] => coursesData.value.data)
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCard
          title="Filter Classes"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Class"
                style="inline-size: 200px;"
                class="me-3"
              />
            </div>

            <VSpacer />
            <div class="d-flex gap-4 flex-wrap align-center">
              <AppSelect
                v-model="itemsPerPage"
                :items="[5, 10, 20, 25, 50]"
              />
              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-upload"
              >
                Export
              </VBtn>

              <VBtn
                color="primary"
                prepend-icon="tabler-plus"
                @click="addClass"
              >
                Add Class
              </VBtn>
            </div>
          </div>

          <VDivider class="mt-4" />

          <!-- 👉 Datatable  -->
          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:model-value="selectedRows"
            v-model:page="page"
            :headers="headers"
            show-select
            :items="classes"
            :items-length="totalClasses"
            class="text-no-wrap"
            @update:options="updateOptions"
          >
            <!-- status -->
            <template #item.status="{ item }">
              <VChip
                v-bind="resolveStatus(item.status)"
                density="default"
                label
                size="small"
              />
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="editClass(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>

              <IconBtn>
                <VIcon icon="tabler-dots-vertical" />
                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      value="download"
                      prepend-icon="tabler-download"
                    >
                      Download
                    </VListItem>

                    <VListItem
                      value="delete"
                      prepend-icon="tabler-trash"
                      @click="deleteClass(item.id)"
                    >
                      Delete
                    </VListItem>

                    <VListItem
                      value="duplicate"
                      prepend-icon="tabler-copy"
                    >
                      Duplicate
                    </VListItem>
                  </VList>
                </VMenu>
              </IconBtn>
            </template>

            <!-- pagination -->
            <template #bottom>
              <TablePagination
                v-model:page="page"
                :items-per-page="itemsPerPage"
                :total-items="totalClasses"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <ClassSideForm
    v-model:is-drawer-open="isClassHandlerSidebarActive"
    v-model:class-data="selectedClass"
    :fetch-classes="fetchClasses"
    :academic-years-data="academicYears"
    :instructor-data="instructors"
    :courses-data="courses"
  />
</template>
