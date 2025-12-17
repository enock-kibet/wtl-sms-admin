<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import type { iDepartments } from '@/data/models/departments'
import type { Schools } from '@/data/models/schools'
import { submitDepartment, updateDepartment } from '@/pages/departments/core/request'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  isDrawerOpen: boolean
  departmentData?: iDepartments
  schoolsData?: Schools[]
  fetchDepartments?: () => Promise<void>
}

const status = ref([
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
])

const departmentFields = ref({
  name: props.departmentData?.name || '',
  description: props.departmentData?.description || '',
  faculty_id: props.departmentData?.faculty_id || '',
  status: props.departmentData?.status || '',
})

const errors = ref<Record<string, string | undefined>>({
  name: undefined,
  faculty_id: undefined,
  description: undefined,
  status: undefined,
})

const refForm = ref<VForm>()

watch(() => props.isDrawerOpen, val => {
  if (val && props.departmentData) {
    // Reset form fields when drawer is opened
    departmentFields.value = {
      name: props.departmentData?.name || '',
      faculty_id: props.departmentData?.faculty_id || '',
      description: props.departmentData?.description || '',
      status: props.departmentData?.status || '',
    }
  }
})

const handleSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    const result = await submitDepartment(departmentFields.value, errors)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchDepartments && await props.fetchDepartments()
      emit('update:isDrawerOpen', false)
      showToast('Department added successfully', 'success')
    }
  })
}

const handleUpdate = () => {
  // Similar to handleSubmit but for updating existing department
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid)
      return

    if (!props.departmentData?.id)
      return

    const result = await updateDepartment(props.departmentData?.id, departmentFields.value, errors)

    console.log(result)

    // Only close drawer if request succeeds AND has no validation errors
    if (result) {
      props.fetchDepartments && await props.fetchDepartments()
      emit('update:isDrawerOpen', false)
      showToast('Department updated successfully', 'success')
    }
  })
}

const submitDepartmentFunc = () => {
  if (props.departmentData?.id)
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
      :title="props.departmentData?.id ? 'Edit Department' : 'Add Department'"
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
            @submit.prevent="submitDepartmentFunc"
          >
            <VRow>
              <!-- 👉 Title -->
              <VCol cols="12">
                <AppTextField
                  v-model="departmentFields.name"
                  label="Name"
                  placeholder="Name of the department"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Schools -->
              <VCol cols="12">
                <AppSelect
                  v-model="departmentFields.faculty_id"
                  :items="schoolsData"
                  item-title="name"
                  item-value="id"
                  label="School"
                  placeholder="Select Status"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Description -->
              <VCol cols="12">
                <AppTextarea
                  v-model="departmentFields.description"
                  label="Description"
                  placeholder="Description of the department"
                />
              </VCol>

              <!-- 👉 Status Select -->
              <VCol cols="12">
                <AppSelect
                  v-model="departmentFields.status"
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
                  {{ props.departmentData?.id ? 'Update Department' : 'Add Department' }}
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
