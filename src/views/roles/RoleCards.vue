<script setup lang="ts">
import type { Permission, Role } from '@/data/models/roles'
import { deleteRole } from '@/pages/roles/core/request'
import girlUsingMobile from '@images/pages/girl-using-mobile.png'

const props = defineProps<Props>()

interface PermissionsStructure {
  admin: Record<string, Permission[]>
  instructor: Record<string, Permission[]>
  student: Record<string, Permission[]>
}

interface Props {
  rolesData: Role[]
  permissions: PermissionsStructure
  fetchRoles?: () => Promise<void>
}

interface RoleDetails {
  name: string
  permissions: Permission[]
}

interface iRole {
  id?: string | number
  name: string
  guard: 'admin' | 'instructor' | 'student' | null
  users?: PermissionsStructure
  permissions: string[]
}

// 👉 Roles List
const roles = props.rolesData

const isRoleDialogVisible = ref(false)

const roleDetail = ref<Role>()

const isAddRoleDialogVisible = ref(false)

const editPermission = (value: Role) => {
  roleDetail.value = { ...value }
  isRoleDialogVisible.value = true
}

watch(roleDetail, val => {
  // console.log(val)
})

const deleteRoleData = async (id?: string) => {
  if (id) {
    const result = await deleteRole(id)
    if (result) {
      showToast('Role deleted successfully', 'success')
      location.reload()
    }
  }
}
</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="item in roles"
      :key="item.id"
      cols="12"
      sm="6"
      lg="4"
    >
      <template v-if="item.guard === 'admin'">
        <VCard>
          <VCardText class="d-flex align-center pb-4">
            <div class="text-body-1">
              Total {{ item.users?.admins.length }} users
            </div>

            <VSpacer />

            <div class="v-avatar-group">
              <template v-if="item.users">
                <template
                  v-for="(user, index) in item.users.admins"
                  :key="user"
                >
                  <VAvatar
                    v-if="item.users.admins.length > 4 && item.users.admins.length !== 4 && index < 3"
                    size="40"
                  >
                    {{ `${user.first_name[0]} ${user.last_name[0]}` }}
                  </VAvatar>

                  <VAvatar
                    v-if="item.users.admins.length > 4 && item.users.admins.length !== 4 && index < 3"
                    size="40"
                  >
                    {{ `${user.first_name[0]} ${user.last_name[0]}` }}
                  </VAvatar>
                </template>
                <VAvatar
                  v-if="item.users.admins.length > 4"
                  :color="$vuetify.theme.current.dark ? '#373B50' : '#EEEDF0'"
                >
                  <span>
                    +{{ item.users.admins.length - 3 }}
                  </span>
                </VAvatar>
              </template>
            </div>
          </VCardText>

          <VCardText>
            <div class="d-flex justify-space-between align-center">
              <div>
                <h5 class="text-h5 text-capitalize">
                  {{ item.name }}
                </h5>
                <div class="d-flex align-center">
                  <a
                    href="javascript:void(0)"
                    @click="editPermission(item)"
                  >
                    Edit Role
                  </a>
                </div>
              </div>
              <IconBtn @click="deleteRoleData(item.id?.toString())">
                <VIcon
                  icon="tabler-trash"
                  color="error"
                  class="text-high-emphasis"
                />
              </IconBtn>
            </div>
          </VCardText>
        </VCard>
      </template>
      <template v-if="item.guard === 'instructor'">
        <VCard>
          <VCardText class="d-flex align-center pb-4">
            <div class="text-body-1">
              Total {{ item.users?.instructors.length }} users
            </div>

            <VSpacer />

            <div class="v-avatar-group">
              <template v-if="item.users">
                <template
                  v-for="(user, index) in item.users.instructors"
                  :key="user"
                >
                  <VAvatar
                    v-if="item.users.instructors.length > 4 && item.users.instructors.length !== 4 && index < 3"
                    size="40"
                  >
                    {{ `${user.first_name[0]} ${user.last_name[0]}` }}
                  </VAvatar>

                  <VAvatar
                    v-if="item.users.instructors.length > 4 && item.users.instructors.length !== 4 && index < 3"
                    size="40"
                  >
                    {{ `${user.first_name[0]} ${user.last_name[0]}` }}
                  </VAvatar>
                </template>
                <VAvatar
                  v-if="item.users.instructors.length > 4"
                  :color="$vuetify.theme.current.dark ? '#373B50' : '#EEEDF0'"
                >
                  <span>
                    +{{ item.users.instructors.length - 3 }}
                  </span>
                </VAvatar>
              </template>
            </div>
          </VCardText>

          <VCardText>
            <div class="d-flex justify-space-between align-center">
              <div>
                <h5 class="text-h5 text-capitalize">
                  {{ item.name }}
                </h5>
                <div class="d-flex align-center">
                  <a
                    href="javascript:void(0)"
                    @click="editPermission(item)"
                  >
                    Edit Role
                  </a>
                </div>
              </div>
              <IconBtn @click="deleteRoleData(item.id?.toString())">
                <VIcon
                  icon="tabler-trash"
                  color="error"
                  class="text-high-emphasis"
                />
              </IconBtn>
            </div>
          </VCardText>
        </VCard>
      </template>
      <template v-else-if="item.guard === 'student'">
        <VCard>
          <VCardText class="d-flex align-center pb-4">
            <div class="text-body-1">
              Total {{ item.users?.students.length }} users
            </div>

            <VSpacer />

            <div class="v-avatar-group">
              <template
                v-for="(user, index) in item.users?.students"
                :key="user"
              >
                <template v-if="item.users">
                  <VAvatar
                    v-if="item.users.students.length > 4 && item.users.students.length !== 4 && index < 3"
                    size="40"
                  >
                    {{ `${user.first_name[0]} ${user.last_name[0]}` }}
                  </VAvatar>

                  <VAvatar
                    v-if="item.users.students.length > 4 && item.users.students.length !== 4 && index < 3"
                    size="40"
                  >
                    {{ `${user.first_name[0]} ${user.last_name[0]}` }}
                  </VAvatar>
                </template>
              </template>
              <template v-if="item.users">
                <VAvatar
                  v-if="item.users.students.length > 4"
                  :color="$vuetify.theme.current.dark ? '#373B50' : '#EEEDF0'"
                >
                  <span>
                    +{{ item.users.students.length - 3 }}
                  </span>
                </VAvatar>
              </template>
            </div>
          </VCardText>

          <VCardText>
            <div class="d-flex justify-space-between align-center">
              <div>
                <h5 class="text-h5 text-capitalize">
                  {{ item.name }}
                </h5>
                <div class="d-flex align-center">
                  <a
                    href="javascript:void(0)"
                    @click="editPermission(item)"
                  >
                    Edit Role
                  </a>
                </div>
              </div>

              <IconBtn @click="deleteRoleData(item.id?.toString())">
                <VIcon
                  icon="tabler-trash"
                  color="error"
                  class="text-high-emphasis"
                />
              </IconBtn>
            </div>
          </VCardText>
        </VCard>
      </template>
    </VCol>

    <!-- 👉 Add New Role -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard
        class="h-100"
        :ripple="false"
      >
        <VRow
          no-gutters
          class="h-100"
        >
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center mt-5"
          >
            <img
              width="85"
              :src="girlUsingMobile"
            >
          </VCol>

          <VCol cols="7">
            <VCardText class="d-flex flex-column align-end justify-end gap-4">
              <VBtn
                size="small"
                @click="isAddRoleDialogVisible = true"
              >
                Add New Role
              </VBtn>
              <div class="text-end">
                Add new role,<br> if it doesn't exist.
              </div>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <AddEditRoleDialog
        v-model:is-dialog-visible="isAddRoleDialogVisible"
        :permissions="permissions"
        :fetch-roles="props.fetchRoles"
      />
    </VCol>
  </VRow>

  <AddEditRoleDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    v-model:role-permissions="roleDetail"
    :permissions="permissions"
    :fetch-roles="props.fetchRoles"
  />
</template>
