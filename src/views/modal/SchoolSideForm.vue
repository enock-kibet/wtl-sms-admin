<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { iSchools } from '@/data/models/schools'
import { submitSchool, updateSchool } from '@/pages/schools/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  schoolData?: iSchools
  fetchSchools?: () => Promise<void>
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const schoolFields = ref({
  name: props.schoolData?.name || '',
  dean: props.schoolData?.dean || '',
  description: props.schoolData?.description || '',
  status: props.schoolData?.status || '',
})

const errors = ref<Record<string, string | undefined>>({
  name: undefined,
  dean: undefined,
  description: undefined,
  status: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val) {
    // Reset form fields when drawer is opened
    schoolFields.value = {
      name: props.schoolData?.name || '',
      dean: props.schoolData?.dean || '',
      description: props.schoolData?.description || '',
      status: props.schoolData?.status || '',
    }
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const result = await submitSchool(schoolFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchSchools && await props.fetchSchools()
      emit('update:isDrawerOpen', false)
      showToast('School added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing school
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.schoolData?.id)
      return

    const result = await updateSchool(props.schoolData?.id, schoolFields.value, errors)

    console.log(result)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchSchools && await props.fetchSchools()
      emit('update:isDrawerOpen', false)
      showToast('School updated successfully', 'success')
    }
  })
}

const submitSchoolFunc = () => {
  if (props.schoolData?.id)
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
      :title="props.schoolData?.id ? 'Edit School' : 'Add School'"
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
            @submit.prevent="submitSchoolFunc"
          >
            <VRow>
              <!-- 👉 Title -->
              <VCol cols="12">
                <AppTextField
                  v-model="schoolFields.name"
                  label="Name"
                  placeholder="Name of the school"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Dean -->
              <VCol cols="12">
                <AppTextField
                  v-model="schoolFields.dean"
                  label="Dean"
                  placeholder="Dean of the school"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <!-- 👉 Description -->
              <VCol cols="12">
                <AppTextarea
                  v-model="schoolFields.description"
                  label="Description"
                  placeholder="Description of the school"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="schoolFields.status"
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
                  {{ props.schoolData?.id ? 'Update School' : 'Add School' }}
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
