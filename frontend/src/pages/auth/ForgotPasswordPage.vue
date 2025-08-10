<script setup>
import { useHead } from '@vueuse/head';
import ForgotPasswordView from '@/components/auth/ForgotPasswordView.vue';

useHead({
  title: 'Halaman Forgot Password - SIMATIK',
   meta: [
    {
      name: 'description',
      content: 'Atur ulang kata sandi Anda untuk dapat kembali mengakses sistem informasi manajemen aset TIK SIMATIK.',
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
  <ForgotPasswordView />
</template>
