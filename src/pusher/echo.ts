import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Assign to window
window.Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY!,
  cluster: 'mt1',
  wsHost: import.meta.env.VITE_REVERB_HOST!,
  wsPath: import.meta.env.VITE_REVERB_PATH!,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  withCredentials: true,
  authEndpoint: '/api/v1/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${useCookie('accessToken').value}`,
      Accept: 'application/json',
    },
  },
  disableStats: true,
})
