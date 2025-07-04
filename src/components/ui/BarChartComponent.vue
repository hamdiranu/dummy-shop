<template>
  <Bar :data="chartData" :options="chartOptions" />
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['beauty', 'fragrances', 'furniture', 'groceries'],
  datasets: [
    {
      label: 'Products',
      data: [5, 5, 5, 15],
      backgroundColor: '#8b5cf6',
    },
  ],
}

const chartOptions: ChartOptions<'bar'> = {
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
</script>

<style scoped>
canvas {
  max-height: 50dvh;
}
</style>
