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
ChartJS.defaults.font.family = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
ChartJS.defaults.color = '#64748b'

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
      backgroundColor: props.backgroundColor ?? '#6366f1',
      hoverBackgroundColor: '#4f46e5',
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 40,
    },
  ],
}))

const defaultOptions: ChartOptions<'bar'> = {
  responsive: true,
  animation: {
    duration: 800,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 10,
      cornerRadius: 10,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: { precision: 0 },
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
