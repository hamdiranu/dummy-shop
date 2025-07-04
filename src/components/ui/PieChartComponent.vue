<template>
  <div class="h-[30dvh] flex items-center justify-center">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
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
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const data = context.dataset.data as number[]
          const total = data.reduce((a, b) => a + b, 0)
          const value = context.parsed
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: ${percentage}%`
        },
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        padding: 50,
      },
    },
  },
  animation: {
    duration: 800,
    easing: 'easeOutBounce',
  },
}
</script>

<style scoped>
canvas {
  max-height: 30dvh;
  width: 100%;
}
</style>
