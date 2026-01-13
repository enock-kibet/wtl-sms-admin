<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { iAcademicYear } from '@/data/models/schools'
import { submitAcademicYear, updateAcademicYear } from '@/pages/academic-years/core/request'
import AcademicYearDropZone from '@/views/dropzone/AcademicYearDropZone.vue'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  yearData?: iAcademicYear
  fetchAcademicYears?: () => Promise<void>
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const yearFields = ref({
  name: props.yearData?.name || '',
  description: props.yearData?.description || '',
  start_date: props.yearData?.start_date || '',
  end_date: props.yearData?.end_date || '',
  icon: null,
  status: props.yearData?.status || 'active',
})

const errors = ref<Record<string, string | undefined>>({
  name: undefined,
  description: undefined,
  year_of_admission: undefined,
  estimated_exit: undefined,
  icon: undefined,
  start_date: undefined,
  end_date: undefined,
  status: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val) {
    // Reset form fields when drawer is opened
    yearFields.value = {
      name: props.yearData?.name || '',
      description: props.yearData?.description || '',
      start_date: props.yearData?.start_date || '',
      end_date: props.yearData?.end_date || '',
      icon: null,
      status: props.yearData?.status || 'active',
    }
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const formData = new FormData()

    formData.append('name', yearFields.value.name)
    formData.append('description', yearFields.value.description)
    formData.append('start_date', yearFields.value.start_date)
    formData.append('end_date', yearFields.value.end_date)
    formData.append('status', yearFields.value.status)
    if (yearFields.value.icon)
      formData.append('icon', yearFields.value.icon)

    const result = await submitAcademicYear(formData, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchAcademicYears && await props.fetchAcademicYears()
      emit('update:isDrawerOpen', false)
      showToast('Academic Year added successfully', 'success')
      refForm.value?.reset()
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing school
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.yearData?.id)
      return

    const data = new FormData()

    data.append('name', yearFields.value.name)
    data.append('description', yearFields.value.description)
    data.append('status', yearFields.value.status)

    if (yearFields.value.icon)
      data.append('icon', yearFields.value.icon)

    for (const pair of data.entries())
      console.log(`${pair[0]}:`, pair[1])

    const result = await updateAcademicYear(props.yearData?.id, data, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchAcademicYears && await props.fetchAcademicYears()
      emit('update:isDrawerOpen', false)
      showToast('Academic Year updated successfully', 'success')
    }
  })
}

const submitAcademicYearFunc = () => {
  if (props.yearData?.id)
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
      :title="props.yearData?.id ? 'Edit Academic Year' : 'Add Academic Year'"
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
            @submit.prevent="submitAcademicYearFunc"
          >
            <VRow>
              <!-- 👉 Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="yearFields.name"
                  label="Name"
                  placeholder="Name of the academic year"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Description -->
              <VCol cols="12">
                <AppTextarea
                  v-model="yearFields.description"
                  label="Description"
                  rows="2"
                  placeholder="Description of the academic year"
                />
              </VCol>

              <!-- 👉 Start Date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="yearFields.start_date"
                  label="Year of Admission"
                  placeholder="Select Year of Admission"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 End Date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="yearFields.end_date"
                  label="Estimated Exit"
                  placeholder="Select Estimated Exit"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="yearFields.status"
                  :items="status"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  placeholder="Select Status"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Attach Icon -->
              <VCol cols="12">
                <AcademicYearDropZone v-model="yearFields.icon" />
              </VCol>

              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  {{ props.yearData?.id ? 'Update Academic Year' : 'Add Academic Year' }}
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
