<template>
  <a-modal
    v-model:open="isOpen"
    @cancel="handleCancel"
    :footer="null"
    style="top: 20px; bottom: 20px"
    class="max-w-md"
  >
    <template #title>
      <h2 class="text-center w-full text-lg font-semibold">Edit Barang</h2>
    </template>
    <a-form layout="vertical" ref="formRef" hideRequiredMark>
      <a-form-item label="Nomor Seri Barang" :rules="rules.seri">
        <a-input v-model:value="form.seri" placeholder="Masukkan Nomor Seri" />
      </a-form-item>

      <a-form-item label="Gambar Barang" :rules="rules.gambar">
        <div class="clearfix">
          <a-upload
            v-model:file-list="fileList"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            @preview="handlePreview"
          >
            <!-- <div v-if="fileList.length < 8"> -->
            <div class="flex-col">
              <Plus />
              <p>Upload</p>
            </div>
            <!-- </div> -->
          </a-upload>
          <a-modal
            :open="previewVisible"
            :title="previewTitle"
            :footer="null"
            @cancel="handleExitPreview"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-form-item>
      <a-form-item label="Nama Barang" :rules="rules.barang">
        <a-input
          v-model:value="form.barang"
          placeholder="Masukkan Nama Barang"
        />
      </a-form-item>
      <a-form-item label="Tahun Pengadaan Barang" :rules="rules.pengadaan">
        <a-input
          v-model:value="form.pengadaan"
          placeholder="Masukkan Tahun Pengadaan Barang"
        />
      </a-form-item>
      <a-form-item label="Tahun Pemeliharaan Barang" :rules="rules.pemeliharaan">
        <a-input
          v-model:value="form.pemeliharaan"
          placeholder="Masukkan Tahun Pemeliharaan Barang"
        />
      </a-form-item>
      <a-form-item label="Harga Barang" :rules="rules.harga">
        <a-input
          v-model:value="form.harga"
          placeholder="Masukkan Harga Barang"
        />
      </a-form-item>
      <a-form-item label="Kategori Barang" :rules="rules.kategori">
        <a-input
          v-model:value="form.kategori"
          placeholder="Masukkan Kategori Barang"
        />
      </a-form-item>
      <a-form-item label="Status Barang" :rules="rules.status">
        <a-select
          v-model:value="form.status"
          :options="statusOptions"
          placeholder="Pilih Status Barang"
        />
      </a-form-item>
      <div class="flex justify-center gap-2">
        <a-button @click="handleCancel">Batal</a-button>
        <a-button type="primary" @click="handleSave" class="font-semibold">
          Simpan</a-button
        >
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { Plus } from "lucide-vue-next";

const isOpen = ref(false);
const formRef = ref(null);
const loading = ref(false);

const rules = {
  seri: [{ required: true, message: "Nomor seri wajib diisi!" }],
  barang: [{ required: true, message: "Nama barang wajib diisi!" }],
  pengadaan: [{ required: true, message: "Tanggal pengadaan wajib diisi!" }],
  pemeliharaan: [
    { required: true, message: "Tanggal pemeliharaan wajib diisi!" },
  ],
  harga: [{ required: true, message: "Harga barang wajib diisi!" }],
  kategori: [{ required: true, message: "Kategori barang wajib diisi!" }],
  status: [{ required: true, message: "Status barang wajib diisi!" }],
};

const form = ref({
  seri: "",
  barang: "",
  pengadaan: "",
  pemeliharaan: "",
  harga: "",
  kategori: null,
  status: null,
});

const statusOptions = [
  { value: "Baik", label: "Baik" },
  { value: "Pemeliharaan", label: "Pemeliharaan" },
  { value: "Rusak", label: "Rusak" },
];

const openModal = () => {
  isOpen.value = true;
};
const handleCancel = () => {
  isOpen.value = false;
};
const handleSave = () => {
  isOpen.value = false;
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");

const handleExitPreview = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

defineExpose({
  openModal,
});
</script>

<style scoped></style>
