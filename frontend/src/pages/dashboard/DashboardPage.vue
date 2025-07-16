<script setup>
import { useHead } from '@vueuse/head';
import DashboardView from '../../components/dashboard/DashboardView.vue';

useHead({
  title: 'Halaman Dashboard - SIMATIK',
  meta: [
    {
      name: 'description',
      content:
        'Sistem Informasi Manajemen Aset TIK',
    },
  ],
});
</script>

<template>    
  <DashboardView/>  
</template>
