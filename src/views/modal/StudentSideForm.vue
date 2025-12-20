<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { Courses } from '@/data/models/courses'
import type { Departments } from '@/data/models/departments'
import type { Instructors } from '@/data/models/instructors'
import type { iAcademicYear } from '@/data/models/schools'
import type { Student, iStudent } from '@/data/models/students'
import { submitStudent, updateStudent } from '@/pages/attendance-reports/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  studentData?: iStudent
  studentsData?: Student[]
  fetchStudents?: () => Promise<void>
  departmentsData?: Departments[]
  academicYearsData?: iAcademicYear[]
  instructorsData?: Instructors[]
  courseData?: Courses[]
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const studentFields = ref({
  first_name: props.studentData?.first_name || '',
  last_name: props.studentData?.last_name || '',
  phone: props.studentData?.phone || '',
  email: props.studentData?.email || '',
  reg_no: props.studentData?.reg_no || '',
  academic_year_id: props.studentData?.academic_year_id || undefined,
  department_id: props.studentData?.department_id || '',
  course_ids: props.studentData?.course_ids || undefined,
  status: props.studentData?.status || 'active',
  fails: props.studentData?.fails || '',
})

const errors = ref<Record<string, string | undefined>>({
  first_name: undefined,
  last_name: undefined,
  phone: undefined,
  email: undefined,
  reg_no: undefined,
  department_id: undefined,
  course_ids: undefined,
  status: undefined,
  fails: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val && props.studentData?.id) {
    studentFields.value = {
      first_name: props.studentData?.first_name || '',
      last_name: props.studentData?.last_name || '',
      phone: props.studentData?.phone || '',
      email: props.studentData?.email || '',
      reg_no: props.studentData?.reg_no || '',
      department_id: props.studentData?.department_id || '',
      academic_year_id: props.studentData?.academic_year_id || undefined,
      course_ids: props.studentData?.course_ids || undefined,
      status: props.studentData?.status || 'active',
      fails: props.studentData?.fails || '',
    }
  }
  else {
    // Reset form fields when drawer is opened
    refForm.value?.reset()
    refForm.value?.resetValidation()
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const result = await submitStudent(studentFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchStudents && await props.fetchStudents()
      emit('update:isDrawerOpen', false)
      showToast('Student added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing student
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.studentData?.id)
      return

    const result = await updateStudent(props.studentData?.id, studentFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchStudents && await props.fetchStudents()
      emit('update:isDrawerOpen', false)
      showToast('Student updated successfully', 'success')
    }
  })
}

const submitStudentFunc = () => {
  if (props.studentData?.id)
    handleUpdate()

  else
    handleSubmit()
}

// 👉 Form

const onCancel = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    data-allow-mismatch
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="370"
    :border="0"
    class="scrollable-content"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="props.studentData?.id ? 'Edit Student' : 'Add Student'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <!--
          <IconBtn
          v-show="event.id"
          @click="removeEvent"
          >
          <VIcon
          size="18"
          icon="tabler-trash"
          />
          </IconBtn>
        -->
      </template>
    </AppDrawerHeaderSection>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm
            ref="refForm"
            @submit.prevent="submitStudentFunc"
          >
            <VRow>
              <!-- 👉 First Name -->
              <VCol cols="6">
                <AppTextField
                  v-model="studentFields.first_name"
                  label="First Name"
                  placeholder="First Name of the student"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol cols="6">
                <AppTextField
                  v-model="studentFields.last_name"
                  label="Last Name"
                  placeholder="Last Name of the student"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Registration Number -->
              <VCol cols="12">
                <AppTextField
                  v-model="studentFields.reg_no"
                  label="Registration Number"
                  placeholder="Registration Number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Phone Number -->
              <VCol cols="12">
                <AppTextField
                  v-model="studentFields.phone"
                  label="Phone Number"
                  placeholder="Phone Number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="studentFields.email"
                  label="Email"
                  placeholder="Email"
                  :rules="[emailValidator]"
                />
              </VCol>

              <!-- Departments -->
              <VCol cols="12">
                <AppSelect
                  v-model="studentFields.department_id"
                  :items="departmentsData"
                  item-title="name"
                  item-value="id"
                  label="Department"
                  placeholder="Select Department"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Course  -->
              <VCol cols="12">
                <AppSelect
                  v-model="studentFields.course_ids"
                  :items="courseData"
                  item-title="name"
                  item-value="id"
                  label="Course"
                  chips
                  multiple
                  closable-chips
                  placeholder="Select Course"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Academic Year  -->
              <VCol cols="12">
                <AppSelect
                  v-model="studentFields.academic_year_id"
                  :items="academicYearsData"
                  item-title="name"
                  item-value="id"
                  label="Academic Year"
                  placeholder="Select Academic Year"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="studentFields.status"
                  :items="status"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  placeholder="Select Status"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  {{ props.studentData?.id ? 'Update Student' : 'Add Student' }}
                </VBtn>
                <VBtn
                  variant="outlined"
                  color="secondary"
                  @click="onCancel"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
