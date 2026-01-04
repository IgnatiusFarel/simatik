<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
    <AssetCard
      v-for="(card, index) in cards"
      :key="index"
      :total="card.total"
      :title="card.title"
      :subTitle="card.subTitle"
      :subtitleDesc="card.subtitleDesc"
      :percentage="card.percentage"
      :isCollapsed="isSidebarCollapsed"
    />    
  </div>

  <CustomTable :columns="columns" :data="dataTable"     :loading="loading"
    :currentPage="currentPage"
    :pageSize="pageSize"
    :totalItems="totalItems"
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange"
  >
    <template #header-action>
      <span class="text-sm">⏱ Recent History</span>
    </template>
  </CustomTable>
</template>

<script setup>
import { h, onMounted, ref } from "vue";
import { Tag, Image } from "ant-design-vue";
import AssetCard from "./AssetCard.vue";
import CustomTable from "../CustomTable.vue";
import Api from "@/services/Api.js";
import dayjs from "dayjs";

const isSidebarCollapsed = false;
const loading = ref(false);
const dataTable = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const APP_URL = import.meta.env.VITE_APP_URL;

const cards = ref([
  {
    title: "Aset Baik",
    subTitle: "Aset TIK",
    subtitleDesc: "Kondisi Baik",
    total: 0,
    percentage: "0%",
  },
  {
    title: "Aset Pemeliharaan",
    subTitle: "Aset TIK",
    subtitleDesc: "Kondisi Pemeliharaan",
    total: 0,
    percentage: "0%",
  },
  {
    title: "Aset Rusak",
    subTitle: "Aset TIK",
    subtitleDesc: "Kondisi Rusak",
    total: 0,
    percentage: "0%",
  },
]);

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
          class: "rounded shadow-sm object-cover border",        
          fallback: "https://placehold.co/60x60?text=404",
          preview: { src: imgSrc },
        }),
        h("span", record.barang),
      ]);
    },
  },
  {
    title: "Tanggal Pengadaan",
    dataIndex: "pengadaan",
    customRender: ({ text }) => (text ? dayjs(text).format("DD/MM/YY") : "-"),
  },
  {
    title: "Tanggal Pemeliharaan",
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

const fetchData = async (page = currentPage.value, size = pageSize.value) => {
  loading.value = true;
  try {
    currentPage.value = page;
    pageSize.value = size;

    const response = await Api.get("/dashboard", {
      params: {
        page_size: size,
        page: page,         
      },
    });

    const apiData = response.data.data;
    dataTable.value = apiData.data;
    totalItems.value = apiData.total;
    currentPage.value = apiData.current_page;
  } catch (error) {
    message.destroy();
    message.error(error.message || "Gagal mengambil data");
  } finally {
    loading.value = false;
  }
};

const fetchDataAsset = async () => {
  try {
    const response = await Api.get("dashboard/asset");
    const data = response.data.data;

    cards.value[0].total = data.baik.jumlah;
    cards.value[0].percentage = `${data.baik.persen}%`;

    cards.value[1].total = data.pemeliharaan.jumlah;
    cards.value[1].percentage = `${data.pemeliharaan.persen}%`;

    cards.value[2].total = data.rusak.jumlah;
    cards.value[2].percentage = `${data.rusak.persen}%`;
  } catch (error) {
    console.error(error);
  }
};

const handlePageChange = (page) => {
  fetchData(page, pageSize.value);
};

const handlePageSizeChange = (size) => {
  fetchData(1, size);
};

onMounted(() => {
  fetchData();
  fetchDataAsset();
});
</script>

<style></style>
