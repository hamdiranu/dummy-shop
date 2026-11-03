<template>
  <div class="card p-5 sm:p-6">
    <div class="mb-5">
      <h2 class="text-base font-semibold text-slate-900">{{ title }}</h2>
      <p class="mt-0.5 text-sm text-slate-500">{{ subtitle }}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
