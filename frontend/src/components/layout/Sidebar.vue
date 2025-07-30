<template>
  <main
    :class="[
      'border-r border-[#E9EAEC] bg-white flex flex-col transition-all duration-300',
      isMobile
        ? 'h-full px-4 py-4'
        : collapsed
        ? 'h-screen w-[72px] px-2 py-4'
        : 'h-screen w-[280px] px-6 py-6',
    ]"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex justify-center w-full" v-if="!isMobile">
        <img
          src="@/assets/SIMATIK.png"
          alt="logo"
          :class="[
            'transition-all duration-300',
            collapsed ? 'w-10' : 'w-[212px]',
          ]"
        />
      </div>
      <div class="flex items-center justify-between w-full" v-else>
        <img src="@/assets/SIMATIK.png" alt="logo" class="w-[140px]" />
        <button
          @click="$emit('close-drawer')"
          class="text-gray-500 hover:text-red-500"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="space-y-6 text-sm">
      <div>
        <h2
          v-if="!collapsed || isMobile"
          class="font-bold text-[#21252B] text-xs mb-2"
        >
          MAIN MENU
        </h2>
        <router-link
          to="/dashboard"          
          :class="[
            'rounded-md cursor-pointer hover:text-red-600 transition-colors',
            { 
              'text-red-600 bg-red-50': $route.path === '/dashboard', 
              'flex items-center space-x-2 px-3 py-2': !(collapsed && !isMobile),
              'flex items-center justify-center w-full h-10': collapsed && !isMobile 
            }
          ]"
        >
          <LayoutGrid class="w-4 h-4" />
          <span v-if="!collapsed || isMobile">Dashboard</span>
        </router-link>
      </div>

      <div>
        <h2
          v-if="!collapsed || isMobile"
          class="font-bold text-[#21252B] text-xs mb-4"
        >
          MASTER DATA
        </h2>
        <div :class="!collapsed || isMobile ? 'pl-4 space-y-4' : 'space-y-4'">
          <router-link
            to="/master-barang"
             :class="[
            'rounded-md cursor-pointer hover:text-red-600 transition-colors',
            { 
              'text-red-600 bg-red-50': $route.path === '/master-barang', 
              'flex items-center space-x-2 px-3 py-2': !(collapsed && !isMobile),
              'flex items-center justify-center w-full h-10': collapsed && !isMobile 
            }
          ]"
          >
            <Box class="w-4 h-4" />
            <span v-if="!collapsed || isMobile">Master Barang</span>
          </router-link>

          <router-link
            to="/master-user"
           :class="[
            'rounded-md cursor-pointer hover:text-red-600 transition-colors',
            { 
              'text-red-600 bg-red-50': $route.path === '/master-user', 
              'flex items-center space-x-2 px-3 py-2': !(collapsed && !isMobile),
              'flex items-center justify-center w-full h-10': collapsed && !isMobile 
            }
          ]"
          >
            <User class="w-4 h-4" />
            <span v-if="!collapsed || isMobile">Master User</span>
          </router-link>
        </div>
      </div>
      
      <div>
        <h2
          v-if="!collapsed || isMobile"
          class="font-bold text-[#21252B] text-xs mb-4"
        >
          REPORTING
        </h2>
        <router-link
          to="/report-barang"
          :class="[
            'rounded-md cursor-pointer hover:text-red-600 transition-colors',
            { 
              'text-red-600 bg-red-50': $route.path === '/report-barang', 
              'flex items-center space-x-2 px-3 py-2': !(collapsed && !isMobile),
              'flex items-center justify-center w-full h-10': collapsed && !isMobile 
            }
          ]"
        >
          <ClipboardPlus class="w-4 h-4" />
          <span v-if="!collapsed || isMobile">Report Barang</span>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { LayoutGrid, Box, User, ClipboardPlus, X } from "lucide-vue-next";

defineProps({
  collapsed: Boolean,
  isMobile: Boolean,
});

defineEmits(["close-drawer"]);
</script>
