<template>
  <main class="w-full h-[96px] flex items-center justify-between px-2 border-b border-[#E9EAEC] bg-white">
    
    <!-- LEFT: Collapse + Search -->
    <div class="flex items-center gap-4">
      <!-- Collapse Button -->
  <a-button type="text" class="p-2" @click="$emit('toggle-sidebar')">
  <Menu class="w-5 h-5" />
</a-button>


     <a-input
        v-model:value="searchText"
        placeholder="Search..."
        allow-clear
        :bordered="false"
        class="w-[320px] h-[48px] rounded-[8px] bg-[#FAFAFA] pl-3 text-sm"
      >
        <template #prefix>
          <Search class="w-4 h-4 text-[#21252B0]" />
        </template>
      </a-input>
    </div>

    <!-- RIGHT: Notification + Avatar -->
    <div class="flex items-center gap-4">
      <!-- Notification Icon -->
      <a-badge dot>
        <a-button type="text" class="p-2">
          <Bell class="w-5 h-5" />
        </a-button>
      </a-badge>

      <!-- Profile + Chevron -->
      <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full">
        <a-avatar
          size="large"
          src="https://i.pravatar.cc/40"
        />
        <ChevronRight class="w-4 h-4 text-[#21252B]" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, Bell, ChevronRight, Search  } from 'lucide-vue-next' 

const searchText = ref('')
</script>
