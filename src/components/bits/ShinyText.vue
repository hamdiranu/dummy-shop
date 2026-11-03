<!--
  ShinyText, adapted from Vue Bits (https://vue-bits.dev) © David Haz. See ./LICENSE.md.

  Changes from the original:
  - Runs on the browser's own Web Animations API instead of motion-v, so it needs no extra
    package and no JavaScript on every frame. Same timing, including `delay` and `yoyo`
  - Accepts a default slot as well as the `text` prop
  - Stays still when the user prefers reduced motion
-->
<template>
  <span
    ref="el"
    class="inline-block"
    :style="gradientStyle"
    @mouseenter="pauseOnHover && animation?.pause()"
    @mouseleave="pauseOnHover && animation?.play()"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    disabled?: boolean
    // Seconds for one sweep
    speed?: number
    color?: string
    shineColor?: string
    // Angle of the shine, in degrees
    spread?: number
    // Sweep back and forth instead of always the same way
    yoyo?: boolean
    pauseOnHover?: boolean
    direction?: 'left' | 'right'
    // Seconds to wait between sweeps
    delay?: number
  }>(),
  {
    text: '',
    disabled: false,
    speed: 2,
    color: '#b5b5b5',
    shineColor: '#ffffff',
    spread: 120,
    yoyo: false,
    pauseOnHover: false,
    direction: 'left',
    delay: 0,
  },
)

const el = ref<HTMLSpanElement | null>(null)
let animation: Animation | null = null

// 150% puts the shine just off the right edge, -50% just off the left
const OFF_RIGHT = '150% center'
const OFF_LEFT = '-50% center'

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(${props.spread}deg, ${props.color} 0%, ${props.color} 35%, ${props.shineColor} 50%, ${props.color} 65%, ${props.color} 100%)`,
  backgroundSize: '200% auto',
  backgroundPosition: props.direction === 'left' ? OFF_RIGHT : OFF_LEFT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}))

function play() {
  animation?.cancel()
  animation = null
  if (!el.value || props.disabled || props.speed <= 0) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const [from, to] = props.direction === 'left' ? [OFF_RIGHT, OFF_LEFT] : [OFF_LEFT, OFF_RIGHT]
  const sweep = props.speed
  const pause = Math.max(0, props.delay)

  // One full cycle: sweep, hold off-screen for `delay`, and for yoyo sweep back and hold again
  const cycle = props.yoyo ? 2 * (sweep + pause) : sweep + pause
  const keyframes: Keyframe[] = [
    { backgroundPosition: from, offset: 0 },
    { backgroundPosition: to, offset: sweep / cycle },
    { backgroundPosition: to, offset: (sweep + pause) / cycle },
  ]
  if (props.yoyo) {
    keyframes.push({ backgroundPosition: from, offset: (2 * sweep + pause) / cycle })
  }
  keyframes.push({ backgroundPosition: props.yoyo ? from : to, offset: 1 })

  animation = el.value.animate(keyframes, {
    duration: cycle * 1000,
    iterations: Infinity,
    easing: 'linear',
  })
}

watch(() => [props.disabled, props.speed, props.delay, props.yoyo, props.direction], play)

onMounted(play)
onBeforeUnmount(() => animation?.cancel())
</script>
