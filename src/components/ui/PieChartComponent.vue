<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, type ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = {
  labels: ['beauty', 'fragrances', 'furniture', 'groceries'],
  datasets: [
    {
      label: 'Categories',
      data: [17, 17, 17, 50],
      backgroundColor: ['#3b82f6', '#10b981', '#fbbf24', '#f97316'],
    },
  ],
}

const chartOptions: ChartOptions<'pie'> = {
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
