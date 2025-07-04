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
import { useQuery } from '@tanstack/vue-query'
import { fetchCarts, fetchUsers, fetchProducts } from '@/service/service'

// TanStack Query for users
const { data: productData, isFetching: isFetchingProducts } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

const { data: userData, isFetching: isFetchingUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

const { data: cartData, isFetching: isFetchingCarts } = useQuery({
  queryKey: ['carts'],
  queryFn: fetchCarts,
})

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
