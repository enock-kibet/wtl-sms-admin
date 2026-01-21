<script setup lang="ts">
import type { Classes } from '@/data/models/classes'

definePage({
  meta: {
    action: 'read',
    subject: 'Classes',
    navActiveLink: 'classes',
  },
})

const isLoading = ref(false)

const route = useRoute('classes-join-id')

const { data: attendanceData } = await useApi<any>(createUrl(`/student/class/attendance/${route.params.id}`))
const attendance = computed((): Classes => attendanceData.value.data.class)

const joinClass = async (id: any, action?: string) => {
  isLoading.value = true
  try {
    const join = await $api('/student/class/join', {
      method: 'POST',
      body: {
        token: route.params.id,
      },
      onResponseError({ response }) {
        showToast(response._data.message, 'error')
        isLoading.value = false
      },
    })

    // useGlobalPresence(user => {
    //   console.log('User left:', user)
    // })

    if (attendance.value.id) {
      useGlobalPresence(attendance.value.id)

      const { classLink, message } = join

      showToast('Redirecting...', 'success')

      setTimeout(() => {
        window.open(classLink, '_blank')
      }, 800)
    }

    isLoading.value = false
  }
  catch (e) {
    console.log(e)
  }
}

// watch(bulkactions, val => {
//   if (val && selectedRows.value.length)
//     markAttendance(selectedRows.value)
// })
</script>

<template>
  <div>
    <VRow class="mt-12">
      <VCol
        cols="12"
        md="5"
        class="mx-auto"
      >
        <VCard class="pa-6 text-center">
          <VIcon
            size="56"
            color="primary"
            class="mb-4"
          >
            mdi-video-outline
          </VIcon>

          <h2 class="text-h5 font-weight-semibold mb-2">
            You’re About to Join Your Class
          </h2>

          <p class="text-body-1 text-medium-emphasis mb-4">
            Your class session is ready to begin.
            Click the button below to securely join the class and mark your attendance.
          </p>

          <p>As part of attendance tracking, the system will send an email prompt every 20 minutes requiring users to confirm their attendance.</p>

          <VAlert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            This link is unique to you and will expire shortly.
            Please do not share it with anyone.
          </VAlert>

          <VBtn
            :loading="isLoading"
            color="primary"
            size="large"
            class="mb-2"
            block
            @click="joinClass"
          >
            Join Class Now
          </VBtn>

          <p class="text-caption text-disabled mt-2">
            If you experience any issues, please contact your instructor or support.
          </p>

          <VDivider class="mt-6" />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
