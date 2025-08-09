<template>
   <CustomTable :columns="columns" :data="dataTable" :loading="loading"
    :currentPage="currentPage"
    :pageSize="pageSize"
    :totalItems="totalItems"
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange">
    <template #header-filter>
      <a-range-picker v-model:value="selectedDateRange" class="h-[34px] rounded-[8px] border-[#9E9E9E]" />
    </template>
    <template #header-action>
      <a-button
        class="transition-transform transform active:scale-95 flex items-center gap-2 bg-[#d30007] text-white px-3 py-1 rounded-[8px] font-semibold"
        @click="handlePrint"
         :loading="loading"
         :disabled="loading"
      >
        <Plus class="w-4 h-4" /> Print PDF</a-button
      >
    </template>  
    </CustomTable>
</template>

<script setup>
import { h, ref, onMounted, watch } from "vue";
import { Tag, Image, message } from "ant-design-vue";
import { Plus } from "lucide-vue-next";
import CustomTable from '../CustomTable.vue';
import Api from "@/services/Api.js"; 
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; 

dayjs.extend(isBetween);

const loading = ref(false); 
const dataTable = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const selectedDateRange = ref(null);

const APP_URL = import.meta.env.VITE_APP_URL;

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
]

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

    let params = {
      page_size: size,
      page: page,
    };

    if (Array.isArray(selectedDateRange.value) && selectedDateRange.value.length === 2) {
      params.from = dayjs(selectedDateRange.value[0]).format("YYYY-MM-DD");
      params.to = dayjs(selectedDateRange.value[1]).format("YYYY-MM-DD");
    }

    const response = await Api.get("/report-barang", { params });

    const apiData = response.data.data;
    dataTable.value = apiData.data;
    totalItems.value = apiData.total;
    currentPage.value = apiData.current_page;
  } catch (error) {
    message.error(error.message || "Gagal mengambil data");
  } finally {
    loading.value = false;
  }
};

const handlePrint = async () => {
  if (!Array.isArray(selectedDateRange.value) || selectedDateRange.value.length < 2) {
    message.warning("Pilih rentang tanggal yang mau di print terlebih dahulu!");
    return;
  }

  if (filteredDataByDate.value.length === 0) {
    message.warning("Tidak ada data barang di tanggal tersebut!");
    return;
  }

  const [start, end] = selectedDateRange.value;
  loading.value = true;

  try {
    const response = await Api.get("/report-barang/print", {
      params: {
        from: dayjs(start).format("YYYY-MM-DD"),
        to: dayjs(end).format("YYYY-MM-DD"),
      },
      responseType: "blob",
    });
    
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
      const text = await response.data.text();
      const json = JSON.parse(text);
      message.warning(json.message || "Terjadi kesalahan.");
      return;
    }
    
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");

  } catch (e) {
    message.error("Print PDF data barang gagal dicetak!");
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page) => {
  fetchData(page, pageSize.value);
};

const handlePageSizeChange = (size) => {
  fetchData(1, size);
};

watch(selectedDateRange, () => {
  fetchData(1, pageSize.value);
});

onMounted(() => {
  fetchData();
})
</script>

<style>
</style>