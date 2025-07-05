import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

type ClickOutsideOptions = {
  enabled?: boolean
  handler: (event: MouseEvent) => void
}

export function useClickOutside(
  target: Ref<HTMLElement | null>,
  { enabled = true, handler }: ClickOutsideOptions,
) {
  const listener = (event: MouseEvent) => {
    const el = target.value
    if (el && !el.contains(event.target as Node)) {
      handler(event)
    }
  }

  onMounted(() => {
    if (enabled) {
      document.addEventListener('click', listener)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('click', listener)
  })
}
