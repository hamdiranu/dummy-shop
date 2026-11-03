<template>
  <transition name="slide-up">
    <div
      v-if="snackbarVisible"
      class="fixed right-4 bottom-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lift backdrop-blur sm:right-6 sm:bottom-6"
    >
      <span
        :class="[
          'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
          isError ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600',
        ]"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <template v-if="isError">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </template>
          <template v-else>
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </template>
        </svg>
      </span>
      <div class="min-w-0 pt-0.5">
        <p class="text-sm font-semibold text-slate-900">{{ snackbarTitle }}</p>
        <p class="mt-0.5 text-sm text-slate-500">{{ snackbarMessage }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { snackbarTitle, snackbarMessage, snackbarVisible } from '@/utils'

const isError = computed(() => /error|fail/i.test(snackbarTitle.value))
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
</style>
