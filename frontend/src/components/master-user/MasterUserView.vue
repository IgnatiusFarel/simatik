<template>
    <CustomTable
    :columns="columns"
    :data="dataTable"
    :loading="loading"
    :currentPage="currentPage"
    :pageSize="pageSize"
    :totalItems="totalItems"
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange"
  >
    <template #header-filter>
      <a-input
        v-model:value="search"
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
        class="transition-transform transform active:scale-95 flex items-center gap-2 bg-[#d30007] text-white px-3 py-1 rounded-[8px] font-semibold"
        @click="openAddUser"
      >
        <Plus class="w-4 h-4" /> Add User</a-button
      >
    </template>
  </CustomTable>
   <AddUser ref="addUserRef" @saved="fetchData" />
  <EditUser ref="editUserRef" @saved="fetchData "/>
</template>

<script setup>
import { h, ref, onMounted, createVNode, watch } from "vue";
import { Tag, Image, Modal, message } from "ant-design-vue";
import AddUser from "./AddUser.vue";
import EditUser from "./EditUser.vue";
import CustomTable from "../CustomTable.vue";
import { SquarePen, Trash2, Plus, Search, OctagonAlert, Edit } from "lucide-vue-next";
import Api from "@/services/Api.js";

const addUserRef = ref(null);
const editUserRef = ref(null);
const loading = ref(false);
const search = ref("");
const dataTable = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const APP_URL = import.meta.env.VITE_APP_URL;

const openAddUser = () => {
  addUserRef.value.openModal();
};

const openEditUser = (record) => {
  editUserRef.value.openModal(record);
};

const columns = [
  { title: "Id", dataIndex: "id", width: 150 },
  {
    title: "Nama",
    dataIndex: "nama",
    customRender: ({ record }) => {
      const imgSrc = record.foto.startsWith("uploads/")
        ? `${APP_URL}/${record.foto}`
        : `${APP_URL}/storage/${record.foto}`;

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
        h("span", record.nama),
      ]);
    },
  },
  { title: "Username", dataIndex: ["user", "username"], width: 180 },
  { title: "Email", dataIndex: ["user", "email"], width: 250 },
  { title: "SKPD", dataIndex: "skpd", width: 250 },
  { title: "Role", dataIndex: ["user", "role"], width: 150 },
  {
    title: "Status",
    dataIndex: "status",
    width: 120,
    customRender: ({ record }) =>
      h(Tag, { color: getStatusTagColor(record.status) }, () => record.status),
  },
  {
    title: "Action",
    key: "action",
    width: 120,
    customRender: ({ record }) =>
      h("div", { class: "flex space-x-2" }, [
        h(
          "button",
          {
            class: "text-blue-500 hover:text-blue-700",
            onClick: () => openEditUser(record),
          },
          [h(SquarePen, { size: 18 })]
        ),
        h(
          "button",
          {
            class: "text-red-500 hover:text-red-700",
            onClick: () => handleDelete(record),
          },
          [h(Trash2, { size: 18 })]
        ),
      ]),
  },
];

const getStatusTagColor = (status) => {
  switch (status) {
    case "Aktif":
      return "green";
    case "Suspend":
      return "orange";
    case "Tidak Aktif":
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

    const response = await Api.get("/master-user", {
      params: {
        page_size: size,
        page: page,
        search: search.value.trim() || undefined, 
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

function handleDelete(record) {
  Modal.confirm({
    centered: true,
    closable: true,
    title: createVNode("div", { class: "flex items-center gap-2" }, [
      h(OctagonAlert, { size: 24, class: "text-red-500" }),
      h(
        "span",
        {},
        `Apakah Anda yakin ingin menghapus data user '${record.nama}'?`
      ),
    ]),
    icon: null,
    content: null, 
    okText: createVNode("span", { class: "font-semibold" }, "Ya, Hapus"),
    okType: "primary",
    cancelText: "Batal",
    async onOk() {
      try {
        const response = await Api.delete(
          `/master-user/${record.master_users_id}`
        );
        if (response.data.status) {
          message.destroy();
          message.success(response.data.message);
          fetchData();
        } else {
          message.destroy();
          message.error(response.data.message || "Gagal menghapus data");
        }
      } catch (error) {
        message.destroy();
        message.error("Terjadi kesalahan saat menghapus");        
      }
    },
  });
}

const handlePageChange = (page) => {
  fetchData(page, pageSize.value);
};

const handlePageSizeChange = (size) => {
  fetchData(1, size);
};

watch(search, (newVal, oldVal) => {  
  fetchData(1, pageSize.value);
});

onMounted(() => {
  fetchData();
});
</script>

<style></style>
