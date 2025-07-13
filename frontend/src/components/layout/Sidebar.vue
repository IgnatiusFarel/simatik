<template>
  <main
    :class="[
      'border-r border-[#E9EAEC] bg-white flex flex-col transition-all duration-300',
      isMobile
        ? 'h-full px-4 py-4'
        : collapsed
          ? 'h-screen w-[72px] px-2 py-4'
          : 'h-screen w-[280px] px-6 py-6'
    ]"
  >
    <!-- Logo + Close Button (Drawer Mode) -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex justify-center w-full" v-if="!isMobile">
        <img
          src="@/assets/SIMATIK.png"
          alt="logo"
          :class="[
            'transition-all duration-300',
            collapsed ? 'w-10' : 'w-[212px]'
          ]"
        />
      </div>
      <div class="flex items-center justify-between w-full" v-else>
        <img src="@/assets/SIMATIK.png" alt="logo" class="w-[140px]" />
        <button @click="$emit('close-drawer')" class="text-gray-500 hover:text-red-500">
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Main Menu Sections -->
    <div class="space-y-6 text-sm">
      <!-- MAIN MENU -->
      <div>
        <h2 v-if="!collapsed || isMobile" class="font-bold text-[#21252B] text-xs mb-2">
          MAIN MENU
        </h2>
        <div
          class="rounded-md text-red-600 bg-red-50 cursor-pointer transition-colors"
          :class="(collapsed && !isMobile) ? 'flex items-center justify-center w-full h-10' : 'flex items-center space-x-2 px-3 py-2'"
        >
          <LayoutGrid class="w-4 h-4" />
          <span v-if="!collapsed || isMobile">Dashboard</span>
        </div>
      </div>

      <!-- MASTER DATA -->
      <div>
        <h2 v-if="!collapsed || isMobile" class="font-bold text-[#21252B] text-xs mb-4">
          MASTER DATA
        </h2>
        <div
          class="space-y-4"
          :class="(!collapsed || isMobile) ? 'pl-4' : ''"
        >
          <div
            class="cursor-pointer hover:text-red-600 transition-colors"
            :class="(collapsed && !isMobile) ? 'flex items-center justify-center w-full h-10' : 'flex items-center space-x-2'"
          >
            <Box class="w-4 h-4" />
            <span v-if="!collapsed || isMobile">Master Barang</span>
          </div>
          <div
            class="cursor-pointer hover:text-red-600 transition-colors"
            :class="(collapsed && !isMobile) ? 'flex items-center justify-center w-full h-10' : 'flex items-center space-x-2'"
          >
            <User class="w-4 h-4" />
            <span v-if="!collapsed || isMobile">Master User</span>
          </div>
        </div>
      </div>

      <!-- REPORTING -->
      <div>
        <h2 v-if="!collapsed || isMobile" class="font-bold text-[#21252B] text-xs mb-4">
          REPORTING
        </h2>
        <div
          class="cursor-pointer hover:text-red-600 transition-colors"
          :class="(collapsed && !isMobile) ? 'flex items-center justify-center w-full h-10' : 'flex items-center space-x-2 pl-4'"
        >
          <ClipboardPlus class="w-4 h-4" />
          <span v-if="!collapsed || isMobile">Report Barang</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { LayoutGrid, Box, User, ClipboardPlus, X } from 'lucide-vue-next'

defineProps({
  collapsed: Boolean,
  isMobile: Boolean
})

defineEmits(['close-drawer'])
</script>
