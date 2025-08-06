<template>
  <CustomTable :columns="columns" :data="dataTable">
    <template #header-filter>
      <a-input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="rounded-[8px] pl-3 pr-3 py-1 text-sm w-60 h-[34px] border-[#9E9E9E]"
        allow-clear
      >
        <template #prefix>
          <Search class="w-4 h-4 text-[#9e9e9e]" />
        </template>
      </a-input>
    </template>
    <template #header-action>
      <a-button
        type="primary"
        class="flex items-center gap-2 text-white px-3 py-1 rounded-[8px] font-semibold"
        @click="openAddBarang"
      >
        <Plus class="w-4 h-4" /> Add Barang</a-button
      >
    </template>
  </CustomTable>
  <AddBarang ref="addBarangRef" @saved="fetchData" />
  <EditBarang ref="editBarangRef" />
</template>

<script setup>
import { h, ref, onMounted } from "vue";
import { Tag, Image } from "ant-design-vue";
import AddBarang from "./AddBarang.vue";
import CustomTable from "../CustomTable.vue";
import { SquarePen, Search, Trash2, Plus } from "lucide-vue-next";
import Api from "@/services/Api.js";
import dayjs from "dayjs";

const addBarangRef = ref(null);
const editBarangRef = ref(null);
const dataTable = ref([]);
const loading = ref(false);
const APP_URL = import.meta.env.VITE_APP_URL;

const openAddBarang = () => {
  addBarangRef.value.openModal();
};

const openEditBarang = () => {
  editBarangRef.value.openModal();
};

const columns = [
  { title: "No. Seri", dataIndex: "seri" },
  {
    title: "Barang",
    dataIndex: "barang",
    customRender: ({ record }) => {
      const imgSrc = record.gambar.startsWith("uploads/")
        ? `${APP_URL}/${record.gambar}` 
        : `${APP_URL}/storage/${record.gambar}`;

      return h("div", { class: "flex items-center gap-2" }, [
        h(Image, {
          src: imgSrc,
          width: 80,
          height: 80,
          style: { borderRadius: "4px", objectFit: "cover" },
          fallback:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAAB...",
          preview: { src: imgSrc },
        }),
        h("span", record.barang),
      ]);
    },
  },
  {
    title: "Tahun Pengadaan",
    dataIndex: "pengadaan",
    customRender: ({ text }) => (text ? dayjs(text).format("DD/MM/YY") : "-"),
  },
  {
    title: "Pemeliharaan",
    dataIndex: "pemeliharaan",
    customRender: ({ text }) => (text ? dayjs(text).format("DD/MM/YY") : "-"),
  },
  {
    title: "Harga Barang",
    dataIndex: "harga",
    customRender: ({ text }) =>
      text
        ? new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(text)
        : "-",
  },
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
            onClick: () => openEditBarang(record),
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

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await Api.get("/master-barang");
    dataTable.value = response.data.data.data;
  } catch (error) {
    message.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style></style>
