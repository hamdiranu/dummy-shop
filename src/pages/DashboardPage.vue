<template>
  <div class="w-full space-y-6">
    <!-- Welcome banner -->
    <section
      class="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-500 to-violet-500 p-6 text-white shadow-glow sm:p-8"
    >
      <div
        aria-hidden="true"
        class="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/15 blur-3xl"
      ></div>
      <div
        aria-hidden="true"
        class="absolute right-40 -bottom-24 h-48 w-48 rounded-full bg-violet-300/40 blur-3xl"
      ></div>

      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-medium text-white/70">{{ today }}</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            <ShinyText
              :text="`Welcome back${meData?.firstName ? `, ${meData.firstName}` : ''}`"
              color="#dfe4ff"
              shine-color="#ffffff"
              :speed="2.5"
              :delay="3"
            />
          </h1>
          <p class="mt-1 text-sm text-white/80">Overview of your e-commerce metrics</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            to="/products"
            class="btn bg-white/15 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25"
          >
            <ProductIcon class="h-4 w-4" />
            Manage Products
          </RouterLink>
          <RouterLink to="/shop" class="btn bg-white text-brand-700 shadow-lg hover:bg-brand-50">
            <ShopIcon class="h-4 w-4" />
            Open Shop
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Total Products"
        :value="productData?.total || 0"
        subtitle="Available in store"
        :icon="ProductIcon"
        :isLoading="isFetchingProducts"
        accent="brand"
      />
      <DashboardCard
        title="Total Users"
        :value="userData?.total || 0"
        subtitle="Registered customers"
        :icon="UsersIcon"
        :isLoading="isFetchingUsers"
        accent="emerald"
      />
      <DashboardCard
        title="Active Carts"
        :value="cartData?.total || 0"
        subtitle="Items in carts"
        :icon="CartIcons"
        :isLoading="isFetchingCarts"
        accent="amber"
      />
      <DashboardCard
        title="Total Revenue"
        :value="totalRevenue"
        :format="formatCurrency"
        subtitle="From all carts"
        :icon="RevenueIcon"
        :isLoading="isFetchingCarts"
        accent="rose"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <!-- Bar Chart -->
      <ChartCard
        title="Products by Category"
        subtitle="Distribution of products across categories"
        class="lg:col-span-3"
      >
        <BarChartComponent :labels="barChartLabel" :data="barChartData" dataset-label="Products" />
      </ChartCard>

      <!-- Pie Chart -->
      <ChartCard
        title="Category Distribution"
        subtitle="Share of products per category"
        class="lg:col-span-2"
      >
        <PieChartComponent :chartData="pieChartData" :chartOptions="pieChartOptions" />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardCard, BarChartComponent, PieChartComponent, ChartCard } from '@/components/ui'
import { ShinyText } from '@/components/bits'
import { ProductIcon, CartIcons, RevenueIcon, UsersIcon, ShopIcon } from '@/assets/icons'
import { useQuery } from '@tanstack/vue-query'
import { fetchCarts, fetchUsers, fetchProducts, fetchCurrentUsers } from '@/service/service'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { ChartOptions } from 'chart.js'

const barChartLabel = ref<string[]>([])
const barChartData = ref<number[]>([])

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const { data: meData } = useQuery({
  queryKey: ['me-data'],
  queryFn: () => fetchCurrentUsers(),
  retry: false,
})

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

const totalRevenue = computed(
  () => cartData.value?.carts.reduce((sum, cart) => sum + cart.discountedTotal, 0) || 0,
)

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatCurrency = (value: number) => currencyFormatter.format(value)

// Curated palette so the chart matches the UI instead of random colors on each load
const chartPalette = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#a855f7',
  '#d946ef',
  '#64748b',
  '#22c55e',
]

const paletteColors = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => chartPalette[i % chartPalette.length])

const pieChartData = computed(() => ({
  labels: barChartLabel.value,
  datasets: [
    {
      label: 'Categories',
      data: barChartData.value,
      backgroundColor: paletteColors(barChartData.value.length),
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
}))

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 10,
      cornerRadius: 10,
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
      labels: { padding: 14, usePointStyle: true, pointStyle: 'circle', boxWidth: 8 },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 800,
    easing: 'easeOutQuart',
  },
} as ChartOptions<'pie'>
</script>
