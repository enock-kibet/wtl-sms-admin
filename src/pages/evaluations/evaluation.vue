<script setup lang="ts">
import type { Courses } from '@/data/models/courses'
import type { Evaluation, iEvaluation } from '@/data/models/evaluations'
import type { iAcademicYear } from '@/data/models/schools'
import type { Student } from '@/data/models/students'
import EvaluationSideForm from '@/views/modal/EvaluationSideForm.vue'

const isEvaluationHandlerSidebarActive = ref(false)

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

const selectedEvaluation = ref<iEvaluation>({
  id: undefined,
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  reg_no: '',
  department_id: '',
  academic_year_id: '',
  status: '',
  fails: '',
})

const { data: evaluationsData, execute: fetchEvaluations } = await useApi<any>(createUrl('/administrator/evaluations',
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

const evaluations = computed((): Evaluation[] => evaluationsData.value.data)
const totalEvaluations = computed(() => evaluationsData.value.total)

const deleteEvaluation = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchEvaluations()
}

const addEvaluation = () => {
  selectedEvaluation.value = {
    id: undefined,
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    reg_no: '',
    department_id: '',
    academic_year_id: '',
    status: '',
    fails: '',
  }
  isEvaluationHandlerSidebarActive.value = true
}

const editEvaluation = (evaluation: iEvaluation) => {
  selectedEvaluation.value = evaluation
  isEvaluationHandlerSidebarActive.value = true
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

const { data: studentsData, execute: fetchStudents } = await useApi<any>(createUrl('/administrator/students',
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

const students = computed((): Student[] => studentsData.value.data)

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
  { title: 'Student Name', key: 'student' },
  { title: 'Academic Year', key: 'academic_year' },
  { title: 'Course', key: 'course' },
  { title: 'Lecturer', key: 'lecturer' },
  { title: 'Grades', key: 'grades' },
  { title: 'Score', key: 'score' },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },

  // { title: 'Fails', key: 'fails' },
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

const statisticsHorizontal = [
  {
    title: 'All Evaluations',
    color: 'primary',
    icon: 'tabler-school',
    stats: '21,459',
  },
  {
    title: 'All Lectures',
    color: 'success',
    icon: 'tabler-users',
    stats: '50',
  },
  {
    title: 'Graduates List',
    color: 'warning',
    icon: 'tabler-user-exclamation',
    stats: '200',
  },
  {
    title: 'Quality of Grades',
    color: 'success',
    icon: 'tabler-user-check',
    stats: 'Av B+',
  },
  {
    title: 'Fails',
    color: 'error',
    icon: 'tabler-school-off',
    stats: 'Av B+',
  },
]
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCard
          title="Filter Evaluations"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Evaluation"
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
                @click="addEvaluation"
              >
                Add Evaluation
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
            :items="evaluations"
            :items-length="totalEvaluations"
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
              <IconBtn @click="editEvaluation(item)">
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
                      @click="deleteEvaluation(item.id)"
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
                :total-items="totalEvaluations"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <EvaluationSideForm
    v-model:is-drawer-open="isEvaluationHandlerSidebarActive"
    v-model:evaluation-data="selectedEvaluation"
    :fetch-evaluations="fetchEvaluations"
    :courses-data="courses"
    :academic-years-data="academicYears"
    :students-data="students"
  />
</template>
