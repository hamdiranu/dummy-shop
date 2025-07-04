<template>
  <div class="flex min-h-screen bg-gray-50 text-gray-900">
    <Sidebar :isOpen="isSidebarOpen" />

    <div class="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all">
      <Navbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="p-4">
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
