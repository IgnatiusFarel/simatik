<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
    <AssetCard
      total="1.234"
      title="Semua Aset"
      subTitle="Aset TIK"
      subtitleDesc="Semua Aset"
      percentage="100%"    
      :isCollapsed="isSidebarCollapsed"
    />
    <AssetCard
      total="534"
      title="Aset Digunakan"
      subTitle="Aset TIK"
      subtitleDesc="Digunakan"
      percentage="43%"      
      :isCollapsed="isSidebarCollapsed"
    />
    <AssetCard
      total="700"
      title="Aset Cadangan"
      subTitle="Aset TIK"
      subtitleDesc="Cadangan"
      percentage="57%"      
      :isCollapsed="isSidebarCollapsed"
    />
  </div>
  <CustomTable :columns="columns" :data="data"  />
</template>

<script setup>
import AssetCard from './AssetCard.vue'
import CustomTable from '../CustomTable.vue'
import { h } from "vue"
import { SquarePen, Trash2 } from "lucide-vue-next"

const isSidebarCollapsed = false

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
  // Tambahkan data lainnya...
]

const columns = [
  { title: "No. Seri", dataIndex: "seri" },
  { title: "Barang", dataIndex: "barang" },
  { title: "Tahun Pengadaan", dataIndex: "tahun_pengadaan" },
  { title: "Pemeliharaan", dataIndex: "pemeliharaan" },
  { title: "Harga Barang", dataIndex: "harga_barang" },
  { title: "Kategori", dataIndex: "kategori" },
  { title: "Status", dataIndex: "status" },
  {
    title: "Action",
    key: "action",
    customRender: ({ record }) =>
      h("div", { class: "flex space-x-2" }, [
        h(
          "button",
          {
            class: "text-blue-500 hover:text-blue-700",
            onClick: () => console.log("Edit", record),
          },
          [h(SquarePen, { size: 18 })]
        ),
        h(
          "button",
          {
            class: "text-red-500 hover:text-red-700",
            onClick: () => console.log("Delete", record),
          },
          [h(Trash2, { size: 18 })]
        ),
      ]),
  },
]
</script>


<style>

</style>