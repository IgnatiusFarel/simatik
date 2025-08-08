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
    <a-form layout="vertical" ref="formRef"  :model="formData" :rules="rules" @finish="handleSave">
      <a-form-item label="Nomor Seri Barang" name="seri">
        <a-input v-model:value="formData.seri" placeholder="Masukkan Nomor Seri Barang"> <template #prefix>#</template></a-input>
      </a-form-item>
      <a-form-item label="Gambar Barang" name="gambar">
        <div class="clearfix">
          <a-upload
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture-card"
            :max-count="1"
            @preview="handlePreview"
            @remove="handleRemove"
          >
            <template v-if="fileList.length === 0">
            <div class="flex flex-col items-center justify-center">
              <Plus />
              <p>Upload</p>
            </div>
            </template>
          </a-upload>
          <a-modal
            :open="previewVisible"
            :title="previewTitle"
            :footer="null"
            @cancel="handleExitPreview"
          >
            <img alt="Gambar Barang" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-form-item>
      <a-form-item label="Nama Barang" name="barang">
        <a-input
          v-model:value="formData.barang"
          placeholder="Masukkan Nama Barang"                    
        />
      </a-form-item>
      <a-form-item label="Tanggal Pengadaan Barang" name="pengadaan">
        <a-date-picker v-model:value="formData.pengadaan" :format="dateFormat" class="w-full" placeholder="Pilih Tanggal Pengadaan Barang" />
      </a-form-item>
      <a-form-item label="Tanggal Pemeliharaan Barang" name="pemeliharaan">
        <a-date-picker v-model:value="formData.pemeliharaan" :format="dateFormat" class="w-full" placeholder="Pilih Tanggal Pemeliharaan Barang" />
      </a-form-item>
      <a-form-item label="Harga Barang" name="harga">
        <a-input
          v-model:value="formData.harga"
          placeholder="Masukkan Harga Barang"          
          prefix="Rp"
            @keypress="onKeyPressNumber"
          @input="onHargaInput"
        />
      </a-form-item>
      <a-form-item label="Kategori Barang" name="kategori">
        <a-input
          v-model:value="formData.kategori"
          placeholder="Masukkan Kategori Barang"
        />
      </a-form-item>
      <a-form-item label="Status Barang" name="status">
        <a-select
          v-model:value="formData.status"
          :options="statusOptions"
          placeholder="Pilih Status Barang"
        />
      </a-form-item>
      <div class="flex justify-center gap-2">
        <a-button @click="handleCancel">Batal</a-button>
       <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="loading"
          class="transition-transform transform active:scale-95 border-none font-semibold"
        >
          <span v-if="loading">Memperbarui...</span>
          <span v-else>Perbarui</span>
        </a-button>        
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, defineExpose, watch, nextTick } from "vue";
import { Plus, Upload } from "lucide-vue-next";
import Api from "@/services/Api.js";
import { message } from 'ant-design-vue'
import dayjs from "dayjs";

const isOpen = ref(false);
const formRef = ref(null);
const loading = ref(false);
const fileList = ref([]);
const dateFormat = 'DD/MM/YYYY';
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const emit = defineEmits(['saved']); 

const rules = {
  seri: [{ required: true, message: "Nomor seri barang wajib diisi!" }],
  gambar: [{ required: true, message: "Gambar barang wajib diisi!" }],
  barang: [{ required: true, message: "Nama barang wajib diisi!" }],
  pengadaan: [{ required: true, message: "Tanggal pengadaan barang wajib diisi!" }],  
  harga: [{ required: true, message: "Harga barang wajib diisi!" },  { pattern: /^[0-9]+$/, message: "Hanya boleh angka!" }],
  kategori: [{ required: true, message: "Kategori barang wajib diisi!" }],
  status: [{ required: true, message: "Status barang wajib diisi!" }],
};

