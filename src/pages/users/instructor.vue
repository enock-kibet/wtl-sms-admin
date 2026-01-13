<script setup lang="ts">
import type { Departments } from '@/data/models/departments'
import type { Instructors, iInstructors } from '@/data/models/instructors'
import type { Schools } from '@/data/models/schools'
import InstructorSideForm from '@/views/modal/InstructorSideForm.vue'

interface RolesData {
  instructor: [
    {
      id: string | number
      name: string
      guard_name: string
    },
  ]
}

const isInstructorHandlerSidebarActive = ref(false)

const bulkactions = ref()

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
const totalInstructors = computed(() => instructorsData.value.meta.total)

const { data: rolesData, execute: fetchRoles } = await useApi<any>(createUrl('/administrator/roles-data',
  {
    query: {
      guard: 'instructor',
    },
  },
))

const roles = computed((): RolesData => rolesData.value.data)

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

const { data: departmentsData, execute: fetchDepartments } = await useApi<any>(createUrl('/department/list'))

const departments = computed((): Departments[] => departmentsData.value.data)

const { data: schoolsData, execute: fetchSchools } = await useApi<any>(createUrl('/faculty/list'))

const schools = computed((): Schools[] => schoolsData.value.data)

const headers = [
  { title: 'Lecturer', key: 'name' },
  { title: 'Employment Type', key: 'employment_type' },
  { title: 'Classes Teaching', key: 'classes_teaching' },
  { title: 'School', key: 'school' },
  { title: 'Department', key: 'department' },
  { title: 'Attendance', key: 'attendance' },
  { title: 'Role', key: 'roles' },
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

const resolveEmploymentType = (type: string) => {
  if (type === 'internal_full_time')
    return { text: 'Internal Full-Time', color: 'primary' }
  if (type === 'external_full_time')
    return { text: 'External Full-Time', color: 'primary' }
  if (type === 'internal_part_time')
    return { text: 'External Full-Time', color: 'primary' }
  if (type === 'external_part_time')
    return { text: 'External Part-Time', color: 'primary' }
  if (type === 'adjunct_part_time')
    return { text: 'Adjunct Part-Time', color: 'primary' }

  return { text: type, color: 'default' }
}

const roleChange = async (id: any) => {
  try {
    const updateRole = await $api('/administrator/instructor/assign/roles', {
      method: 'POST',
      body: {
        ids: id,
        role_id: bulkactions.value,
      },
      onResponseError({ response }) {
        showToast('Something went wrong. Please try again later!', 'error')
      },
    })

    fetchInstructors() // Refresh members after role change
  }
  catch (error) {
    console.log(error)
  }
}

watch(bulkactions, val => {
  console.log(val)
  if (val && selectedRows.value.length)
    roleChange(selectedRows.value)
})
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
              <div class="float-end">
                <AppSelect
                  v-model="bulkactions"
                  :items="roles.instructor"
                  item-title="name"
                  item-value="id"
                  class="me-1"
                  clear-icon="tabler-x"
                  clearable
                  chips
                  placeholder="Update Lecturer Role"
                  style="inline-size: 200px;"
                />
              </div>
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
            <template #item.roles="{ item }">
              <div>
                <VChip
                  v-for="role in item.roles"
                  :key="role"
                  color="primary"
                  class="font-weight-medium my-1 mr-2"
                  size="small"
                >
                  {{ role }}
                </VChip>
              </div>
            </template>

            <template #item.employment_type="{ item }">
              <div>
                <VChip
                  v-bind="resolveEmploymentType(item.employment_type)"
                  density="default"
                  label
                  size="small"
                />
              </div>
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
    :schools-data="schools"
    :instructors-data="instructors"
  />
</template>
