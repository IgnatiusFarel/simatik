<script setup>
import { useHead } from '@vueuse/head';
import DashboardView from '../../components/dashboard/DashboardView.vue';

useHead({
  title: 'Halaman Dashboard - SIMATIK',
   meta: [
    {
      name: 'description',
      content: 'Halaman dashboard utama untuk memantau dan mengelola aset TIK secara real-time melalui sistem SIMATIK.',
    },
    {
      name: 'keywords',
      content: 'dashboard aset, SIMATIK, sistem informasi aset, manajemen aset TIK, monitoring aset',
    },
    {
      name: 'author',
      content: 'Practice My Full-Stack Skill',
    },
    {
      property: 'og:title',
      content: 'Dashboard SIMATIK',
    },
    {
      property: 'og:description',
      content: 'Pantau aset teknologi informasi dan komunikasi Anda dari satu tempat dengan dashboard SIMATIK.',
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
  <DashboardView/>  
</template>
