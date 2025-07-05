<template>
  <div class="w-full mx-auto">
    <h1 class="text-3xl font-bold mb-1">Order History</h1>
    <p class="text-base text-gray-500 mb-6">Track and manage your orders</p>

    <div v-if="orders.length > 0">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border border-[#e5e7eb] rounded-lg px-6 py-4 mb-4 shadow-sm"
      >
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-center">
              <h2 class="text-2xl font-semibold">Order #{{ order.id }}</h2>
              <span
                class="text-xs text-white bg-[#22C55E] hover:bg-[#27272f] px-3 py-1.5 rounded-xl font-semibold transition-colors"
              >
                {{ order.status }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <DateIcon class="w-4 h-4" />
                {{ new Date(order.date).toLocaleDateString() }}
              </div>
              <div class="flex items-center gap-1">
                <DollarIcon class="w-4 h-4" />
                ${{ order.total.toFixed(2) }}
              </div>
              <div class="flex items-center gap-1">
                <ProductIcon class="w-4 h-4" />
                {{ order.totalQuantity }} items
              </div>
            </div>
          </div>

          <button
            class="flex items-center gap-2 text-sm font-medium text-gray-700 border border-[#e5e7eb] rounded px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
            @click="openOrderDetail(order)"
          >
            <EyeIcon class="w-4 h-4" />
            View Details
          </button>
        </div>

        <div class="flex mt-8 mb-4 gap-3 flex-wrap">
          <img
            v-for="item in order.items"
            :key="item.id"
            :src="item.thumbnail"
            class="w-16 h-16 rounded object-cover"
            alt="product"
          />
        </div>
      </div>
    </div>

    <div v-else class="h-[60vh] w-full flex flex-col justify-center items-center px-4 text-center">
      <ProductIcon class="w-32 h-32 text-[#6F7074] mb-4" />
      <div class="flex flex-col justify-center items-center gap-2">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800">No orders yet</h2>
        <p class="text-md text-[#71717a] mb-4">Your order history will appear here</p>
      </div>
    </div>
  </div>

  <OrderDetailModal v-if="selectedOrder" :order="selectedOrder" @close="selectedOrder = null" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { DateIcon, DollarIcon, EyeIcon, ProductIcon } from '@/assets/icons'
import { OrderDetailModal } from '@/components/ui'
import type { IOrderSaved } from '@/service'

const orders = ref<IOrderSaved[]>([])
const selectedOrder = ref<IOrderSaved | null>(null)

watchEffect(() => {
  const stored = localStorage.getItem('orders')

  if (stored) {
    orders.value = JSON.parse(stored)
  }
})

const openOrderDetail = (order: IOrderSaved) => {
  selectedOrder.value = order
}
</script>
