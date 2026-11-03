<!--
  ClickSpark, adapted from Vue Bits (https://vue-bits.dev) © David Haz. See ./LICENSE.md.

  Changes from the original:
  - Draws only while sparks are flying; the original ran a frame loop forever
  - One viewport-sized canvas (teleported to <body>) instead of a canvas the size of the wrapped
    content, which for a long product grid meant a canvas thousands of pixels tall. Sparks
    aren't clipped at the wrapper's edge either
  - Sharp on high-DPI screens
  - Optional `selector`, so only clicks on matching elements (e.g. one button) spark
  - Keyboard activation sparks from the centre of the element instead of the top-left corner
  - Skipped when the user prefers reduced motion
-->
<template>
  <div @click="onClick">
    <slot />
    <Teleport to="body">
      <canvas
        ref="canvasEl"
        aria-hidden="true"
        class="pointer-events-none fixed inset-0 z-[70] h-full w-full"
      ></canvas>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

const props = withDefaults(
  defineProps<{
    sparkColor?: string
    sparkSize?: number
    sparkRadius?: number
    sparkCount?: number
    // Milliseconds
    duration?: number
    easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
    extraScale?: number
    // Only clicks inside an element matching this selector spark; every click when unset
    selector?: string
  }>(),
  {
    sparkColor: '#fff',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    easing: 'ease-out',
    extraScale: 1,
    selector: undefined,
  },
)

const canvasEl = ref<HTMLCanvasElement | null>(null)
const sparks: Spark[] = []
let frame = 0

const ease = (t: number) => {
  switch (props.easing) {
    case 'linear':
      return t
    case 'ease-in':
      return t * t
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    default:
      return t * (2 - t)
  }
}

// Match the canvas to the viewport at device resolution, then draw in CSS pixels
function fitCanvas() {
  const canvas = canvasEl.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return null

  const dpr = window.devicePixelRatio || 1
  const width = Math.round(window.innerWidth * dpr)
  const height = Math.round(window.innerHeight * dpr)
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

function draw(time: number) {
  const ctx = fitCanvas()
  if (!ctx) return
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  ctx.strokeStyle = props.sparkColor
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i]
    // The frame timestamp can be a hair earlier than the click that created the spark
    const elapsed = Math.max(0, time - spark.startTime)
    if (elapsed >= props.duration) {
      sparks.splice(i, 1)
      continue
    }

    const eased = ease(elapsed / props.duration)
    const distance = eased * props.sparkRadius * props.extraScale
    const lineLength = props.sparkSize * (1 - eased)
    const cos = Math.cos(spark.angle)
    const sin = Math.sin(spark.angle)

    ctx.beginPath()
    ctx.moveTo(spark.x + distance * cos, spark.y + distance * sin)
    ctx.lineTo(spark.x + (distance + lineLength) * cos, spark.y + (distance + lineLength) * sin)
    ctx.stroke()
  }

  frame = sparks.length ? requestAnimationFrame(draw) : 0
}

function onClick(event: MouseEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const container = event.currentTarget as HTMLElement
  const origin = props.selector
    ? (event.target as Element | null)?.closest(props.selector)
    : container
  if (!origin || !container.contains(origin)) return

  let { clientX: x, clientY: y } = event
  // detail is 0 for clicks fired by Enter / Space, which carry no pointer position
  if (event.detail === 0) {
    const rect = origin.getBoundingClientRect()
    x = rect.left + rect.width / 2
    y = rect.top + rect.height / 2
  }

  const now = performance.now()
  for (let i = 0; i < props.sparkCount; i++) {
    sparks.push({ x, y, angle: (2 * Math.PI * i) / props.sparkCount, startTime: now })
  }
  if (!frame) frame = requestAnimationFrame(draw)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>
