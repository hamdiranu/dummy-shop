<template>
  <div class="mx-auto w-full">
    <div class="page-header">
      <div>
        <h1 class="page-title">Order History</h1>
        <p class="page-subtitle">Track and manage your orders</p>
      </div>
    </div>

    <div v-if="orders.length > 0" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="card p-5 transition-shadow duration-300 hover:shadow-lift sm:p-6"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex min-w-0 items-start gap-4">
            <span
              class="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 sm:grid"
            >
              <OrderIcons class="h-5 w-5" />
            </span>
            <div class="flex min-w-0 flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold text-slate-900">Order #{{ order.id }}</h2>
                <span class="badge bg-emerald-50 text-emerald-700 capitalize ring-1 ring-emerald-200">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {{ order.status }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
                <div class="flex items-center gap-1.5">
                  <DateIcon class="h-4 w-4 text-slate-400" />
                  {{ new Date(order.date).toLocaleDateString() }}
                </div>
                <div class="flex items-center gap-1.5">
                  <DollarIcon class="h-4 w-4 text-slate-400" />
                  <span class="font-semibold text-slate-700">${{ order.total.toFixed(2) }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <ProductIcon class="h-4 w-4 text-slate-400" />
                  {{ order.totalQuantity }} items
                </div>
              </div>
            </div>
          </div>

          <button class="btn-secondary" @click="openOrderDetail(order)">
            <EyeIcon class="h-4 w-4" />
            View Details
          </button>
        </div>

        <div class="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
          <img
            v-for="item in order.items.slice(0, maxThumbnails)"
            :key="item.id"
            :src="item.thumbnail"
            :title="item.title"
            class="h-14 w-14 rounded-xl bg-slate-50 object-contain p-1 ring-1 ring-slate-200/70"
            alt="product"
          />
          <span
            v-if="order.items.length > maxThumbnails"
            class="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500"
          >
            +{{ order.items.length - maxThumbnails }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state min-h-[60vh]">
      <span
        class="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-brand-50 text-brand-500 ring-1 ring-brand-100"
      >
        <ProductIcon class="h-10 w-10" />
      </span>
      <h2 class="text-lg font-semibold text-slate-900 sm:text-xl">No orders yet</h2>
      <p class="mt-1 mb-6 text-sm text-slate-500">Your order history will appear here</p>
      <RouterLink to="/shop" class="btn-primary">Start Shopping</RouterLink>
    </div>
  </div>

  <OrderDetailModal v-if="selectedOrder" :order="selectedOrder" @close="selectedOrder = null" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { DateIcon, DollarIcon, EyeIcon, OrderIcons, ProductIcon } from '@/assets/icons'
import { OrderDetailModal } from '@/components/ui'
import type { IOrderSaved } from '@/service'

const maxThumbnails = 8

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
