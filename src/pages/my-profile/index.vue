<script setup lang="ts">
import UserBioPanel from '@/views/user/UserBioPanel.vue'
import UserTabAccount from '@/views/user/UserTabAccount.vue'
import UserTabNotifications from '@/views/user/UserTabNotifications.vue'
import UserTabSecurity from '@/views/user/UserTabSecurity.vue'

const userTab = ref(null)

const tabs = [
  { icon: 'tabler-users', title: 'Overview' },
  { icon: 'tabler-lock', title: 'Security' },

  // { icon: 'tabler-bell', title: 'Notifications' },
]

const { data: userData } = await useApi<any>('/administrator/me/')
</script>

<template>
  <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel :user-data="userData.data" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabAccount />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <!--
          <VWindowItem>
          <UserTabNotifications />
          </VWindowItem>
        -->
      </VWindow>
    </VCol>
  </VRow>
</template>
