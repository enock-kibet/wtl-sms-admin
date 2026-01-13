<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { Departments } from '@/data/models/departments'
import type { Instructors, iInstructors } from '@/data/models/instructors'
import type { Schools } from '@/data/models/schools'
import { submitInstructor, updateInstructor } from '@/pages/attendance-reports/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  instructorData?: iInstructors
  instructorsData?: Instructors[]
  fetchInstructors?: () => Promise<void>
  departmentsData?: Departments[]
  schoolsData?: Schools[]
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const employmentTypes = ref([
  { title: 'Internal Full-Time', value: 'internal_full_time' },
  { title: 'External Full-Time', value: 'external_full_time' },
  { title: 'Internal Part-Time', value: 'internal_part_time' },
  { title: 'External Part-Time', value: 'external_part_time' },
  { title: 'Adjunct Part-Time', value: 'adjunct_part_time' },
])

const instructorFields = ref({
  title: props.instructorData?.title || '',
  first_name: props.instructorData?.first_name || '',
  last_name: props.instructorData?.last_name || '',
  phone: props.instructorData?.phone || '',
  pf_number: props.instructorData?.pf_number || '',
  employment_type: props.instructorData?.employment_type || '',
  email: props.instructorData?.email || '',
  faculty_id: props.instructorData?.faculty_id || '',
  department_id: props.instructorData?.department_id || '',
  status: props.instructorData?.status || '',
  sendActivationLink: false,
})

const errors = ref<Record<string, string | undefined>>({
  first_name: undefined,
  last_name: undefined,
  phone: undefined,
  email: undefined,
  pf_number: undefined,
  reg_no: undefined,
  department_id: undefined,
  academic_year_id: undefined,
  status: undefined,
  fails: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val && props.instructorData?.id) {
    instructorFields.value = {
      title: props.instructorData?.title || '',
      first_name: props.instructorData?.first_name || '',
      last_name: props.instructorData?.last_name || '',
      phone: props.instructorData?.phone || '',
      pf_number: props.instructorData?.pf_number || '',
      employment_type: props.instructorData?.employment_type || '',
      email: props.instructorData?.email || '',
      faculty_id: props.instructorData?.faculty_id || '',
      department_id: props.instructorData?.department_id || '',
      status: props.instructorData?.status || '',
      sendActivationLink: false,
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

    const result = await submitInstructor(instructorFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchInstructors && await props.fetchInstructors()
      emit('update:isDrawerOpen', false)
      showToast('Instructor added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing instructor
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.instructorData?.id)
      return

    const result = await updateInstructor(props.instructorData?.id, instructorFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchInstructors && await props.fetchInstructors()
      emit('update:isDrawerOpen', false)
      showToast('Instructor updated successfully', 'success')
    }
  })
}

const submitInstructorFunc = () => {
  if (props.instructorData?.id)
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
      :title="props.instructorData?.id ? 'Edit Instructor' : 'Add Instructor'"
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
            @submit.prevent="submitInstructorFunc"
          >
            <VRow>
              <!-- Title  -->
              <VCol
                cols="12"
                class="pb-1"
              >
                <AppSelect
                  v-model="instructorFields.title"
                  :items="['Dr', 'Prof', 'Mr', 'Mrs', 'Miss']"
                  :rules="[requiredValidator]"
                  label="Title"
                  placeholder="Select your title"
                  :error-messages="errors.title"
                />
              </VCol>

              <!-- 👉 First Name -->
              <VCol cols="6">
                <AppTextField
                  v-model="instructorFields.first_name"
                  label="First Name"
                  placeholder="First Name of the instructor"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol cols="6">
                <AppTextField
                  v-model="instructorFields.last_name"
                  label="Last Name"
                  placeholder="Last Name of the instructor"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 PF Number -->
              <VCol cols="12">
                <AppTextField
                  v-model="instructorFields.pf_number"
                  label="PF Number"
                  placeholder="PF Number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Phone Number -->
              <VCol cols="12">
                <AppTextField
                  v-model="instructorFields.phone"
                  label="Phone Number"
                  placeholder="Phone Number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="instructorFields.email"
                  label="Email"
                  placeholder="Email"
                  :rules="[emailValidator]"
                />
              </VCol>

              <!-- Employment Type -->
              <VCol cols="12">
                <AppSelect
                  v-model="instructorFields.employment_type"
                  :items="employmentTypes"
                  item-title="title"
                  item-value="value"
                  label="Employment Type"
                  placeholder="Select Employment Type"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Schools -->
              <VCol cols="12">
                <AppSelect
                  v-model="instructorFields.faculty_id"
                  :items="schoolsData"
                  item-title="name"
                  item-value="id"
                  label="School"
                  placeholder="Select School"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Departments -->
              <VCol cols="12">
                <AppSelect
                  v-model="instructorFields.department_id"
                  :items="departmentsData"
                  item-title="name"
                  item-value="id"
                  label="Department"
                  placeholder="Select Department"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="instructorFields.status"
                  :items="status"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  placeholder="Select Status"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex align-center">
                  <VCheckbox
                    id="activationLink"
                    v-model="instructorFields.sendActivationLink"
                    inline
                  />
                  <VLabel
                    for="privacy-policy"
                    style="opacity: 1;"
                  >
                    <span class="me-1 text-high-emphasis">Send password reset to email?</span>
                  </VLabel>
                </div>
              </VCol>

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  {{ props.instructorData?.id ? 'Update Lecturer' : 'Add Lecturer' }}
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
