<script setup lang="ts">
import type { Departments } from '@/data/models/departments'
import type { Instructors, iInstructors } from '@/data/models/instructors'
import type { iAcademicYear } from '@/data/models/schools'
import InstructorSideForm from '@/views/modal/InstructorSideForm.vue'

const isInstructorHandlerSidebarActive = ref(false)

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const searchQuery = ref('')
const selectedRows = ref([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const selectedInstructor = ref<iInstructors>({
  id: undefined,
  first_name: '',
  last_name: '',
  phone: '',
  pf_number: '',
  email: '',
  department_id: '',
  status: '',
})

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
const totalInstructors = computed(() => instructorsData.value.total)

const deleteInstructor = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchInstructors()
}

const addInstructor = () => {
  selectedInstructor.value = {
    id: undefined,
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    pf_number: '',
    department_id: '',
    status: '',
  }
  isInstructorHandlerSidebarActive.value = true
}

const editInstructor = (instructor: iInstructors) => {
  selectedInstructor.value = instructor
  isInstructorHandlerSidebarActive.value = true
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

// const { data: instructorsData, execute: fetchInstructors } = await useApi<any>(createUrl('/administrator/instructors',
//   {
//     query: {
//       q: searchQuery,
//       stock: selectedStock,
//       category: selectedCategory,
//       status: selectedStatus,
//       page,
//       itemsPerPage,
//       sortBy,
//       orderBy,
//     },
//   },
// ))

// const instructors = computed((): Instructors[] => instructorsData.value.data)

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

const headers = [
  { title: 'Lecturer', key: 'name' },
  { title: 'Classes Teaching', key: 'classes_teaching' },
  { title: 'Department', key: 'department' },
  { title: 'Attendance', key: 'attendance' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'Inactive' },
])

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'active')
    return { text: 'Active', color: 'success' }
  if (statusMsg === 'inactive')
    return { text: 'Inactive', color: 'error' }

  return { text: statusMsg, color: 'default' }
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCard
          title="Filter Lecturers"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Instructor"
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
                @click="addInstructor"
              >
                Add Instructor
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
            :items="instructors"
            :items-length="totalInstructors"
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
              <IconBtn @click="editInstructor(item)">
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
                      @click="deleteInstructor(item.id)"
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
                :total-items="totalInstructors"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <InstructorSideForm
    v-model:is-drawer-open="isInstructorHandlerSidebarActive"
    v-model:instructor-data="selectedInstructor"
    :fetch-instructors="fetchInstructors"
    :departments-data="departments"
    :instructors-data="instructors"
  />
</template>
