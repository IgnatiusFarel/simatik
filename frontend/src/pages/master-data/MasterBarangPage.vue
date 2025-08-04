<script setup>
import { useHead } from "@vueuse/head";
import MasterBarangView from "../../components/master-barang/MasterBarangView.vue";

useHead({
  title: "Halaman Master Barang - SIMATIK",
  meta: [
    {
      name: "description",
      content: "Halaman untuk mengelola data barang aset TIK. Anda dapat menambah, mengubah, dan menghapus data aset melalui sistem SIMATIK.",
    },
    {
      name: "keywords",
      content: "aset TIK, master barang, data aset, SIMATIK, inventaris, crud barang",
    },
    {
      name: "author",
      content: "Practice My Full-Stack Skill",
    },
    {
      property: "og:title",
      content: "Master Barang Aset TIK - SIMATIK",
    },
    {
      property: "og:description",
      content: "Kelola data barang aset TIK dengan mudah melalui halaman master barang SIMATIK.",
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
    <MasterBarangView />
</template>
