<template>
  <div class="h-[40dvh] flex items-center justify-center">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { type ChartOptions, Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import type { ChartData } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

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
