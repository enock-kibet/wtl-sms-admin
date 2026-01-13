<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { Classes, iClasses } from '@/data/models/classes'
import type { Courses } from '@/data/models/courses'
import type { Departments } from '@/data/models/departments'
import type { Instructors } from '@/data/models/instructors'
import type { iAcademicYear } from '@/data/models/schools'
import type { Topic } from '@/data/models/topics'
import { submitClass, updateClass } from '@/pages/classes/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
  (e: 'update:courseId', val: string): void
  (e: 'update:semester', val: string): void
}>()

interface Props {
  isDrawerOpen: boolean
  classData?: iClasses
  classesData?: Classes[]
  fetchClasses?: () => Promise<void>
  departmentsData?: Departments[]
  academicYearsData?: iAcademicYear[]
  instructorData?: Instructors[]
  coursesData?: Courses[]
  topicsData?: Topic[]
  fetchTopics?: () => Promise<void>
  courseId?: string
  semester?: string
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const semesters = [
  { title: 'First Semester', value: 1 },
  { title: 'Second Semester', value: 2 },
  { title: 'Third Semester', value: 3 },
]

const employmentTypes = ref([
  { title: 'Internal Full-Time', value: 'internal_full_time' },
  { title: 'External Full-Time', value: 'external_full_time' },
  { title: 'Internal Part-Time', value: 'internal_part_time' },
  { title: 'External Part-Time', value: 'external_part_time' },
  { title: 'Adjunct Part-Time', value: 'adjunct_part_time' },
])

const classFields = ref({
  topic_id: props.classData?.topic_id || undefined,
  semester: props.classData?.semester || undefined,
  scheduled_at: props.classData?.scheduled_at || '',
  duration: props.classData?.duration || '',
  description: props.classData?.description || '',
  course_id: props.classData?.course_id || undefined,
  instructor_id: props.classData?.instructor_id || undefined,
  inst_employment_type: props.classData?.inst_employment_type || undefined,
  attachments: props.classData?.attachments || [],
  link: props.classData?.link || '',
  status: props.classData?.status || 'active',
})

const errors = ref<Record<string, string | undefined>>({
  scheduled_at: undefined,
  duration: undefined,
  course_id: undefined,
  topic_id: undefined,
  department_id: undefined,
  description: undefined,
  academic_year_id: undefined,
  instructor: undefined,
  inst_employment_type: undefined,
  status: undefined,
  attachments: undefined,
  link: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val) {
    // Reset form fields when drawer is opened
    classFields.value = {
      scheduled_at: props.classData?.scheduled_at || '',
      topic_id: props.classData?.topic_id || undefined,
      semester: props.classData?.semester || undefined,
      duration: props.classData?.duration || '',
      description: props.classData?.description || '',
      inst_employment_type: props.classData?.inst_employment_type || '',
      instructor_id: props.classData?.instructor_id || undefined,
      status: props.classData?.status || 'active',
      attachments: props.classData?.attachments || [],
      course_id: props.classData?.course_id || undefined,
      link: props.classData?.link || '',
    }
  }
  console.log(props.classData?.scheduled_at)
})

