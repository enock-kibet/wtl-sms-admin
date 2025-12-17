<script setup lang="ts">
import type { Departments, iDepartments } from '@/data/models/departments'
import type { Schools } from '@/data/models/schools'
import DepartmentSideForm from '@/views/modal/DepartmentSideForm.vue'

// 👉 Event
// const event = ref(structuredClone(blankEvent))
const isDepartmentHandlerSidebarActive = ref(false)

// watch(isEventHandlerSidebarActive, val => {
//   if (!val)
//     event.value = structuredClone(blankEvent)
// })

const headers = [
  { title: 'Department Name', key: 'name' },
  { title: 'School', key: 'school' },
  { title: 'Description', key: 'description' },
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

const selectedDepartment = ref<iDepartments>({
  id: undefined,
  name: '',
  faculty_id: '',
  description: '',
  status: '',
})

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'active')
    return { text: 'Active', color: 'success' }
  if (statusMsg === 'inactive')
    return { text: 'Inactive', color: 'error' }

  return { text: statusMsg, color: 'default' }
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
const totalDepartments = computed(() => departmentsData.value.meta.total)

const { data: schoolsData, execute: fetchSchools } = await useApi<any>(createUrl('/faculty/list',
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

const schools = computed((): Schools[] => schoolsData.value.data)

const deleteDepartment = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchDepartments()
}

const addDepartment = () => {
  selectedDepartment.value = {
    id: undefined,
    name: '',
    faculty_id: '',
    description: '',
    status: 'active',
  }
  isDepartmentHandlerSidebarActive.value = true
}

const editDepartment = (department: iDepartments) => {
  selectedDepartment.value = department
  isDepartmentHandlerSidebarActive.value = true
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
          title="Filter Departments"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Department"
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
                @click="addDepartment"
              >
                Add Department
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
            :items="departments"
            :items-length="totalDepartments"
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
              <IconBtn @click="editDepartment(item)">
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
                      @click="deleteDepartment(item.id)"
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
                :total-items="totalDepartments"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <DepartmentSideForm
    v-model:is-drawer-open="isDepartmentHandlerSidebarActive"
    v-model:department-data="selectedDepartment"
    :fetch-departments="fetchDepartments"
    :schools-data="schools"
  />
</template>
