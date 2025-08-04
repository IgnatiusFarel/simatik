<script setup>
import { useHead } from '@vueuse/head';
import ReportBarangView from '@/components/report-barang/ReportBarangView.vue';

useHead({
  title: 'Halaman Report Barang - SIMATIK',
   meta: [
    {
      name: 'description',
      content: 'Halaman laporan barang aset TIK. Anda dapat melihat dan mengekspor data barang ke Excel atau format lainnya.',
    },
    {
      name: 'keywords',
      content: 'report barang, laporan aset, export excel, aset TIK, SIMATIK, data barang',
    },
    {
      name: 'author',
      content: 'Practice My Full-Stack Skill',
    },
    {
      property: 'og:title',
      content: 'Laporan Barang Aset TIK - SIMATIK',
    },
    {
      property: 'og:description',
      content: 'Lihat dan ekspor data barang aset Anda dengan mudah melalui halaman laporan barang SIMATIK.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      charset: 'utf-8',
    },
  ],
  link: [
    {
      rel: 'icon',
      href: '/Logo.png',
    },
  ],
});
</script>

<template>    
  <ReportBarangView />
</template>
