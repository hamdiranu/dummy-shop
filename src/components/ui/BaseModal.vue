<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
      @click.self="emit('close-modal', false)"
      @keydown.esc="emit('close-modal', false)"
    >
      <div
        ref="modalRef"
        class="bg-white rounded-lg shadow-lg relative p-6 w-full"
        :style="{
          maxWidth: props.maxWidth ?? '42rem',
          maxHeight: props.maxHeight ?? '80vh',
        }"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="emit('close-modal', false)"
          class="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
        >
          <CrossIcon class="h-6 w-6" />
        </button>

        <!-- Modal Content -->
        <slot> </slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { CrossIcon } from '@/assets/icons'
import { ref } from 'vue'

const props = defineProps<{
  open: boolean
  maxWidth?: string
  maxHeight?: string
}>()

const emit = defineEmits(['close-modal'])

const modalRef = ref<HTMLElement | null>(null)
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
