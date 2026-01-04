<script setup>
import { useHead } from '@vueuse/head';
import MasterUserView from '@/components/master-user/MasterUserView.vue';

useHead({
  title: "Halaman Master User - SIMATIK",
  meta: [
    {
      name: "description",
      content: "Halaman untuk mengelola data pengguna SIMATIK. Anda dapat menambah, mengubah, dan menghapus data user.",
    },
    {
      name: "keywords",
      content: "user SIMATIK, manajemen user, master user, crud user, aset TIK",
    },
    {
      name: "author",
      content: "Practice My Full-Stack Skill",
    },
    {
      property: "og:title",
      content: "Master User - SIMATIK",
    },
    {
      property: "og:description",
      content: "Kelola akun pengguna dalam sistem manajemen aset TIK (SIMATIK).",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      charset: "utf-8",
    },
  ],
  link: [
    {
      rel: "icon",
      href: "/Logo.png",
    },
  ],
});
</script>

<template>    
  <MasterUserView />
</template>
