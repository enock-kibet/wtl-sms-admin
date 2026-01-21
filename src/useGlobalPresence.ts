// composables/useGlobalPresence.ts
import { onBeforeUnmount } from 'vue'
import { echo } from '@/pusher/echo'

interface User {
  id: any
}

type OnLeaveCallback = (user: User) => void

let presenceChannel: any = null
let userCountChannel: any = null
let initializedForUser: any = null

function joinPresenceChannel(
  classId: any,
  onLeave?: OnLeaveCallback,
) {
  // Prevent re-initializing for the same user
  if (initializedForUser === classId)
    return

  if (!echo)
    return

  if (!classId)
    return

  initializedForUser = classId

  //  * Presence channel (per user)
  presenceChannel = echo.join(`presence.class.${classId}`)

  presenceChannel
    .joining((user: User) => {
      console.log(`✅ ${user.id} joined`)
    })
    .leaving((user: User) => {
      console.log(`❌ ${user.id} left`)
      onLeave?.(user)
    }).subscribed(() => {
      console.log('✅ Subscribed to class channel')
    })

  //  * Global users count channel
  // userCountChannel = initUserChannel()

  // userCountChannel
  //   .here((users: any[]) => {
  //     onlineUsers.value = users.length
  //   })
  //   .joining(() => {
  //     onlineUsers.value += 1
  //   })
  //   .leaving(() => {
  //     onlineUsers.value = Math.max(0, onlineUsers.value - 1)
  //   })
  //   .subscribed(() => {
  //     console.log('✅ Subscribed to class channel')
  //   })

  /* ---------------------------------------------------
   * Debug connection events
   * --------------------------------------------------- */
  echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Reverb connected')
  })

  echo.connector.pusher.connection.bind('error', (err: any) => {
    console.error('❌ Reverb error', err)
  })
}

function leavePresenceChannel() {
  if (presenceChannel) {
    presenceChannel.leave()
    presenceChannel = null
  }

  if (userCountChannel) {
    userCountChannel.leave()
    userCountChannel = null
  }

  initializedForUser = null
}

/* ---------------------------------------------------
 * Public API
 * --------------------------------------------------- */
export function useGlobalPresence(
  classId: any,
  onLeave?: OnLeaveCallback,
) {
  joinPresenceChannel(classId, onLeave)

  onBeforeUnmount(() => {
    // Optional: only call on full app logout
    // leavePresenceChannel()
  })

  return {
    leave: leavePresenceChannel,
  }
}

export const enwLogout = async () => {
  const ability = useAbility()

  const userData = useCookie<any>('userData')
  const userAvatar = useCookie('userAvatar')

  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  useCookie('activityTimeout').value = null

  // Remove "userData" from cookie
  userData.value = null

  userAvatar.value = null

  await $api('/api/v1/auth/logout', {
    method: 'POST',
    onResponseError({ response }) {
      console.log(response._data.message)
    },
  })

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
  // Remove "userAbilities" from cookie
  useCookie('userAbilityRules').value = null

  // Reset ability to initial ability
  ability.update([])
}
