<template>
  <div class="flex h-[40dvh] items-center justify-center">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { type ChartOptions, Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import type { ChartData } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)
ChartJS.defaults.font.family = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
ChartJS.defaults.color = '#64748b'

defineProps<{
  chartData: ChartData<'pie'>
  chartOptions?: ChartOptions<'pie'>
}>()
</script>

<style scoped>
canvas {
  max-height: 40dvh;
  width: 100%;
}
</style>
