<script setup>
import { useHead } from "@vueuse/head";
import MasterBarangView from "../../components/master-barang/MasterBarangView.vue";

useHead({
  title: "Halaman Master Barang - SIMATIK",
  meta: [
    {
      name: "description",
      content: "Sistem Informasi Manajemen Aset TIK",
    },
  ],
});
</script>

<template>  
    <MasterBarangView />
</template>
