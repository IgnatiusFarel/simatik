<script setup>
import { useHead } from '@vueuse/head';
import MasterUserView from '../../components/master-user/MasterUserView.vue';

useHead({
  title: 'Halaman Master User - SIMATIK',
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
  <MasterUserView />
</template>
