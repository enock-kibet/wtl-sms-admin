<script setup lang="ts">
import type { Courses } from '@/data/models/courses'
import type { Departments } from '@/data/models/departments'
import type { Instructors } from '@/data/models/instructors'
import type { iAcademicYear } from '@/data/models/schools'
import type { Student, iStudent } from '@/data/models/students'
import StudentSideForm from '@/views/modal/StudentSideForm.vue'

const isStudentHandlerSidebarActive = ref(false)

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

const selectedStudent = ref<iStudent>({
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
const totalStudents = computed(() => studentsData.value.total)

const deleteStudent = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchStudents()
}

const addStudent = () => {
  selectedStudent.value = {
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
  isStudentHandlerSidebarActive.value = true
}

const editStudent = (student: iStudent) => {
  selectedStudent.value = student
  isStudentHandlerSidebarActive.value = true
}

const { data: coursesData, execute: fetchCourses } = await useApi<any>(createUrl('/course/list'))

const courses = computed((): Courses[] => coursesData.value.data)

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

const headers = [
  { title: 'Student Name', key: 'name' },
  { title: 'Academic Year', key: 'academic_year' },
  { title: 'School', key: 'school' },
  { title: 'Department', key: 'department' },
  { title: 'Grades', key: 'grades' },
  { title: 'Attendance', key: 'attendance' },
  { title: 'Status', key: 'status' },
  { title: 'Fails', key: 'fails' },
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
    title: 'All Students',
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
    title: 'Class List',
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
          title="Filter Students"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Student"
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
            :items="students"
            :items-length="totalStudents"
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
              <IconBtn @click="editStudent(item)">
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
                      @click="deleteStudent(item.id)"
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
                :total-items="totalStudents"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <StudentSideForm
    v-model:is-drawer-open="isStudentHandlerSidebarActive"
    v-model:student-data="selectedStudent"
    :fetch-students="fetchStudents"
    :departments-data="departments"
    :course-data="courses"
    :instructors-data="instructors"
  />
</template>
