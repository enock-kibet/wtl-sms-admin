<script setup lang="ts">
import Swal from 'sweetalert2'
import { deleteSchool, duplicateSchool } from './core/request'
import type { Schools, iSchools } from '@/data/models/schools'
import SchoolSideForm from '@/views/modal/SchoolSideForm.vue'

// 👉 Event
// const event = ref(structuredClone(blankEvent))
const isSchoolHandlerSidebarActive = ref(false)

// watch(isEventHandlerSidebarActive, val => {
//   if (!val)
//     event.value = structuredClone(blankEvent)
// })

const headers = [
  { title: 'School Name', key: 'name' },
  { title: 'Dean', key: 'dean' },
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
const selectedRows = ref<string[]>([])

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

const selectedSchool = ref<iSchools>({
  id: undefined,
  name: '',
  dean: '',
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
const totalSchools = computed(() => schoolsData.value.meta.total)

const handleDeleteSchool = async (id: string) => {
  console.log(selectedRows.value)

  const uuids = selectedRows.value.map(row => row)

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f00',
    cancelButtonColor: '#8EC244',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'custom-confirm-button',
      cancelButton: 'custom-cancel-button',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    if (selectedRows.value.length > 0) {
      const res = await deleteSchool(uuids)
      if (res) {
        showToast('Faculties deleted successfully', 'success')
        selectedRows.value = []
      }
    }
    else {
      await deleteSchool([id])
      showToast('Faculty deleted successfully', 'success')
      selectedRows.value = []
    }

    // Refetch products
    Swal.fire(
      'Deleted!',
      'Selected school has been deleted.',
      'success',
    ).then(() => {
      fetchSchools()
    })
  }
}

const handleDuplicateSchool = async (id: string) => {
  const res = await duplicateSchool(id)

  if (res)
    showToast('Faculty duplicated successfully', 'success')

  // Refetch products
  fetchSchools()
}

const addSchool = () => {
  selectedSchool.value = {
    id: undefined,
    name: '',
    dean: '',
    description: '',
    status: 'active',
  }
  isSchoolHandlerSidebarActive.value = true
}

const editSchool = (school: iSchools) => {
  selectedSchool.value = school
  isSchoolHandlerSidebarActive.value = true
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
          title="Filters"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search School"
                style="inline-size: 200px;"
                class="me-3"
              />
            </div>

            <VSpacer />
            <div class="d-flex gap-4 flex-wrap align-center">
              <template v-if="selectedRows.length > 0">
                <VBtn
                  color="error"
                  prepend-icon="tabler-trash"
                  @click="handleDeleteSchool"
                >
                  {{ `Delete (${selectedRows.length})` }}
                </VBtn>
              </template>
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
                @click="addSchool"
              >
                Add School
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
            :items="schools"
            :items-length="totalSchools"
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
              <IconBtn @click="editSchool(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>

              <IconBtn>
                <VIcon icon="tabler-dots-vertical" />
                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      value="delete"
                      prepend-icon="tabler-trash"
                      @click="handleDeleteSchool(item.id)"
                    >
                      Delete
                    </VListItem>

                    <VListItem
                      value="duplicate"
                      prepend-icon="tabler-copy"
                      @click="handleDuplicateSchool(item.id)"
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
                :total-items="totalSchools"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <SchoolSideForm
    v-model:is-drawer-open="isSchoolHandlerSidebarActive"
    v-model:school-data="selectedSchool"
    :fetch-schools="fetchSchools"
  />
</template>
