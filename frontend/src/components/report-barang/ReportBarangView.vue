<template>
   <CustomTable :columns="columns" :data="dataTable">
    <template #header-filter>
      <a-range-picker v-model:value="value1" class="h-[34px]" />
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
import { h, onMounted, ref } from "vue";
import { Tag } from "ant-design-vue";
import { Plus } from "lucide-vue-next";
import CustomTable from '../CustomTable.vue';
import Api from "@/services/Api.js"; 

const loading = ref(false); 
const dataTable = ref([]);

const columns = [
  { title: "No. Seri", dataIndex: "seri" },
  { title: "Barang", dataIndex: "barang" },
  { title: "Tahun Pengadaan", dataIndex: "pengadaan" },
  { title: "Pemeliharaan", dataIndex: "pemeliharaan" },
  { title: "Harga Barang", dataIndex: "harga" },
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

const fetchData = async () => {
  loading.value=true;
  try {
    const response = await Api.get('/master-barang');
    dataTable.value= response.data.data.data; 
  } catch (error) {
    message.error(error)
  } finally {
    loading.value=false;
  }
}

onMounted(() => {
  fetchData();
})
</script>

<style>
</style>