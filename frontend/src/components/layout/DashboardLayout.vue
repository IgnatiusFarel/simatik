<template>
  <div class="flex h-screen overflow-x-hidden">

    <Sidebar v-if="!isMobile" :collapsed="collapsed" :isMobile="isMobile" />

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

  <div
  class="flex-1 flex flex-col overflow-hidden"
  :class="!isMobile ? (collapsed ? 'ml-[72px]' : 'ml-[280px]') : ''"
>

      <Navbar @toggle-sidebar="toggleSidebar" />
      <div class="flex-1 overflow-auto p-6 bg-gray-50">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Navbar from "@/components/layout/Navbar.vue";

const collapsed = ref(false);
const isMobile = ref(false);
const showSidebar = ref(false);
const wasMobile = ref(false); 

const toggleSidebar = () => {
  if (isMobile.value) {
    showSidebar.value = !showSidebar.value;
  } else {
    collapsed.value = !collapsed.value;
  }
};

const checkMobile = () => {
  const nowMobile = window.innerWidth < 768;
  isMobile.value = nowMobile;
  
  if (!nowMobile && wasMobile.value) {
    showSidebar.value = false;
  }

  wasMobile.value = nowMobile;
  collapsed.value = nowMobile ? false : collapsed.value;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>