watch(() => classFields.value.course_id, async val => {
  if (val) {
    emit('update:courseId', val)
    props.fetchTopics && await props.fetchTopics()
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const data = new FormData()

    data.append('topic_id', classFields.value.topic_id ?? '')
    data.append('scheduled_at', classFields.value.scheduled_at)
    data.append('duration', classFields.value.duration)
    data.append('description', classFields.value.description)
    data.append('semester', classFields.value.semester ?? '')
    data.append('course_id', classFields.value.course_id ?? '')
    data.append('link', classFields.value.link)
    data.append('status', classFields.value.status)

    if (classFields.value.instructor_id) {
      data.append('instructor_id', classFields.value.instructor_id)
      data.append('inst_employment_type', classFields.value.inst_employment_type ?? '')
    }

    if (classFields.value.attachments) {
      classFields.value.attachments.forEach((file: File) => {
        data.append('attachments[]', file)
      })
    }

    const result = await submitClass(data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchClasses && await props.fetchClasses()
      emit('update:isDrawerOpen', false)
      showToast('Class added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing class
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.classData?.id)
      return

    const data = new FormData()

    data.append('topic_id', classFields.value.topic_id ?? '')
    data.append('scheduled_at', classFields.value.scheduled_at)
    data.append('duration', classFields.value.duration)
    data.append('description', classFields.value.description)
    data.append('semester', classFields.value.semester ?? '')
    data.append('course_id', classFields.value.course_id ?? '')
    data.append('link', classFields.value.link)
    data.append('status', classFields.value.status)

    if (classFields.value.instructor_id) {
      data.append('instructor_id', classFields.value.instructor_id)
      data.append('inst_employment_type', classFields.value.inst_employment_type ?? '')
    }

    if (classFields.value.attachments) {
      classFields.value.attachments.forEach((file: File) => {
        data.append('attachments[]', file)
      })
    }

    const result = await updateClass(props.classData?.id, data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchClasses && await props.fetchClasses()
      emit('update:isDrawerOpen', false)
      showToast('Class updated successfully', 'success')
    }
  })
}

const submitClassFunc = () => {
  if (props.classData?.id)
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
    width="470"
    :border="0"
    class="scrollable-content"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="props.classData?.id ? 'Edit Class' : 'Add Class'"
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
            @submit.prevent="submitClassFunc"
          >
            <VRow>
              <!-- Courses -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppSelect
                  v-model="classFields.course_id"
                  :items="coursesData"
                  item-title="name"
                  item-value="id"
                  label="Course"
                  placeholder="Select Course"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Semester -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppSelect
                  v-model="classFields.semester"
                  :items="semesters"
                  item-title="title"
                  item-value="value"
                  label="Semester"
                  placeholder="Select Semester"
                  :rules="[requiredValidator]"
                  :error-messages="errors.semester"
                />
              </VCol>

              <!-- 👉 Name -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppAutocomplete
                  v-model="classFields.topic_id"
                  :items="topicsData"
                  item-title="title"
                  item-value="id"
                  chips
                  closable-chips
                  label="Topic"
                  placeholder="Select Class Topic"
                  :rules="[requiredValidator]"
                  :error-messages="errors.semester"
                />
              </VCol>

              <!-- instructor -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppAutocomplete
                  v-model="classFields.instructor_id"
                  :items="instructorData"
                  item-title="name"
                  item-value="id"
                  chips
                  closable-chips
                  label="Lecturer"
                  placeholder="Select Lecturer"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Employment Type -->
              <VCol cols="12">
                <AppSelect
                  v-model="classFields.inst_employment_type"
                  :items="employmentTypes"
                  item-title="title"
                  item-value="value"
                  label="Lecturer Employment Type"
                  placeholder="Select Employment Type"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Date -->
              <VCol
                cols="12"
                md="8"
                class="py-2"
              >
                <AppDateTimePicker
                  v-model="classFields.scheduled_at"
                  label="Date"
                  placeholder="Select date"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Duration -->
              <VCol
                cols="12"
                md="4"
                class="py-2"
              >
                <AppTextField
                  v-model="classFields.duration"
                  label="Duration (minutes)"
                  type="number"
                  placeholder="Duration"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Link -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppTextField
                  v-model="classFields.link"
                  label="Link to online class"
                  placeholder="Link to online class"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Attachments -->
              <!--
                <VCol
                cols="12"
                class="py-2"
                >
                <VFileInput
                v-model="classFields.attachments"
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
              -->

              <!-- 👉 Description -->
              <VCol
                cols="12"
                class="py-2"
              >
                <label class="mb-2 d-block">Comments</label>
                <TiptapEditor
                  v-model="classFields.description"
                  class="border rounded basic-editor"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppSelect
                  v-model="classFields.status"
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
                  {{ props.classData?.id ? 'Update Class' : 'Add Class' }}
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
