<template>
  <Bar :data="computedChartData" :options="computedOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Props
const props = defineProps<{
  labels: string[]
  data: number[]
  datasetLabel?: string
  backgroundColor?: string
  options?: ChartOptions<'bar'>
}>()

const computedChartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.datasetLabel ?? 'Dataset',
      data: props.data,
      backgroundColor: props.backgroundColor ?? '#8b5cf6',
    },
  ],
}))

const defaultOptions: ChartOptions<'bar'> = {
  responsive: true,
  animation: {
    duration: 800,
    easing: 'easeOutBounce',
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const computedOptions = computed(() => ({
  ...defaultOptions,
  ...props.options,
}))
</script>

<style scoped>
canvas {
  max-height: 50dvh;
}
</style>
