import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'

export function showToast(
  message: string,
  type: 'success' | 'info' | 'error' | 'warning' = 'info',
  duration: number = 8000,
  dismissible: boolean = true,
) {
  const toast = useToast()

  return toast[type](message, {
    duration,
    position: 'bottom',
    dismissible,
  })
}

export const formatNumber = (num: number | null) => {
  if (num === null || num === undefined)
    return '0.00'

  // remove negative sign
  if (num < 0)
    num = Math.abs(num)

  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
