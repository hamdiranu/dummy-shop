<template>
  <SpotlightCard
    v-if="!isLoading"
    :spotlight-color="accentStyle.spotlight"
    class="card group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
  >
    <div
      aria-hidden="true"
      :class="[
        'pointer-events-none absolute -right-8 -bottom-10 h-28 w-28 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-80',
        accentStyle.glow,
      ]"
    ></div>

    <div class="relative flex items-center justify-between gap-4">
      <p class="text-sm font-medium text-slate-500">{{ title }}</p>
      <span :class="['grid h-10 w-10 shrink-0 place-items-center rounded-xl', accentStyle.chip]">
        <component :is="icon" class="h-5 w-5" />
      </span>
    </div>
    <h2
      class="relative mt-2 text-2xl font-bold tracking-tight break-words text-slate-900 tabular-nums sm:text-[1.75rem]"
    >
      <CountUp :to="value" :format="format" separator="," :duration="1.6" />
    </h2>
    <p class="relative mt-1 text-xs font-medium text-slate-500">{{ subtitle }}</p>
  </SpotlightCard>
  <div v-else class="card animate-pulse p-5">
    <div class="flex items-center justify-between">
      <div class="h-3.5 w-1/2 rounded bg-slate-200"></div>
      <div class="h-10 w-10 rounded-xl bg-slate-100"></div>
    </div>
    <div class="mt-2 h-8 w-2/5 rounded-lg bg-slate-200"></div>
    <div class="mt-2 h-3 w-1/3 rounded bg-slate-100"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CountUp, SpotlightCard } from '@/components/bits'

const props = defineProps<{
  title: string
  subtitle: string
  value: number
  // How to display the number, e.g. as currency; plain grouped digits by default
  format?: (value: number) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any // or define proper type like Component
  isLoading?: boolean
  accent?: 'brand' | 'emerald' | 'amber' | 'rose'
}>()

const accents = {
  brand: {
    chip: 'bg-brand-50 text-brand-600 ring-1 ring-brand-100',
    glow: 'bg-brand-200',
    spotlight: 'rgba(99, 102, 241, 0.16)',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    glow: 'bg-emerald-200',
    spotlight: 'rgba(16, 185, 129, 0.16)',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
    glow: 'bg-amber-200',
    spotlight: 'rgba(245, 158, 11, 0.18)',
  },
  rose: {
    chip: 'bg-rose-50 text-rose-600 ring-1 ring-rose-100',
    glow: 'bg-rose-200',
    spotlight: 'rgba(244, 63, 94, 0.14)',
  },
}

const accentStyle = computed(() => accents[props.accent ?? 'brand'])
</script>
