<script setup lang="ts">
import type { Permission, Role } from '@/data/models/roles'
import RoleCards from '@/views/roles/RoleCards.vue'

interface PermissionsStructure {
  admin: Record<string, Permission[]>
  instructor: Record<string, Permission[]>
  student: Record<string, Permission[]>
}

const { data: rolesData, execute: fetchRoles } = await useApi<any>(createUrl('/administrator/roles'))

const roles = computed((): Role[] => rolesData.value.data)

const { data: permissionsData, execute: fetchPermissions } = await useApi<any>(createUrl('/administrator/permissions'))

const permission = computed((): PermissionsStructure => permissionsData.value.data)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-1">
        Roles List
      </h4>
      <p class="text-body-1 mb-0">
        A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what he need
      </p>
    </VCol>

    <!-- 👉 Roles Cards -->
    <VCol cols="12">
      <RoleCards
        :roles-data="roles"
        :permissions="permission"
        :fetch-roles="fetchRoles"
      />
    </VCol>
  </VRow>
</template>
