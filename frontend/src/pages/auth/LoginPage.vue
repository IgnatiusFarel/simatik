<script setup>
import { useHead } from '@vueuse/head';
import LoginView from '@/components/auth/LoginView.vue';

useHead({
  title: 'Halaman Login - SIMATIK',
   meta: [
    {
      name: 'description',
      content: 'Masuk ke SIMATIK untuk mengelola dan memantau aset TIK organisasi Anda secara real-time.',
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
  <LoginView />
</template>
