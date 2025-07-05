<template>
  <BaseModal v-if="order" :open="!!order" @close-modal="emit('close', false)">
    <!-- Modal Title -->
    <div class="flex flex-col gap-0 mb-6">
      <h2 class="text-lg font-semibold text-[#09090B]">Order #{{ order.id }} Details</h2>
      <h2 class="text-sm font-normal text-[#71717A]">
        Order placed on {{ new Date(order.date).toLocaleDateString() }}
      </h2>
    </div>

    <!-- Order Info -->
    <div class="grid grid-cols-2 mb-6">
      <div>
        <p class="text-base font-base text-[#09090B] mb-1">Order Status</p>
        <span
          class="text-xs text-white bg-[#22C55E] hover:bg-[#27272f] px-3 py-1 rounded-xl font-semibold transition-colors"
        >
          {{ order.status }}
        </span>
      </div>
      <div class="text-right">
        <p class="text-base font-semibold text-[#09090B] mb-1">Total Amount</p>
        <p class="text-2xl font-bold text-[#09090B]">
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
      <p class="font-semibold text-base text-[#09090B] mb-3">Items Ordered</p>
      <div class="overflow-y-auto max-h-[40vh] pr-2">
        <ul class="flex flex-col gap-3">
          <li
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between p-3 border border-[#e5e7eb] rounded-lg"
          >
            <div class="flex items-center gap-3">
              <img :src="item.thumbnail" class="w-16 h-16 object-cover rounded" />
              <div>
                <p class="font-medium text-base text-[#09090B]">{{ item.title }}</p>
                <p class="font-normal text-sm text-[#71717A]">
                  Quantity: {{ item.quantity }} × ${{
                    item.price.toLocaleString('id-ID', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </p>
              </div>
            </div>
            <p class="text-base font-semibold text-[#09090B]">
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
      <p class="font-semibold text-base text-[#09090B] mb-3">Shipping Information</p>
      <div class="bg-[#F4F5F5] p-4 rounded gap-2 flex flex-col">
        <div class="flex flex-col gap-0">
          <p class="text-base font-medium text-[#09090B]">
            {{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}
          </p>
          <p class="text-base font-normal text-[#09090B]">
            {{ order.shippingInfo.address }}
          </p>
          <p class="text-base font-normal text-[#09090B]">{{ order.shippingInfo.city }}</p>
        </div>
        <div class="flex flex-col gap-0">
          <p class="text-sm font-normal text-[#71717A]">Email: {{ order.shippingInfo.email }}</p>
          <p class="text-sm font-normal text-[#71717A]">Phone: {{ order.shippingInfo.phone }}</p>
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
