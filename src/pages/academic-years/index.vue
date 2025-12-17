<script setup lang="ts">
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
  start_date: '',
  end_date: '',
  status: '',
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
const totalAcademicYears = computed(() => academicYearsData.value.total)

const deleteAcademicYear = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchAcademicYears()
}

const addAcademicYear = () => {
  selectedYear.value = {
    id: undefined,
    name: '',
    icon: null,
    description: '',
    start_date: '',
    end_date: '',
    status: '',
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
        md="9"
        class="py-0"
      >
        <h4 class="text-h5">
          Academic Years
        </h4>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          @click="addAcademicYear"
        >
          Add Academic Year
        </VBtn>
      </VCol>
      <template
        v-for="year in academicYears"
        :key="year.id"
      >
        <VCol
          cols="12"
          md="3"
        >
          <VCard class="mb-6 text-center position-relative">
            <div class="position-absolute right-0">
              <IconBtn @click="editAcademicYear(year)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
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
    </VRow>
  </div>
  <AcademicYearForm
    v-model:is-drawer-open="isSchoolHandlerSidebarActive"
    v-model:year-data="selectedYear"
    :fetch-academic-years="fetchAcademicYears"
  />
</template>
