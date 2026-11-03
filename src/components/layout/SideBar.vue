<template>
  <!-- Drawer Sidebar -->
  <aside
    id="drawer-navigation"
    :class="[
      'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/70 bg-white transition-transform duration-300 ease-out',
      props.isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
    tabindex="-1"
    aria-labelledby="drawer-navigation-label"
  >
    <!-- Brand -->
    <div class="flex h-16 shrink-0 items-center gap-3 px-5">
      <div
        class="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-violet-600 text-white shadow-glow"
      >
        <SidebarTitle class="h-5 w-5" />
      </div>
      <div class="leading-tight">
        <p id="drawer-navigation-label" class="text-sm font-bold text-slate-900">
          DummyJSON Store
        </p>
        <p class="text-xs text-slate-400">Commerce console</p>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="scroll-thin flex-1 overflow-y-auto px-3 py-4">
      <p class="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        Navigation
      </p>
      <div class="space-y-1">
        <RouterLink
          v-for="link in sidebarLinks"
          :key="link.name"
          :to="link.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            :class="[
              'group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ]"
          >
            <span
              :class="[
                'grid h-8 w-8 place-items-center rounded-lg transition-colors',
                isActive
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700',
              ]"
            >
              <component :is="link.icon" class="h-4 w-4" />
            </span>
            <span class="flex-1">{{ link.name }}</span>
            <span
              v-if="link.name === 'Cart' && cartQuantity > 0"
              class="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white"
            >
              {{ cartQuantity }}
            </span>
          </a>
        </RouterLink>
      </div>
    </nav>

    <!-- Bottom: User Info -->
    <div class="relative shrink-0 border-t border-slate-200/70 p-3" ref="dropdownRef">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="flex animate-pulse items-center gap-3 p-2">
        <div class="h-9 w-9 rounded-full bg-slate-200"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 w-24 rounded bg-slate-200"></div>
          <div class="h-2.5 w-32 rounded bg-slate-100"></div>
        </div>
      </div>

      <!-- Error Fallback -->
      <div v-else-if="isError" class="space-y-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-600">
        <p>Failed to load user data. Please try again later.</p>
        <button @click="handleSignOut" class="flex items-center gap-1.5 font-semibold">
          <SignOutIcon class="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      <template v-else>
        <button
          @click="toggleDropdown"
          :class="[
            'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-slate-100',
            showDropdown && 'bg-slate-100',
          ]"
        >
          <img
            :src="user.image"
            alt="User avatar"
            class="h-9 w-9 rounded-full bg-brand-50 object-cover shadow-soft ring-2 ring-white"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-slate-900">{{ user.fullName }}</p>
            <p class="truncate text-xs text-slate-500">{{ user.email }}</p>
          </div>
          <svg
            class="h-4 w-4 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </button>

        <transition name="pop">
          <div
            v-if="showDropdown"
            class="absolute right-3 bottom-[calc(100%-0.25rem)] left-3 z-50 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 text-sm shadow-lift"
          >
            <div class="px-3 py-2">
              <p class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                My Account
              </p>
            </div>

            <RouterLink
              to="/profile"
              class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ProfileIcon class="h-4 w-4 text-slate-500" />
              Profile
            </RouterLink>

            <div class="my-1 h-px bg-slate-100"></div>

            <button
              @click="handleSignOut"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-rose-600 transition-colors hover:bg-rose-50"
            >
              <SignOutIcon class="h-4 w-4" />
              Sign out
            </button>
          </div>
        </transition>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import {
  CartIcons,
  DashboardIcons,
  SidebarTitle,
  OrderIcons,
  ProductIcon,
  ShopIcon,
  ProfileIcon,
  SignOutIcon,
} from '@/assets/icons'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCart } from '@/store'
import { useQuery } from '@tanstack/vue-query'
import { fetchCurrentUsers } from '@/service'

const props = defineProps<{
  isOpen: boolean
}>()

const sidebarLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: DashboardIcons },
  { name: 'Products', to: '/products', icon: ProductIcon },
  { name: 'Shop', to: '/shop', icon: ShopIcon },
  { name: 'Cart', to: '/cart', icon: CartIcons },
  { name: 'Orders', to: '/orders', icon: OrderIcons },
]

// Vue Query: useQuery for user data
const {
  data: userData,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['me-data'],
  queryFn: () => fetchCurrentUsers(),
  retry: false,
})

// Derived/computed user info
const user = computed(() => ({
  fullName: `${userData.value?.firstName ?? ''} ${userData.value?.lastName ?? ''}`.trim(),
  email: userData.value?.email ?? '',
  image: userData.value?.image ?? '',
}))

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const router = useRouter()

const handleSignOut = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}

const { cartQuantity, updateCartFromLocalStorage } = useCart()

onMounted(() => {
  updateCartFromLocalStorage()
  window.addEventListener('storage', updateCartFromLocalStorage)
})
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
</style>
