<template>
  <div class="space-y-4 w-[100%]">
    <!-- Header -->
    <div>
      <h1 class="text-xl sm:text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-gray-500">Overview of your e-commerce metrics</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        title="Total Products"
        :value="productData?.total || 0"
        subtitle="Available in store"
        :icon="ProductIcon"
        :isLoading="isFetchingProducts"
      />
      <DashboardCard
        title="Total Users"
        :value="userData?.total || 0"
        subtitle="Registered customers"
        :icon="UsersIcon"
        :isLoading="isFetchingUsers"
      />
      <DashboardCard
        title="Active Carts"
        :value="cartData?.total || 0"
        subtitle="Items in carts"
        :icon="CartIcons"
        :isLoading="isFetchingCarts"
      />
      <DashboardCard
        title="Total Revenue"
        :value="formattedRevenue"
        subtitle="From all carts"
        :icon="RevenueIcon"
        :isLoading="isFetchingCarts"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <!-- Bar Chart -->
      <ChartCard title="Products by Category" subtitle="Distribution of products across categories">
        <BarChartComponent :labels="barChartLabel" :data="barChartData" dataset-label="Products" />
      </ChartCard>

      <!-- Pie Chart -->
      <ChartCard title="Category Distribution" subtitle="Pie chart view of product categories">
        <PieChartComponent :chartData="pieChartData" :chartOptions="pieChartOptions" />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardCard, BarChartComponent, PieChartComponent, ChartCard } from '@/components/ui'
import { ProductIcon, CartIcons, RevenueIcon, UsersIcon } from '@/assets/icons'
import { useQuery } from '@tanstack/vue-query'
import { fetchCarts, fetchUsers, fetchProducts } from '@/service/service'
import { computed, ref } from 'vue'
import type { ChartOptions } from 'chart.js'

const barChartLabel = ref<string[]>([])
const barChartData = ref<number[]>([])

const { data: productData, isFetching: isFetchingProducts } = useQuery({
  queryKey: ['all-products'],
  queryFn: async () => {
    const response = await fetchProducts({ limit: 100 })

    if (response?.products?.length) {
      const categoryMap = new Map<string, number>()

      response.products.forEach((product) => {
        categoryMap.set(product.category, (categoryMap.get(product.category) ?? 0) + 1)
      })

      barChartLabel.value = [...categoryMap.keys()]
      barChartData.value = [...categoryMap.values()]
    }

    return response
  },
})

const { data: userData, isFetching: isFetchingUsers } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
})

const { data: cartData, isFetching: isFetchingCarts } = useQuery({
  queryKey: ['carts'],
  queryFn: () => fetchCarts(),
})

const formattedRevenue = computed(() => {
  const total = cartData.value?.carts.reduce((sum, cart) => sum + cart.discountedTotal, 0) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total)
})

const generateRandomColors = (count: number): string[] => {
  return Array.from(
    { length: count },
    () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
  )
}

const pieChartData = computed(() => ({
  labels: barChartLabel.value,
  datasets: [
    {
      label: 'Categories',
      data: barChartData.value,
      backgroundColor: generateRandomColors(barChartData.value.length),
    },
  ],
}))

const pieChartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const data = ctx.dataset.data as number[]
          const total = data.reduce((a, b) => a + b, 0)
          const val = ctx.parsed
          return `${ctx.label}: ${((val / total) * 100).toFixed(1)}%`
        },
      },
    },
    legend: {
      position: 'bottom',
      labels: { padding: 50 },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 800,
    easing: 'easeOutBounce',
  },
} as ChartOptions<'pie'>
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
