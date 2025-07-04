<template>
  <div class="flex min-h-screen bg-gray-50 text-gray-900">
    <Sidebar :isOpen="isSidebarOpen" />

    <!-- Adjusted layout container -->
    <div :class="['flex flex-col min-h-screen w-full transition-all duration-300']">
      <Navbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" :isOpen="isSidebarOpen" />
      <main
        :class="[
          isSidebarOpen ? 'ml-[14%]' : 'ml-0',
          'p-6 transition-all flex flex-1 duration-300',
        ]"
      >
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './SideBar.vue'
import Navbar from './NavBar.vue'

const isSidebarOpen = ref(true)
</script>
