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
    <a-form layout="vertical" ref="formRef" :model="formData" :rules="rules" @finish="handleSave">
      <a-form-item label="Nomor ID Pengguna" name="id">
        <a-input
          v-model:value="formData.id"
          placeholder="Masukkan Nomor ID Pengguna"
          ><template #prefix>#</template></a-input
        >
      </a-form-item>
      <a-form-item label="Foto Pengguna" name="foto">
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
            <img alt="Foto Pengguna" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-form-item>
      <a-form-item label="Nama Pengguna" name="nama">
        <a-input
          v-model:value="formData.nama"
          placeholder="Masukkan Nama Pengguna"
        />
      </a-form-item>
      <a-form-item label="Username Pengguna" name="username">
        <a-input
          v-model:value="formData.username"
          placeholder="Masukkan Username Pengguna"
        />
      </a-form-item>
      <a-form-item label="Email Pengguna" name="email">
        <a-input
          v-model:value="formData.email"
          placeholder="Masukkan Email Pengguna"
        />
      </a-form-item>
      <a-form-item label="Password Pengguna" name="password">
        <a-input-password
          v-model:value="formData.password"
          placeholder="Masukkan Password Pengguna"
        />
      </a-form-item>
      <a-form-item label="SKPD Pengguna" name="skpd">
        <a-input
          v-model:value="formData.skpd"
          placeholder="Masukkan SKPD Pengguna"
        />
      </a-form-item>
      <a-form-item label="Role Pengguna" name="role">
        <a-input
          v-model:value="formData.role"
          placeholder="Masukkan Role Pengguna"
        />
      </a-form-item>
      <a-form-item label="Status Pengguna" name="status">
        <a-select
          v-model:value="formData.status"
          :options="statusOptions"
          placeholder="Pilih Status Pengguna"
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
import { ref, defineExpose, watch } from "vue";
import { Plus } from "lucide-vue-next";
import Api from "@/services/Api.js";
import { message } from "ant-design-vue";

const isOpen = ref(false);
const formRef = ref(null);
const loading = ref(false);
const fileList = ref([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const emit = defineEmits(["saved"]);

const rules = {
  id: [{ required: true, message: "Nomor id pengguna wajib diisi!" }],
  foto: [{ required: true, message: "Foto pengguna wajib diisi!" }],
  nama: [{ required: true, message: "Nama pengguna wajib diisi!" }],
  username: [{ required: true, message: "Username pengguna wajib diisi!" }],
  email: [{ required: true, message: "Email pengguna wajib diisi!" }, 
    { type: "email", message: "Format email tidak valid!"}
  ],
  skpd: [{ required: true, message: "SKPD pengguna wajib diisi!" }],
  role: [{ required: true, message: "Role pengguna wajib diisi!" }],
  status: [{ required: true, message: "Status pengguna wajib diisi!" }],
};

const formData = ref({
  id: "",
  foto: null,
  nama: "",
  username: "",
  email: "",
  password: "",
  skpd: "",
  role: "",
  status: null,
});

const statusOptions = [
  { value: "Aktif", label: "Aktif" },
  { value: "Suspend", label: "Suspend" },
  { value: "Tidak Aktif", label: "Tidak Aktif" },
];

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function beforeUpload(file) {
  const isAllowedType = ["image/jpeg", "image/jpg", "image/png"].includes(
    file.type
  );
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
  formData.value.foto = file;

  return false;
}

const handlePreview = async (file) => {
  previewImage.value =
    file.thumbUrl ||
    (file.url ? file.url : await getBase64(file.originFileObj));
  previewVisible.value = true;
  previewTitle.value = file.name || "Preview";
};

const handleExitPreview = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

function handleRemove() {
  fileList.value = [];
}

const openModal = (record) => {
  isOpen.value = true;

  formData.value = {
    master_user_id: record.master_user_id || "",
    id: record.id?.replace(/^#/, "") || "",
    foto: record.foto || null,         
    nama: record.nama || "",
    username: record.user.username || "",
    email: record.user.email || "",
    password: "",        
    skpd: record.skpd || "",
    role: record.user.role || "",
    status: record.status || null,
  };
  
 if (record.foto) {
    const imageUrl = record.foto.startsWith("uploads/")
      ? `${import.meta.env.VITE_APP_URL}/${record.foto}`
      : `${import.meta.env.VITE_APP_URL}/storage/${record.foto}`;

      fileList.value = [{
      uid: '-1',
      name: 'foto.jpg',
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
    // await formRef.value.validate()
    loading.value = true;

    const fd = new FormData();
    fd.append('id', `#${formData.value.id || ''}`);    
    fd.append('nama', formData.value.nama || '');
    fd.append('username', formData.value.username || '');    
    fd.append('email', formData.value.email || '');    
    fd.append('password', formData.value.password || '');            
    fd.append('skpd', formData.value.skpd || '');                
    fd.append('role', formData.value.role || '');                
    fd.append('status', formData.value.status || '');                        

    if (fileList.value.length) {
      fd.append("foto", fileList.value[0].originFileObj);
    }

    await Api.post(`/master-user/${formData.value.master_user_id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    message.success("Data user berhasil ditambahkan!");
    isOpen.value = false;
    emit("saved");
  } catch (error) {
    console.error(error);
    message.error("Data user gagal ditambahkan!");
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

:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 400px !important;
  height: 130px !important;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {  
  height: 180px !important;
}
</style>
