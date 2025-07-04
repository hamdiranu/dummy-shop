<template>
  <div class="space-y-4 w-full">
    <!-- Header -->
    <div>
      <h1 class="text-xl sm:text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-gray-500">Overview of your e-commerce metrics</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        title="Total Products"
        :value="194"
        subtitle="Available in store"
        :icon="ProductIcon"
      />
      <DashboardCard
        title="Total Users"
        :value="208"
        subtitle="Registered customers"
        :icon="UsersIcon"
      />
      <DashboardCard title="Active Carts" :value="50" subtitle="Items in carts" :icon="CartIcons" />
      <DashboardCard
        title="Total Revenue"
        :value="formattedRevenue"
        subtitle="From all carts"
        :icon="RevenueIcon"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <!-- Bar Chart -->
      <ChartCard title="Products by Category" subtitle="Distribution of products across categories">
        <BarChartComponent />
      </ChartCard>

      <!-- Pie Chart -->
      <ChartCard title="Category Distribution" subtitle="Pie chart view of product categories">
        <PieChartComponent />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardCard, BarChartComponent, PieChartComponent, ChartCard } from '@/components/ui'
import { ProductIcon, CartIcons, RevenueIcon, UsersIcon } from '@/assets/icons'

const formattedRevenue = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(589088.8)
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
