<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './components/layout/DashboardLayout.vue'
import EmptyLayout from './components/layout/EmptyLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return route.meta.layout === 'empty' ? EmptyLayout : DashboardLayout
})
</script>
