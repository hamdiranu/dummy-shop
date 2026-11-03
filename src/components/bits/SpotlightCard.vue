<!--
  SpotlightCard, adapted from Vue Bits (https://vue-bits.dev) © David Haz. See ./LICENSE.md.

  Changes from the original:
  - No built-in rounding, border or padding: style it with normal classes, like any element
  - The light sits behind the card's content instead of washing over its text
  - Pointer events, so it also works with a pen; touch is skipped so a tap doesn't leave a glow
  - Lights up from the centre when keyboard focus moves inside the card (the original listened
    for focus on the card itself, which never fires for focus on a child)
  - The cursor position is written to CSS variables, so moving the mouse doesn't re-render
-->
<template>
  <div
    ref="el"
    class="relative isolate overflow-hidden"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ease-out"
      :style="{
        opacity: isLit ? 1 : 0,
        background: `radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent ${spotlightSize})`,
      }"
    ></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { spotlightColor = 'rgba(99, 102, 241, 0.16)', spotlightSize = '80%' } = defineProps<{
  spotlightColor?: string
  // Where the light fades out, as a gradient stop
  spotlightSize?: string
}>()

const el = ref<HTMLDivElement | null>(null)
defineExpose({ el })

const isHovered = ref(false)
const hasFocus = ref(false)
const isLit = computed(() => isHovered.value || hasFocus.value)

const moveTo = (x: string, y: string) => {
  el.value?.style.setProperty('--spotlight-x', x)
  el.value?.style.setProperty('--spotlight-y', y)
}

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  isHovered.value = true
  onPointerMove(event)
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch' || !el.value) return
  const rect = el.value.getBoundingClientRect()
  moveTo(`${event.clientX - rect.left}px`, `${event.clientY - rect.top}px`)
}

function onPointerLeave() {
  isHovered.value = false
}

function onFocusIn(event: FocusEvent) {
  // Only keyboard focus; a mouse click already has the light under the cursor
  if (!(event.target as HTMLElement).matches(':focus-visible')) return
  hasFocus.value = true
  if (!isHovered.value) moveTo('50%', '50%')
}

function onFocusOut(event: FocusEvent) {
  if (!el.value?.contains(event.relatedTarget as Node | null)) hasFocus.value = false
}
</script>
