<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { Courses } from '@/data/models/courses'
import type { Evaluation, iEvaluation } from '@/data/models/evaluations'
import type { iAcademicYear } from '@/data/models/schools'
import type { Student } from '@/data/models/students'
import { submitEvaluation, updateEvaluation } from '@/pages/evaluations/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  evaluationData?: iEvaluation
  evaluationsData?: Evaluation[]
  fetchEvaluations?: () => Promise<void>
  coursesData?: Courses[]
  academicYearsData?: iAcademicYear[]
  studentsData?: Student[]
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const evaluationTypeOther = ref()

const evaluationFields = ref({
  student_id: props.evaluationData?.student_id || '',
  course_id: props.evaluationData?.course_id || '',
  evaluation_type: props.evaluationData?.evaluation_type || '',
  date: props.evaluationData?.date || '',
  score: props.evaluationData?.score || '',
  department_id: props.evaluationData?.department_id || '',
  academic_year_id: props.evaluationData?.academic_year_id || '',
  status: props.evaluationData?.status || '',
  attachments: [] as File[],
})

const errors = ref<Record<string, string | undefined>>({
  student_id: undefined,
  course_id: undefined,
  evaluation_type: undefined,
  date: undefined,
  score: undefined,
  department_id: undefined,
  academic_year_id: undefined,
  status: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val) {
    // Reset form fields when drawer is opened
    evaluationFields.value = {
      student_id: props.evaluationData?.student_id || '',
      course_id: props.evaluationData?.course_id || '',
      evaluation_type: props.evaluationData?.evaluation_type || '',
      date: props.evaluationData?.date || '',
      score: props.evaluationData?.score || '',
      department_id: props.evaluationData?.department_id || '',
      academic_year_id: props.evaluationData?.academic_year_id || '',
      status: props.evaluationData?.status || '',
      attachments: [] as File[],
    }
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const data = new FormData()

    data.append('student_id', evaluationFields.value.student_id)
    data.append('course_id', evaluationFields.value.course_id)
    if (evaluationFields.value.evaluation_type === 'other')
      data.append('evaluation_type', evaluationTypeOther.value)
    else
      data.append('evaluation_type', evaluationFields.value.evaluation_type)
    data.append('date', evaluationFields.value.date)
    data.append('score', evaluationFields.value.score)
    data.append('department_id', evaluationFields.value.department_id)
    data.append('academic_year_id', evaluationFields.value.academic_year_id)
    data.append('status', evaluationFields.value.status)

    if (evaluationFields.value.attachments) {
      evaluationFields.value.attachments.forEach((file: File) => {
        data.append('attachments[]', file)
      })
    }

    const result = await submitEvaluation(data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchEvaluations && await props.fetchEvaluations()
      emit('update:isDrawerOpen', false)
      showToast('Evaluation added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing evaluation
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.evaluationData?.id)
      return

    const data = new FormData()

    data.append('student_id', evaluationFields.value.student_id)
    data.append('course_id', evaluationFields.value.course_id)
    if (evaluationFields.value.evaluation_type === 'other')
      data.append('evaluation_type', evaluationTypeOther.value)
    else
      data.append('evaluation_type', evaluationFields.value.evaluation_type)
    data.append('date', evaluationFields.value.date)
    data.append('score', evaluationFields.value.score)
    data.append('department_id', evaluationFields.value.department_id)
    data.append('academic_year_id', evaluationFields.value.academic_year_id)
    data.append('status', evaluationFields.value.status)

    if (evaluationFields.value.attachments) {
      evaluationFields.value.attachments.forEach((file: File) => {
        data.append('attachments[]', file)
      })
    }

    const result = await updateEvaluation(props.evaluationData?.id, data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchEvaluations && await props.fetchEvaluations()
      emit('update:isDrawerOpen', false)
      showToast('Evaluation updated successfully', 'success')
    }
  })
}

const submitEvaluationFunc = () => {
  if (props.evaluationData?.id)
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
      :title="props.evaluationData?.id ? 'Edit Evaluation' : 'Add Evaluation'"
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
            @submit.prevent="submitEvaluationFunc"
          >
            <VRow>
              <!-- 👉 Student Name -->
              <VCol cols="12">
                <AppSelect
                  v-model="evaluationFields.student_id"
                  :items="studentsData"
                  item-title="name"
                  item-value="id"
                  label="Select Student"
                  placeholder="Name of the student"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Course Title -->
              <VCol cols="12">
                <AppSelect
                  v-model="evaluationFields.course_id"
                  :items="coursesData"
                  item-title="name"
                  item-value="id"
                  label="Course Title"
                  placeholder="Course Title"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="evaluationFields.date"
                  label="Date"
                  placeholder="Date of the evaluation"
                />
              </VCol>

              <!-- Academic Year  -->
              <VCol cols="12">
                <AppSelect
                  v-model="evaluationFields.academic_year_id"
                  :items="academicYearsData"
                  item-title="name"
                  item-value="id"
                  label="Academic Year"
                  placeholder="Select Academic Year"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Evaluation Type -->
              <VCol cols="12">
                <AppSelect
                  v-model="evaluationFields.evaluation_type"
                  :items="[
                    { title: 'Exam', value: 'exam' },
                    { title: 'CAT', value: 'cat' },
                    { title: 'Quiz', value: 'quiz' },
                    { title: 'Assignment', value: 'assignment' },
                    { title: 'Project', value: 'project' },
                    { title: 'Field Skills', value: 'field skills' },
                    { title: 'Any Other', value: 'other' },
                  ]"
                  item-title="title"
                  item-value="value"
                  label="Evaluation Type"
                  placeholder="Select Evaluation Type"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <template v-if="evaluationFields.evaluation_type === 'other'">
                <VCol cols="12">
                  <AppTextField
                    v-model="evaluationTypeOther"
                    label="Specify Evaluation Type"
                    placeholder="Evaluation Type"
                    :rules="[requiredValidator]"
                  />
                </VCol>
              </template>

              <!-- Score -->
              <VCol cols="12">
                <AppTextField
                  v-model="evaluationFields.score"
                  label="Score"
                  placeholder="Score"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Attachments -->
              <VCol cols="12">
                <VFileInput
                  v-model="evaluationFields.attachments"
                  multiple
                  placeholder="Upload attachments"
                  label="Attachments"
                  prepend-icon="tabler-paperclip"
                >
                  <template #selection="{ fileNames }">
                    <template
                      v-for="fileName in fileNames"
                      :key="fileName"
                    >
                      <VChip
                        label
                        size="small"
                        color="primary"
                        class="me-2"
                      >
                        {{ fileName }}
                      </VChip>
                    </template>
                  </template>
                </VFileInput>
              </VCol>

              <!-- 👉 Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="evaluationFields.status"
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
                  {{ props.evaluationData?.id ? 'Update Evaluation' : 'Add Evaluation' }}
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
