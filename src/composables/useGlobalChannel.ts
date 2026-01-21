import { echo } from '@/pusher/echo'

export const globalUserChannel = ref<any>(null)
export const onlineUsers = ref(0)

export function initUserChannel() {
  if (!globalUserChannel.value)
    globalUserChannel.value = echo.join('presence.user')

  return globalUserChannel.value
}
