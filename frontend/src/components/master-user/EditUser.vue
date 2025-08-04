<template>
  <a-modal
    v-model:open="isOpen"    
    @cancel="handleCancel"
    :footer="null" 
    style="top: 20px; bottom: 20px"    
    class="max-w-md"
  >
    <template #title>
    <h2 class="text-center w-full text-lg font-semibold">Edit User</h2>
  </template>
    <a-form layout="vertical" ref="formRef" hideRequiredMark>
      <a-form-item label="Nomor ID Pengguna" :rules="rules.id">
        <a-input v-model:value="form.id" placeholder="Masukkan Nomor ID Pengguna" />
      </a-form-item>
      <a-form-item label="Foto Pengguna" :rules="rules.foto">
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
      <a-form-item label="Nama Pengguna" :rules="rules.nama">
        <a-input v-model:value="form.nama" placeholder="Masukkan Nama Pengguna" />
      </a-form-item>
      <a-form-item label="Email Pengguna" :rules="rules.email">
        <a-input v-model:value="form.email" placeholder="Masukkan Email Pengguna" />
      </a-form-item>
      <a-form-item label="SKPD Pengguna" :rules="rules.skpd">
        <a-input v-model:value="form.skpd" placeholder="Masukkan SKPD Pengguna" />
      </a-form-item>
      <a-form-item label="Role Pengguna" :rules="rules.role">
        <a-input v-model:value="form.role" placeholder="Masukkan Role Pengguna" />
      </a-form-item>      
      <a-form-item label="Status Pengguna" :rules="rules.status">
        <a-select v-model:value="form.status" :options="statusOptions" placeholder="Pilih Status Pengguna" />
      </a-form-item>
      <div class="flex justify-center gap-2">
        <a-button @click="handleCancel">Batal</a-button>
        <a-button type="primary" @click="handleSave" class="font-semibold"> Simpan</a-button>
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
  id: [{ required: true, message: "Nomor id wajib diisi!" }],
  nama: [{ required: true, message: "Nama wajib diisi!" }],
  username: [{ required: true, message: "Username wajib diisi!" }],
  email: [{ required: true, message: "Email wajib diisi!" }],
  skpd: [{ required: true, message: "SKPD wajib diisi!" }],
  role: [{ required: true, message: "Role barang wajib diisi!" }],
  status: [{ required: true, message: "Status barang wajib diisi!" }],
};

const form = ref({
  id: "",
  nama: "",
  username: "",
  email: "",
  SKPD: "",
  role: "",
  status: null,
});

const statusOptions = [ 
  { value: "Aktif", label: "Aktif"},
  { value: "Suspend", label: "Suspend"},
  { value: "Tidak Aktif", label: "Tidak Aktif"},  
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
  openModal
});
</script>

<style scoped>

</style>
