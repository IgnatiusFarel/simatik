<template>
  <div class="flex h-screen">
    <!-- Sidebar (Desktop only) -->
    <Sidebar
      v-if="!isMobile"
      :collapsed="collapsed"
      :isMobile="isMobile"
    />

    <!-- Sidebar Drawer (Mobile only) -->
    <a-drawer
      v-model:visible="showSidebar"
      placement="left"
      :closable="false"
      width="280"
      class="!p-0"
      :body-style="{ padding: 0, height: '100%', overflow: 'auto' }"
    >
      <Sidebar
        :collapsed="false"
        :isMobile="true"
        @close-drawer="showSidebar = false"
      />
    </a-drawer>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <Navbar @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'

const collapsed = ref(false)
const isMobile = ref(false)
const showSidebar = ref(false)
const wasMobile = ref(false) // Untuk mendeteksi perubahan dari mobile ke desktop

const toggleSidebar = () => {
  if (isMobile.value) {
    showSidebar.value = !showSidebar.value
  } else {
    collapsed.value = !collapsed.value
  }
}

const checkMobile = () => {
  const nowMobile = window.innerWidth < 768
  isMobile.value = nowMobile

  // Deteksi perubahan dari mobile ke desktop
  if (!nowMobile && wasMobile.value) {
    showSidebar.value = false
  }

  wasMobile.value = nowMobile
  collapsed.value = nowMobile ? false : collapsed.value
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
