<template>
   <CustomTable :columns="columns" :data="data">
    <template #header-filter>
      <a-range-picker v-model:value="value1" />
    </template>
    <template #header-action>
      <a-button
        class="flex items-center gap-2 bg-[#d30007] text-white px-3 py-1 rounded-[8px] font-semibold"
      >
        <Plus class="w-4 h-4" /> Print PDF</a-button
      >
    </template>  
    </CustomTable>
   
</template>

<script setup>
import CustomTable from '../CustomTable.vue';
import { Plus } from "lucide-vue-next";

const data = [
  {
    key: "1",
    seri: "#20462",
    barang: "Hat",
    tahun_pengadaan: 2014,
    pemeliharaan: "13/05/2022",
    harga_barang: "Rp.13.000.00",
    kategori: "Komputer",
    status: "Baik",
  },
  {
    key: "1",
    seri: "#20462",
    barang: "Hat",
    tahun_pengadaan: 2014,
    pemeliharaan: "13/05/2022",
    harga_barang: "Rp.13.000.00",
    kategori: "Komputer",
    status: "Baik",
  },
  {
    key: "1",
    seri: "#20462",
    barang: "Hat",
    tahun_pengadaan: 2014,
    pemeliharaan: "13/05/2022",
    harga_barang: "Rp.13.000.00",
    kategori: "Komputer",
    status: "Baik",
  },  
]

const columns = [
  { title: "No. Seri", dataIndex: "seri" },
  { title: "Barang", dataIndex: "barang" },
  { title: "Tahun Pengadaan", dataIndex: "tahun_pengadaan" },
  { title: "Pemeliharaan", dataIndex: "pemeliharaan" },
  { title: "Harga Barang", dataIndex: "harga_barang" },
  { title: "Kategori", dataIndex: "kategori" },
  { title: "Status", dataIndex: "status" },  
]
</script>

<style>
</style>