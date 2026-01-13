<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { Courses } from '@/data/models/courses'
import type { Topic, iTopic } from '@/data/models/topics'
import { submitTopic, updateTopic } from '@/pages/courses/topics/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  topicData?: iTopic
  topicsData?: Topic[]
  fetchTopics?: () => Promise<void>
  coursesData?: Courses[]
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const semesters = [
  { title: 'First Semester', value: '1' },
  { title: 'Second Semester', value: '2' },
  { title: 'Third Semester', value: '3' },
]

const topicFields = ref({
  course_id: props.topicData?.course_id || '',
  semester: props.topicData?.semester || '',
  title: props.topicData?.title || '',
  description: props.topicData?.description || '',
  status: props.topicData?.status || 'active',
})

const errors = ref<Record<string, string | undefined>>({
  course_id: undefined,
  semester: undefined,
  title: undefined,
  description: undefined,
  status: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val) {
    // Reset form fields when drawer is opened
    topicFields.value = {
      course_id: props.topicData?.course_id || '',
      semester: props.topicData?.semester || '',
      title: props.topicData?.title || '',
      description: props.topicData?.description || '',
      status: props.topicData?.status || 'active',
    }
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const result = await submitTopic(topicFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchTopics && await props.fetchTopics()
      emit('update:isDrawerOpen', false)
      showToast('Topic added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing topic
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.topicData?.id)
      return

    const result = await updateTopic(props.topicData?.id, topicFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchTopics && await props.fetchTopics()
      emit('update:isDrawerOpen', false)
      showToast('Topic updated successfully', 'success')
    }
  })
}

const submitTopicFunc = () => {
  if (props.topicData?.id)
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
      :title="props.topicData?.id ? 'Edit Topic' : 'Add Topic'"
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
            @submit.prevent="submitTopicFunc"
          >
            <VRow>
              <!-- 👉 Course Title -->
              <VCol cols="12">
                <AppSelect
                  v-model="topicFields.course_id"
                  :items="coursesData"
                  item-title="name"
                  item-value="id"
                  label="Course Title"
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
                  v-model="topicFields.semester"
                  :items="semesters"
                  item-title="title"
                  item-value="value"
                  label="Semester"
                  placeholder="Select Semester"
                  :rules="[requiredValidator]"
                  :error-messages="errors.semester"
                />
              </VCol>

              <!-- Title -->
              <VCol cols="12">
                <AppTextField
                  v-model="topicFields.title"
                  label="Title"
                  placeholder="Title"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Description -->
              <VCol
                cols="12"
                class="py-2"
              >
                <label class="mb-2 d-block">Comments</label>
                <TiptapEditor
                  v-model="topicFields.description"
                  class="border rounded basic-editor"
                  placeholder="Comments"
                />
              </VCol>

              <!-- Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="topicFields.status"
                  :items="status"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  placeholder="Select Status"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Form buttons -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  {{ props.topicData?.id ? 'Update Topic' : 'Add Topic' }}
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
