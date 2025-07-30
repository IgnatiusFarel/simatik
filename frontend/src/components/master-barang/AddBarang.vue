<template>
  <FormData 
    v-model="showForm" 
    title="Tambah Barang" 
    @ok="saveData"
  >
    <template #form>
      <a-form layout="vertical">
        <a-form-item label="Nama Barang">
          <a-input v-model:value="form.nama" placeholder="Masukkan nama barang" />
        </a-form-item>
        <a-form-item label="Kategori">
          <a-input v-model:value="form.kategori" placeholder="Masukkan kategori" />
        </a-form-item>
        <a-form-item label="Harga">
          <a-input v-model:value="form.harga" placeholder="Masukkan harga" />
        </a-form-item>
      </a-form>
    </template>
  </FormData>
</template>

<script setup>
import { ref, defineExpose } from "vue";
// import axios from "axios";
import FormData from "@/components/FormData.vue";

const showForm = ref(false);
const form = ref({ nama: "", kategori: "", harga: "" });

// const saveData = async () => {
//   try {
//     await axios.post("/api/barang", form.value);
//     showForm.value = false;
//     console.log("Barang tersimpan:", form.value);
//   } catch (err) {
//     console.error(err);
//   }
// };

// supaya bisa dipanggil dari parent
defineExpose({ open: () => (showForm.value = true) });
</script>
