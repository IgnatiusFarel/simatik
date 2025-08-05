<template>
  <CustomTable :columns="columns" :data="dataTable" :search="search"  rowKey="master_user_id">
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
        class="flex items-center gap-2 bg-[#d30007] text-white px-3 py-1 rounded-[8px] font-semibold" @click="openAddUser"
      >
        <Plus class="w-4 h-4" /> Add User</a-button
      >
    </template>
  </CustomTable>  
  <AddUser ref="addUserRef" />
  <EditUser ref="editUserRef" />
</template>

<script setup>
import { h, ref, onMounted } from "vue";
import { Tag } from "ant-design-vue";
import AddUser from "./AddUser.vue";
import CustomTable from "../CustomTable.vue";
import { SquarePen, Trash2, Plus, Search } from "lucide-vue-next";
import EditUser from "./EditUser.vue";
import Api from "@/services/Api.js"

const dataTable = ref([]); 
const loading = ref(false)
const addUserRef = ref(null); 
const editUserRef = ref(null); 

const openAddUser = () => {
  addUserRef.value.openModal();
}

const openEditUser = () => {
  editUserRef.value.openModal();
}

const columns = [
  { title: "Id", dataIndex: ["user", "id"], width: 150 },
  { title: "Nama", dataIndex: "nama", width: 200 },
  { title: "Username", dataIndex: ["user", "username"], width: 180 },
  { title: "Email", dataIndex: ["user", "email"], width: 250 },
  { title: "SKPD", dataIndex: "skpd", width: 250 },
  { title: "Role", dataIndex: ["user", "role"], width: 150 },
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
            onClick: () => console.log("Delete", record),
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

const fetchData = async () => {
  loading.value =  true; 
  try {
    const response = await Api.get('/master-user');
    dataTable.value = response.data.data.data;   
  } catch (error) {
    console.error(error);
  } finally{
    loading.value =  false;
  }
}

onMounted(() => {
  fetchData();
})
</script>

<style></style>
