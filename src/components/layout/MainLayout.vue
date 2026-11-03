<template>
  <div class="relative isolate min-h-screen text-slate-900">
    <!-- Same background as the login page -->
    <PageBackground />

    <Sidebar :isOpen="isSidebarOpen" />

    <!-- Mobile backdrop -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
        @click="isSidebarOpen = false"
      ></div>
    </transition>

    <div
      :class="[
        'relative flex min-h-screen flex-col transition-[padding] duration-300',
        isSidebarOpen ? 'md:pl-64' : 'md:pl-0',
      ]"
    >
      <Navbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="flex flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div :key="route.path" class="mx-auto flex w-full max-w-7xl animate-fade-up">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
  <SnackBar />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './SideBar.vue'
import Navbar from './NavBar.vue'
import { PageBackground, SnackBar } from '../ui'

const isDesktop = () => window.matchMedia('(min-width: 768px)').matches

const route = useRoute()
const isSidebarOpen = ref(isDesktop())

// On mobile the sidebar is an overlay drawer, so close it after navigating
watch(
  () => route.path,
  () => {
    if (!isDesktop()) isSidebarOpen.value = false
  },
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
