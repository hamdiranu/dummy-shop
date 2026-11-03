<template>
  <transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      @click.self="emit('close-modal', false)"
      @keydown.esc="emit('close-modal', false)"
    >
      <div
        ref="modalRef"
        class="modal-panel scroll-thin relative w-full overflow-y-auto rounded-3xl border border-slate-200/60 bg-white p-6 shadow-2xl sm:p-7"
        :style="{
          maxWidth: props.maxWidth ?? '42rem',
          maxHeight: props.maxHeight ?? '85vh',
        }"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="emit('close-modal', false)"
          class="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <CrossIcon class="h-5 w-5" />
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: translateY(12px) scale(0.97);
}
</style>
