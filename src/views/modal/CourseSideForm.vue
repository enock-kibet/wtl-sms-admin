<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { Courses, iCourses } from '@/data/models/courses'
import type { Departments } from '@/data/models/departments'
import type { Instructors } from '@/data/models/instructors'
import { submitCourse, updateCourse } from '@/pages/courses/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  courseData?: iCourses
  coursesData?: Courses[]
  fetchCourses?: () => Promise<void>
  departmentsData?: Departments[]
  instructorsData?: Instructors[]
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const courseFields = ref({
  name: props.courseData?.name || '',
  course_code: props.courseData?.course_code || '',
  description: props.courseData?.description || '',
  department_id: props.courseData?.department_id || '',
  academic_year_id: props.courseData?.academic_year_id || '',
  instructors: props.courseData?.instructors || undefined,
  attachments: props.courseData?.attachments || [],
  status: props.courseData?.status || 'active',
})

const errors = ref<Record<string, string | undefined>>({
  course_code: undefined,
  name: undefined,
  department_id: undefined,
  description: undefined,
  academic_year_id: undefined,
  instructors: undefined,
  status: undefined,
  attachments: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val) {
    // Reset form fields when drawer is opened
    courseFields.value = {
      course_code: props.courseData?.course_code || '',
      name: props.courseData?.name || '',
      department_id: props.courseData?.department_id || '',
      description: props.courseData?.description || '',
      academic_year_id: props.courseData?.academic_year_id || '',
      instructors: props.courseData?.instructors || undefined,
      status: props.courseData?.status || 'active',
      attachments: props.courseData?.attachments || [],
    }
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const data = new FormData()

    data.append('name', courseFields.value.name)
    data.append('course_code', courseFields.value.course_code)
    data.append('description', courseFields.value.description)
    data.append('department_id', courseFields.value.department_id)
    data.append('academic_year_id', courseFields.value.academic_year_id)
    data.append('status', courseFields.value.status)

    if (courseFields.value.instructors) {
      courseFields.value.instructors.forEach((instructorId: string) => {
        data.append('instructors[]', instructorId)
      })
    }
    if (courseFields.value.attachments) {
      courseFields.value.attachments.forEach((file: File) => {
        data.append('attachments[]', file)
      })
    }

    const result = await submitCourse(data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchCourses && await props.fetchCourses()
      emit('update:isDrawerOpen', false)
      showToast('Course added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing course
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.courseData?.id)
      return

    const data = new FormData()

    data.append('name', courseFields.value.name)
    data.append('course_code', courseFields.value.course_code)
    data.append('description', courseFields.value.description)
    data.append('department_id', courseFields.value.department_id)
    data.append('academic_year_id', courseFields.value.academic_year_id)
    data.append('status', courseFields.value.status)
    if (courseFields.value.instructors) {
      courseFields.value.instructors.forEach((instructorId: string) => {
        data.append('instructors[]', instructorId)
      })
    }
    if (courseFields.value.attachments) {
      courseFields.value.attachments.forEach((file: File) => {
        data.append('attachments[]', file)
      })
    }

    const result = await updateCourse(props.courseData?.id, data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchCourses && await props.fetchCourses()
      emit('update:isDrawerOpen', false)
      showToast('Course updated successfully', 'success')
    }
  })
}

const submitCourseFunc = () => {
  if (props.courseData?.id)
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
      :title="props.courseData?.id ? 'Edit Course' : 'Add Course'"
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
            @submit.prevent="submitCourseFunc"
          >
            <VRow>
              <!-- 👉 Name -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppTextField
                  v-model="courseFields.name"
                  label="Name"
                  placeholder="Name of the course"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Course Code -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppTextField
                  v-model="courseFields.course_code"
                  label="Course Code"
                  placeholder="Course Code"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Departments -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppSelect
                  v-model="courseFields.department_id"
                  :items="departmentsData"
                  item-title="name"
                  item-value="id"
                  label="Department"
                  placeholder="Select Department"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Instructors -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppSelect
                  v-model="courseFields.instructors"
                  :items="instructorsData"
                  item-title="name"
                  item-value="id"
                  chips
                  multiple
                  closable-chips
                  label="Instructor"
                  placeholder="Select Instructor"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Attachments -->
              <VCol
                cols="12"
                class="py-2"
              >
                <VFileInput
                  v-model="courseFields.attachments"
                  multiple
                  placeholder="Upload Course Outline"
                  label="Upload Course Outline"
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

              <!-- 👉 Description -->
              <VCol
                cols="12"
                class="py-2"
              >
                <label class="mb-2 d-block">Comments</label>
                <TiptapEditor
                  v-model="courseFields.description"
                  class="border rounded basic-editor"
                  placeholder="Comments"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol
                cols="12"
                class="py-2"
              >
                <AppSelect
                  v-model="courseFields.status"
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
                  {{ props.courseData?.id ? 'Update Course' : 'Add Course' }}
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
