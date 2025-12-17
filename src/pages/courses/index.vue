<script setup lang="ts">
import type { Courses, iCourses } from '@/data/models/courses'
import type { Departments } from '@/data/models/departments'
import type { Instructors } from '@/data/models/instructors'
import type { iAcademicYear } from '@/data/models/schools'
import CourseSideForm from '@/views/modal/CourseSideForm.vue'

// 👉 Event
// const event = ref(structuredClone(blankEvent))
const isCourseHandlerSidebarActive = ref(false)

// watch(isEventHandlerSidebarActive, val => {
//   if (!val)
//     event.value = structuredClone(blankEvent)
// })

const headers = [
  { title: 'Course Title', key: 'name' },
  { title: 'Lecturer', key: 'lecturer' },
  { title: 'School', key: 'school' },
  { title: 'Department', key: 'department' },
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

const selectedCourse = ref<iCourses>({
  id: undefined,
  course_code: '',
  name: '',
  department_id: '',
  description: '',
  academic_year_id: '',
  instructors: [],
  status: '',
  attachments: [],
})

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'active')
    return { text: 'Active', color: 'success' }
  if (statusMsg === 'inactive')
    return { text: 'Inactive', color: 'error' }

  return { text: statusMsg, color: 'default' }
}

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
const totalCourses = computed(() => coursesData.value.total)

const deleteCourse = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchCourses()
}

const addCourse = () => {
  selectedCourse.value = {
    id: undefined,
    course_code: '',
    name: '',
    department_id: '',
    description: '',
    academic_year_id: '',
    instructors: [],
    status: '',
    attachments: [],
  }
  isCourseHandlerSidebarActive.value = true
}

const editCourse = (course: iCourses) => {
  selectedCourse.value = course
  isCourseHandlerSidebarActive.value = true
}

const { data: departmentsData, execute: fetchDepartments } = await useApi<any>(createUrl('/department/list',
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

const departments = computed((): Departments[] => departmentsData.value.data)

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
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCard
          title="Filter Courses"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Course"
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
                @click="addCourse"
              >
                Add Course
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
            :items="courses"
            :items-length="totalCourses"
            class="text-no-wrap"
            @update:options="updateOptions"
          >
            <!-- lecturer -->
            <template #item.lecturer="{ item }">
              <template
                v-for="lec in item.lecturer"
                :key="lec.id"
              >
                <div>{{ `${lec.first_name} ${lec.last_name}` }}</div>
              </template>
            </template>
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
              <IconBtn @click="editCourse(item)">
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
                      @click="deleteCourse(item.id)"
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
                :total-items="totalCourses"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <CourseSideForm
    v-model:is-drawer-open="isCourseHandlerSidebarActive"
    v-model:course-data="selectedCourse"
    :fetch-courses="fetchCourses"
    :departments-data="departments"
    :academic-years-data="academicYears"
    :instructors-data="instructors"
  />
</template>
