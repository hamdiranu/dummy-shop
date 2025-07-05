<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @keydown.esc="emit('close-modal', false)"
    >
      <div
        ref="modalRef"
        class="bg-white w-full rounded-lg shadow-lg relative overflow-y-auto"
        :class="[widthClass, heightClass, 'p-6']"
        @click.stop
        tabindex="0"
      >
        <!-- Close Button -->
        <button
          @click="emit('close-modal', false)"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <!-- Modal Content -->
        <slot> </slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  open: boolean
  maxWidth?: string
  maxHeight?: string
}>()

const emit = defineEmits(['close-modal'])

const modalRef = ref<HTMLElement | null>(null)

// Classes for width and height from props
const widthClass = props.maxWidth ?? 'max-w-[42rem]'
const heightClass = props.maxHeight ?? 'max-h-[80vh]'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
