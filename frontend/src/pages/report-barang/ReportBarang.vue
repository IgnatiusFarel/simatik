<script setup>
import { useHead } from '@vueuse/head';
import ReportBarangView from '@/components/report-barang/ReportBarangView.vue';

useHead({
  title: 'Halaman Report Barang - SIMATIK',
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
  <ReportBarangView />
</template>
