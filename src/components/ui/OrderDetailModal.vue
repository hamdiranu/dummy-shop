<template>
  <transition name="fade">
    <div v-if="order" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        ref="modalRef"
        class="bg-white w-full max-w-[42rem] p-6 rounded-lg shadow-lg relative"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <!-- Modal Title -->
        <h2 class="text-xl font-bold mb-4">Order #{{ order.id }} Details</h2>

        <!-- Order Info -->
        <div class="grid grid-cols-2 mb-6">
          <div>
            <p class="text-sm text-gray-500 mb-1">Order Status</p>
            <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-xl font-medium">
              {{ order.status }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 mb-1">Total Amount</p>
            <p class="text-xl font-bold">${{ order.total.toFixed(2) }}</p>
          </div>
        </div>

        <!-- Items Ordered -->
        <div class="mb-6">
          <p class="font-medium mb-3">Items Ordered</p>
          <div class="overflow-y-auto max-h-[40vh] pr-2">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between py-3"
              >
                <div class="flex items-center gap-3">
                  <img :src="item.thumbnail" class="w-12 h-12 object-cover rounded" />
                  <div>
                    <p class="font-medium text-sm">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">
                      Quantity: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <p class="text-sm font-semibold">${{ (item.quantity * item.price).toFixed(2) }}</p>
              </li>
              <li
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between py-3"
              >
                <div class="flex items-center gap-3">
                  <img :src="item.thumbnail" class="w-12 h-12 object-cover rounded" />
                  <div>
                    <p class="font-medium text-sm">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">
                      Quantity: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <p class="text-sm font-semibold">${{ (item.quantity * item.price).toFixed(2) }}</p>
              </li>
              <li
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between py-3"
              >
                <div class="flex items-center gap-3">
                  <img :src="item.thumbnail" class="w-12 h-12 object-cover rounded" />
                  <div>
                    <p class="font-medium text-sm">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">
                      Quantity: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <p class="text-sm font-semibold">${{ (item.quantity * item.price).toFixed(2) }}</p>
              </li>
              <li
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between py-3"
              >
                <div class="flex items-center gap-3">
                  <img :src="item.thumbnail" class="w-12 h-12 object-cover rounded" />
                  <div>
                    <p class="font-medium text-sm">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">
                      Quantity: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <p class="text-sm font-semibold">${{ (item.quantity * item.price).toFixed(2) }}</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Shipping Information -->
        <div>
          <p class="font-medium mb-3">Shipping Information</p>
          <div class="bg-gray-50 p-4 rounded text-sm text-gray-800">
            <p class="mb-1">{{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}</p>
            <p class="mb-1">{{ order.shippingInfo.address }}</p>
            <p class="mb-1">{{ order.shippingInfo.city }}</p>
            <p class="text-xs text-gray-500">Email: {{ order.shippingInfo.email }}</p>
            <p class="text-xs text-gray-500">Phone: {{ order.shippingInfo.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { IOrderSaved } from '@/service'
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  order: IOrderSaved | null
}>()

const emit = defineEmits(['close'])
const modalRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
