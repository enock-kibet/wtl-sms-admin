// composables/useGlobalPresence.ts
import { onBeforeUnmount } from 'vue'
import { onlineUsers } from '@/composables/useGlobalChannel'
import { echo } from '@/pusher/echo'

interface User {
  id: any
}

type OnLeaveCallback = (user: User) => void

class PresenceManager {
  private channel: any = null
  private uchannel: any = null
  private onLeaveCallback?: OnLeaveCallback

  constructor(onLeave?: OnLeaveCallback) {
    this.onLeaveCallback = onLeave
    this.init()
  }

  private init() {
    if (!echo)
      return

    if (useCookie('accessToken').value == null)
      return

    const userData = useCookie<any>('userData')

    this.channel = echo.join(`presence.user.${userData.value.id}`)

    this.uchannel = initUserChannel()

    this.uchannel
      .here((users: any[]) => {
        // console.log('Users online:', users)
        onlineUsers.value = users.length
      })
      .joining((user: any) => {
        // console.log('User joined:', user)
        onlineUsers.value += 1
      })
      .leaving((user: any) => {
        // console.log('User left:', user)
        onlineUsers.value = Math.max(0, onlineUsers.value - 1)
      })
      .subscribed(() => console.log('✅ Subscribed to inactivity.timeout'))

    this.channel.joining((user: User) => {
      console.log(`✅ ${user.id} joined`)
    })

    this.channel.leaving((user: User) => {
      console.log(`❌ ${user.id} left`)
      this.onLeaveCallback?.(user)
    })

    this.uchannel.leaving(() => {
      console.log('❌ User left')
    })

    // Optional: listen to connection events for debugging
    echo.connector.pusher.connection.bind('connected', () => console.log('✅ Reverb connected'))
    echo.connector.pusher.connection.bind('error', (err: any) => console.error('❌ Reverb error', err))
  }

  leave() {
    if (this.channel) {
      this.channel.leave('presence.user')
      this.channel = null
    }
  }
}

let globalPresence: PresenceManager | null = null

export function useGlobalPresence(onLeave?: OnLeaveCallback) {
  if (!globalPresence)
    globalPresence = new PresenceManager(onLeave)

  onBeforeUnmount(() => {
    // optional: only leave if you want to clean up when app unmounts
    // globalPresence?.leave()
  })

  return globalPresence
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
