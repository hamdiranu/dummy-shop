<!--
  CountUp, adapted from Vue Bits (https://vue-bits.dev) © David Haz. See ./LICENSE.md.

  Changes from the original:
  - Time-based ease-out instead of a fixed-step spring, so it takes `duration` seconds on any
    refresh rate (the original assumed 60fps) and doesn't creep through the last digits
  - Decimals and a `format` function, e.g. for currency
  - A new `to` animates from the number on screen instead of getting stuck at `from`
  - Shows the final value straight away when the user prefers reduced motion
  - Screen readers get only the final value, not every intermediate number
  - `start` / `end` events instead of callback props; the delay timer is cleared on unmount
-->
<template>
  <span>
    <span ref="displayEl" aria-hidden="true"></span>
    <span class="sr-only">{{ finalText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  to: number
  from?: number
  direction?: 'up' | 'down'
  // Seconds before counting starts, once the number is on screen
  delay?: number
  // Seconds the count takes
  duration?: number
  startWhen?: boolean
  separator?: string
  // Defaults to however many decimals `from` / `to` have
  decimals?: number
  // Overrides `separator` and `decimals`
  format?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  from: 0,
  direction: 'up',
  delay: 0,
  duration: 2,
  startWhen: true,
  separator: '',
  decimals: undefined,
  format: undefined,
})

const emit = defineEmits<{ start: []; end: [] }>()

const displayEl = ref<HTMLSpanElement | null>(null)

const startValue = () => (props.direction === 'down' ? props.to : props.from)
const endValue = () => (props.direction === 'down' ? props.from : props.to)

const decimalPlaces = (value: number) => value.toString().split('.')[1]?.length ?? 0
const fractionDigits = computed(
  () => props.decimals ?? Math.max(decimalPlaces(props.from), decimalPlaces(props.to)),
)

const formatValue = (value: number) => {
  if (props.format) return props.format(value)
  const formatted = new Intl.NumberFormat('en-US', {
    useGrouping: !!props.separator,
    minimumFractionDigits: fractionDigits.value,
    maximumFractionDigits: fractionDigits.value,
  }).format(value)
  return props.separator ? formatted.replace(/,/g, props.separator) : formatted
}

const finalText = computed(() => formatValue(endValue()))

let current = startValue()
let frame = 0
let delayTimer: number | undefined
let observer: IntersectionObserver | null = null
const isInView = ref(false)
const hasStarted = ref(false)

// Written straight to the DOM so a running count doesn't re-render the component every frame
const render = () => {
  if (displayEl.value) displayEl.value.textContent = formatValue(current)
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function animateTo(target: number) {
  cancelAnimationFrame(frame)
  const origin = current

  if (origin === target || props.duration <= 0 || prefersReducedMotion()) {
    current = target
    render()
    emit('end')
    return
  }

  let startTime: number | null = null
  const tick = (time: number) => {
    startTime ??= time
    const progress = Math.min((time - startTime) / (props.duration * 1000), 1)
    current = origin + (target - origin) * easeOutExpo(progress)
    render()

    if (progress < 1) {
      frame = requestAnimationFrame(tick)
    } else {
      current = target
      render()
      emit('end')
    }
  }
  frame = requestAnimationFrame(tick)
}

function start() {
  if (hasStarted.value || !isInView.value || !props.startWhen) return
  hasStarted.value = true
  emit('start')
  delayTimer = window.setTimeout(() => animateTo(endValue()), props.delay * 1000)
}

// Refreshed data counts on from whatever is showing rather than snapping back to `from`
watch(
  () => [props.from, props.to, props.direction],
  () => {
    if (hasStarted.value) {
      animateTo(endValue())
    } else {
      current = startValue()
      render()
    }
  },
)

watch(() => props.startWhen, start)
watch(() => [props.format, props.separator, fractionDigits.value], render)

onMounted(() => {
  render()
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    isInView.value = true
    observer?.disconnect()
    observer = null
    start()
  })
  if (displayEl.value) observer.observe(displayEl.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.clearTimeout(delayTimer)
  observer?.disconnect()
})
</script>