const formData = ref({
  seri: "",
  gambar: null,
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

const onKeyPressNumber = (event) => {  
  const charCode = event.charCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
};

const onHargaInput = (e) => {
  let numeric = e.target.value.replace(/\D/g, "");
  if (numeric.length > 15) {
    numeric = numeric.slice(0, 15);
  }
  formData.value.harga = numeric;
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function beforeUpload(file) {
  const isAllowedType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
  if (!isAllowedType) {
    message.error("Format file harus JPG, JPEG dan PNG!");
    return Upload.LIST_IGNORE; 
  }
  const isLt5M = file.size / 1024 / 1024 < 5; 
  if (!isLt5M) {
    message.error("Ukuran file harus di bawah 5MB!");
    return Upload.LIST_IGNORE; 
  }

  file.thumbUrl = await getBase64(file);
  
  file.originFileObj = file;
  fileList.value = [file];
  formData.value.gambar = file;

  return false;
}

const handlePreview = async (file) => {
  previewImage.value = file.thumbUrl || (file.url ? file.url : await getBase64(file.originFileObj));
  previewVisible.value = true;
  previewTitle.value = file.name || 'Preview';
};

const handleExitPreview = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

function handleRemove() {
  fileList.value = []
}

const openModal = (record) => {
  isOpen.value = true;
  
  formData.value = {
    id: record.master_barang_id,
    seri: record.seri?.replace(/^#/, "") || "", 
    gambar: record.gambar || null,
    barang: record.barang || "",
    pengadaan: record.pengadaan ? dayjs(record.pengadaan, dateFormat) : null,
    pemeliharaan: record.pemeliharaan ? dayjs(record.pemeliharaan, dateFormat) : null,
    harga: record.harga ? parseInt(record.harga).toString() : "",
    kategori: record.kategori || "",
    status: record.status || "",
  };
  
  if (record.gambar) {
    const imageUrl = record.gambar.startsWith("uploads/")
      ? `${import.meta.env.VITE_APP_URL}/${record.gambar}`
      : `${import.meta.env.VITE_APP_URL}/storage/${record.gambar}`;

    fileList.value = [{
      uid: '-1',
      name: 'gambar.jpg',
      status: 'done',
      url: imageUrl,
      thumbUrl: imageUrl,
    }];
  } else {
    fileList.value = [];
  }  
};

const handleCancel = () => {
  isOpen.value = false
  formRef.value.resetFields()
  fileList.value = []
}

const handleSave = async () => {
  try {
    // await formRef.value.validate();
    loading.value = true;

    const fd = new FormData();
    fd.append('seri', `#${formData.value.seri || ''}`);
    fd.append('barang', formData.value.barang || '');
    fd.append('pengadaan', formData.value.pengadaan ? dayjs(formData.value.pengadaan).format('YYYY-MM-DD') : '');
    fd.append('pemeliharaan', formData.value.pemeliharaan ? dayjs(formData.value.pemeliharaan).format('YYYY-MM-DD') : '');
    fd.append('harga', formData.value.harga || '');
    fd.append('kategori', formData.value.kategori || '');
    fd.append('status', formData.value.status || '');
    
    if (fileList.value.length && fileList.value[0].originFileObj) {
      fd.append('gambar', fileList.value[0].originFileObj);
    }

    await Api.post(`/master-barang/${formData.value.id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    message.success('Data barang berhasil diperbarui!');
    isOpen.value = false;
    emit('saved');
  } catch (error) {
    console.error(error);
    message.error("Data barang gagal diperbarui!");
  } finally {
    loading.value = false;
  }
};

watch(isOpen, (open) => {
  if (!open) {
    formRef.value?.resetFields();
    fileList.value = [];
  }
});

defineExpose({
  openModal,
});
</script>

<style scoped>
:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 100% !important;  
}

:deep(.ant-upload-list-picture-card-container) {
  width: 100% !important;
}

:deep(.ant-upload-list-picture-card-container) {
  width: 100% !important;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 400px !important;
  height: 130px !important;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {  
  height: 180px !important;
}
</style>
