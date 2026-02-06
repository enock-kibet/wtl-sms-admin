<script setup lang="ts">
import Swal from 'sweetalert2'
import { deleteAcademicYear, duplicateAcademicYear } from './core/request'
import type { iAcademicYear } from '@/data/models/schools'
import AcademicYearForm from '@/views/modal/AcademicYearForm.vue'

// 👉 Event
// const event = ref(structuredClone(blankEvent))
const isSchoolHandlerSidebarActive = ref(false)

// watch(isEventHandlerSidebarActive, val => {
//   if (!val)
//     event.value = structuredClone(blankEvent)
// })

const headers = [
  { title: 'Academic Year Name', key: 'name' },
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

const selectedYear = ref<iAcademicYear>({
  id: undefined,
  name: '',
  description: '',
  status: '',
  start_date: '',
  end_date: '',
})

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'active')
    return { text: 'Active', color: 'success' }
  if (statusMsg === 'inactive')
    return { text: 'Inactive', color: 'error' }

  return { text: statusMsg, color: 'default' }
}

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
const totalAcademicYears = computed(() => academicYearsData.value.meta.total)

const handleDeleteAcademicYear = async (id: string) => {
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
      const res = await deleteAcademicYear(uuids)
      if (res) {
        showToast('Academic Year deleted successfully', 'success')
        selectedRows.value = []
      }
    }
    else {
      await deleteAcademicYear([id])
      showToast('Academic year deleted successfully', 'success')
      selectedRows.value = []
    }

    // Refetch products
    fetchAcademicYears()
  }
}

const handleDuplicateAcademicYear = async (id: string) => {
  const res = await duplicateAcademicYear(id)

  if (res)
    showToast('Faculty duplicated successfully', 'success')

  // Refetch products
  fetchAcademicYears()
}

const addAcademicYear = () => {
  selectedYear.value = {
    id: undefined,
    name: '',
    icon: null,
    description: '',
    status: '',
    start_date: '',
    end_date: '',
  }
  isSchoolHandlerSidebarActive.value = true
}

const editAcademicYear = (year: iAcademicYear) => {
  selectedYear.value = year
  isSchoolHandlerSidebarActive.value = true
}
</script>

<template>
  <div>
    <VRow class="match-height my-4">
      <VCol
        cols="12"
        md="6"
        class="py-0"
      >
        <h4 class="text-h5">
          Academic Years
        </h4>
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <div class="d-flex float-end gap-3">
          <template v-if="selectedRows.length > 0">
            <VBtn
              color="error"
              prepend-icon="tabler-trash"
              @click="handleDeleteAcademicYear"
            >
              {{ `Delete (${selectedRows.length})` }}
            </VBtn>
          </template>
          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="addAcademicYear"
          >
            Add Academic Year
          </VBtn>
        </div>
      </VCol>
      <template v-if="academicYears.length > 0">
        <template
          v-for="year in academicYears"
          :key="year.id"
        >
          <VCol
            cols="12"
            md="3"
          >
            <VCard
              class="mb-6 text-center position-relative"
              flat
            >
              <div class="position-absolute right-0">
                <div class="d-flexx">
                  <VCheckbox
                    v-model="selectedRows"
                    :value="year.id"
                  />
                  <div class="">
                    <IconBtn
                      color="primary"
                      @click="editAcademicYear(year)"
                    >
                      <VIcon icon="tabler-edit" />
                    </IconBtn>
                  </div>
                  <div class="">
                    <IconBtn
                      color="success"
                      @click="handleDuplicateAcademicYear(year.id ?? '')"
                    >
                      <VIcon icon="tabler-copy" />
                    </IconBtn>
                  </div>
                  <div class="">
                    <IconBtn
                      color="error"
                      @click="handleDeleteAcademicYear(year.id ?? '')"
                    >
                      <VIcon icon="tabler-trash" />
                    </IconBtn>
                  </div>
                </div>
              </div>
              <VCardText>
                <template v-if="year.icon_url">
                  <img
                    :src="year.icon_url"
                    width="200"
                  >
                </template>
                <template v-else>
                  <VAvatar
                    color="primary"
                    :size="50"
                    rounded
                    variant="tonal"
                  >
                    <VIcon icon="tabler-calendar-month" />
                  </VAvatar>
                </template>
              </VCardText>
              <VCardText class="pb-2">
                <h4>{{ year.name }}</h4>
                <p>{{ year.description }}</p>
              </VCardText>
              <VCardText>
                <VBtn
                  class=""
                  variant="tonal"
                >
                  View Courses
                </VBtn>
              </VCardText>
            </VCard>
          </VCol>
        </template>
        <!-- pagination -->
        <VCol cols="12">
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalAcademicYears"
          />
        </VCol>
      </template>
      <template v-else>
        <VCol
          cols="12"
          md="12"
        >
          <VAlert
            color="primary"
            variant="tonal"
          >
            There are no academic years set!
          </VAlert>
        </VCol>
      </template>
    </VRow>
  </div>
  <AcademicYearForm
    v-model:is-drawer-open="isSchoolHandlerSidebarActive"
    v-model:year-data="selectedYear"
    :fetch-academic-years="fetchAcademicYears"
  />
</template>
