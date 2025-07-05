import { ref } from 'vue'

export const snackbarTitle = ref('')
export const snackbarMessage = ref('')
export const snackbarVisible = ref(false)

let timeoutId: number | null = null

export function showSnackbar(title: string, message: string, duration = 3000) {
  snackbarTitle.value = title
  snackbarMessage.value = message
  snackbarVisible.value = true

  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    snackbarVisible.value = false
    timeoutId = null
  }, duration)
}
