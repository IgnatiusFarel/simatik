<script setup>
import { useHead } from '@vueuse/head';
import LoginView from '@/components/auth/LoginView.vue';

useHead({
  title: 'Halaman Login - SIMATIK',
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
  <LoginView />
</template>
