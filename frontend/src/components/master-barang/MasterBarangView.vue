<template>
  <CustomTable :columns="columns" :data="data">
    <template #header-filter>
      <a-input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="rounded-[8px] pl-3 pr-3 py-1 text-sm w-60 border-[#9E9E9E]"
        allow-clear
      >
        <template #prefix>
          <Search class="w-4 h-4 text-[#9e9e9e]" />
        </template>
      </a-input>
    </template>
    <template #header-action>
      <a-button
        class="flex items-center gap-2 bg-[#d30007] text-white px-3 py-1 rounded-[8px] font-semibold"  @click="openAddBarang"
      >
        <Plus class="w-4 h-4" /> Add Barang</a-button
      >
      <AddBarang ref="addBarangRef" />
    </template>
  </CustomTable>
</template>

<script setup>
import CustomTable from "../CustomTable.vue";
import AddBarang from "./AddBarang.vue";
import { h, ref} from "vue";
import { SquarePen, Search, Trash2, Plus, } from "lucide-vue-next";
import { Tag } from "ant-design-vue";

const addBarangRef = ref(null);


const openAddBarang = () => {
  addBarangRef.value?.open(); // memanggil method open() dari AddBarang
};

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
];

const columns = [
  { title: "No. Seri", dataIndex: "seri" },
  { title: "Barang", dataIndex: "barang" },
  { title: "Tahun Pengadaan", dataIndex: "tahun_pengadaan" },
  { title: "Pemeliharaan", dataIndex: "pemeliharaan" },
  { title: "Harga Barang", dataIndex: "harga_barang" },
  { title: "Kategori", dataIndex: "kategori" },
  {
    title: "Status",
    dataIndex: "status",
    customRender: ({ record }) =>
      h(Tag, { color: getStatusTagColor(record.status) }, () => record.status),
  },
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
];

const getStatusTagColor = (status) => {
  switch (status) {
    case "Baik":
      return "green";
    case "Pemeliharaan":
      return "orange";
    case "Rusak":
      return "red";
    default:
      return "default";
  }
};
</script>

<style></style>
