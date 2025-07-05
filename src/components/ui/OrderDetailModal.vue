<template>
  <transition name="fade-modal">
    <div
      v-if="order"
      class="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
      @click.self="emit('close')"
    >
      <div
        ref="modalRef"
        class="modal bg-white w-full max-w-[42rem] p-6 rounded-lg shadow-lg relative"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
        >
          <CrossIcon class="w-6 h-6 cursor-pointer" />
        </button>

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
              <p class="text-sm font-normal text-[#71717A]">
                Email: {{ order.shippingInfo.email }}
              </p>
              <p class="text-sm font-normal text-[#71717A]">
                Phone: {{ order.shippingInfo.phone }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { CrossIcon } from '@/assets/icons'
import type { IOrderSaved } from '@/service'
import { ref } from 'vue'

defineProps<{
  order: IOrderSaved | null
}>()

const emit = defineEmits(['close'])
const modalRef = ref<HTMLElement | null>(null)
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
