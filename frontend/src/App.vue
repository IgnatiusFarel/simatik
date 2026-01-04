<template>
  <a-config-provider :theme="theme">
    <component :is="layoutComponent">
      <router-view />
    </component>
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import EmptyLayout from '@/components/layout/EmptyLayout.vue'
import theme from '@/config/theme'

const route = useRoute()

const layoutComponent = computed(() => {
  if (route.meta.layout === 'dashboard') {
    return DashboardLayout
  } 
  return EmptyLayout
})
</script>
