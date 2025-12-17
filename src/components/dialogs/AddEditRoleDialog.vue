<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { Role } from '@/data/models/roles'
import { submitRole, updateRole } from '@/pages/roles/core/request'

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */
interface Permission {
  name: string
  label: string
  action: string
  module: string
  checked?: boolean
}

// interface Role {
//   id?: string | number
//   name: string
//   guard: 'admin' | 'instructor' | 'student' | null
//   permissions: string[]
// }

interface PermissionsStructure {
  admin: Record<string, Permission[]>
  instructor: Record<string, Permission[]>
  student: Record<string, Permission[]>
}

/* -------------------------------------------------------------------------- */
/* Props & Emits                                                               */
/* -------------------------------------------------------------------------- */
interface Props {
  rolePermissions?: Role
  isDialogVisible: boolean
  permissions: PermissionsStructure
  fetchRoles?: () => Promise<void>
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:rolePermissions', value: Role): void
}

const props = withDefaults(defineProps<Props>(), {
  rolePermissions: () => ({
    name: '',
    guard: null,
    permissions: [],
  }),
})

const emit = defineEmits<Emit>()

/* -------------------------------------------------------------------------- */
/* State                                                                       */
/* -------------------------------------------------------------------------- */
const refPermissionForm = ref<VForm>()
const role = ref('')
const selectedGuard = ref<'admin' | 'instructor' | 'student' | null>(null)
const isSelectAll = ref(false)
const localPermissions = ref<PermissionsStructure>(JSON.parse(JSON.stringify(props.permissions)))

/* -------------------------------------------------------------------------- */
/* Computed                                                                    */
/* -------------------------------------------------------------------------- */
const guardPermissions = computed(() => {
  if (!selectedGuard.value)
    return null

  return localPermissions.value[selectedGuard.value] ?? {}
})

const flatPermissions = computed<Permission[]>(() => {
  if (!guardPermissions.value)
    return []

  return Object.values(guardPermissions.value).flat()
})

const checkedCount = computed(() =>
  flatPermissions.value.filter(p => p.checked).length,
)

const isIndeterminate = computed(() =>
  checkedCount.value > 0
  && checkedCount.value < flatPermissions.value.length,
)

/* -------------------------------------------------------------------------- */
/* Watchers                                                                    */
/* -------------------------------------------------------------------------- */
watch(isSelectAll, value => {
  flatPermissions.value.forEach(p => (p.checked = value))
})

watch(isIndeterminate, val => {
  if (!val)
    isSelectAll.value = false
})

watch(
  () => flatPermissions.value,
  () => {
    if (
      flatPermissions.value.length
      && checkedCount.value === flatPermissions.value.length
    )
      isSelectAll.value = true
  },
  { deep: true },
)

/* -------------------------------------------------------------------------- */
/* Edit Mode Sync                                                              */
/* -------------------------------------------------------------------------- */
watch(
  () => props.rolePermissions,
  rolePermissions => {
    if (!rolePermissions)
      return

    // console.log(rolePermissions.permissions)

    role.value = rolePermissions.name
    selectedGuard.value = rolePermissions.guard

    // Reset all permissions
    localPermissions.value = JSON.parse(JSON.stringify(props.permissions))

    // Mark checked permissions
    if (selectedGuard.value) {
      const guardPerms = localPermissions.value[selectedGuard.value]

      const enabledPermissions = (rolePermissions.permissions || [])
        .filter((p: any) => p && p.name) // ensure p exists and has a name
        .map((p: any) => p.name.trim().toLowerCase())

      for (const moduleName in guardPerms) {
        if (Object.hasOwnProperty.call(guardPerms, moduleName)) {
          const modulePerms = guardPerms[moduleName]

          modulePerms.forEach(p => {
            p.checked = enabledPermissions.includes(p.name.trim().toLowerCase())
          })
        }
      }
    }
  },
  { immediate: true },
)

const roleID = ref(props.rolePermissions.id)

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */
const onSubmit = async () => {
  if (!selectedGuard.value)
    return

  const payload: Role = {
    id: roleID.value,
    name: role.value,
    guard: selectedGuard.value,
    users: {
      admins: [],
      instructors: [],
      students: [],
    },
    permissions: flatPermissions.value
      .filter(p => p.checked)
      .map(p => p.name),
  }

  if (props.rolePermissions.id) {
    const results = await updateRole(props.rolePermissions.id.toString(), payload)
    if (results) {
      showToast('Role updated successfully', 'success')
      location.reload()
    }
  }
  else {
    const results = await submitRole(payload)
    if (results) {
      showToast('Role added successfully', 'success')
      location.reload()
    }
  }

  emit('update:rolePermissions', payload)
  emit('update:isDialogVisible', false)

  // Reset form
  role.value = ''
  selectedGuard.value = null
  localPermissions.value = JSON.parse(JSON.stringify(props.permissions))
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

const onReset = () => {
  emit('update:isDialogVisible', false)

  // Reset form
  role.value = ''
  selectedGuard.value = null
  localPermissions.value = JSON.parse(JSON.stringify(props.permissions))
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

// Format module name for display
const formatModuleName = (module: string) => {
  return module
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <h4 class="text-h4 text-center mb-2">
          {{ props.rolePermissions?.name ? 'Edit' : 'Add New' }} Role
        </h4>

        <p class="text-body-1 text-center mb-6">
          Set Role Permissions
        </p>

        <VForm ref="refPermissionForm">
          <!-- Role name -->
          <AppTextField
            v-model="role"
            label="Role Name"
            placeholder="Enter Role Name"
          />

          <!-- Guard selector -->
          <VSelect
            v-model="selectedGuard"
            class="mt-4"
            label="Select Guard"
            :items="['admin', 'instructor', 'student']"
            clearable
            :disabled="!!props.rolePermissions?.name"
          />

          <h5 class="text-h5 my-6">
            Role Permissions
          </h5>

          <!-- No guard -->
          <div
            v-if="!selectedGuard"
            class="text-center text-medium-emphasis my-6"
          >
            Please select a guard to view permissions
          </div>

          <!-- Permissions table -->
          <VTable
            v-else
            class="permission-table text-no-wrap mb-6"
          >
            <!-- Select all -->
            <tr>
              <td>
                <h6 class="text-h6 text-capitalize">
                  {{ selectedGuard }} Permissions
                </h6>
              </td>
              <td class="text-end">
                <VCheckbox
                  v-model="isSelectAll"
                  v-model:indeterminate="isIndeterminate"
                  label="Select All"
                />
              </td>
            </tr>

            <!-- Modules -->
            <template
              v-for="(permissions, module) in guardPermissions"
              :key="module"
            >
              <tr>
                <td colspan="2">
                  <strong class="text-primary">
                    {{ formatModuleName(module as string) }}
                  </strong>
                </td>
              </tr>

              <tr
                v-for="permission in permissions"
                :key="permission.name"
              >
                <td>{{ permission.label }}</td>
                <td class="text-end">
                  <VCheckbox v-model="permission.checked" />
                </td>
              </tr>
            </template>
          </VTable>

          <!-- Actions -->
          <div class="d-flex justify-center gap-4">
            <VBtn @click="onSubmit">
              Submit
            </VBtn>

            <VBtn
              variant="tonal"
              color="secondary"
              @click="onReset"
            >
              Cancel
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
