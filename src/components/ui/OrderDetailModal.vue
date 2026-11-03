<template>
  <BaseModal v-if="order" :open="!!order" @close-modal="emit('close', false)">
    <!-- Modal Title -->
    <div class="mb-6 flex flex-col gap-0.5 pr-10">
      <h2 class="text-lg font-semibold text-slate-900">Order #{{ order.id }} Details</h2>
      <p class="text-sm text-slate-500">
        Order placed on {{ new Date(order.date).toLocaleDateString() }}
      </p>
    </div>

    <!-- Order Info -->
    <div class="mb-6 grid grid-cols-2 gap-3">
      <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p class="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Order Status
        </p>
        <span class="badge bg-emerald-50 text-emerald-700 capitalize ring-1 ring-emerald-200">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          {{ order.status }}
        </span>
      </div>
      <div class="rounded-2xl bg-brand-50/70 p-4 text-right ring-1 ring-brand-100">
        <p class="mb-1 text-xs font-semibold tracking-wider text-brand-400 uppercase">
          Total Amount
        </p>
        <p class="text-2xl font-bold tracking-tight text-brand-700">
          ${{
            order.total.toLocaleString('id-ID', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </p>
      </div>
    </div>

    <!-- Items Ordered -->
    <div class="mb-6">
      <p class="mb-3 text-sm font-semibold text-slate-900">Items Ordered</p>
      <div class="scroll-thin max-h-[40vh] overflow-y-auto pr-1">
        <ul class="flex flex-col gap-2">
          <li
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 p-3"
          >
            <div class="flex min-w-0 items-center gap-3">
              <img
                :src="item.thumbnail"
                class="h-14 w-14 shrink-0 rounded-xl bg-slate-50 object-contain p-1"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">{{ item.title }}</p>
                <p class="text-xs text-slate-500">
                  Quantity: {{ item.quantity }} × ${{
                    item.price.toLocaleString('id-ID', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </p>
              </div>
            </div>
            <p class="shrink-0 text-sm font-semibold text-slate-900">
              ${{
                (item.quantity * item.price).toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Shipping Information -->
    <div>
      <p class="mb-3 text-sm font-semibold text-slate-900">Shipping Information</p>
      <div class="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <div class="flex flex-col gap-0.5">
          <p class="text-sm font-semibold text-slate-900">
            {{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}
          </p>
          <p class="text-sm text-slate-600">
            {{ order.shippingInfo.address }}
          </p>
          <p class="text-sm text-slate-600">{{ order.shippingInfo.city }}</p>
        </div>
        <div class="flex flex-col gap-0.5 border-t border-slate-200/70 pt-3">
          <p class="text-xs text-slate-500">Email: {{ order.shippingInfo.email }}</p>
          <p class="text-xs text-slate-500">Phone: {{ order.shippingInfo.phone }}</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { IOrderSaved } from '@/service'
import BaseModal from './BaseModal.vue'

defineProps<{
  order: IOrderSaved | null
}>()

const emit = defineEmits(['close'])
</script>
