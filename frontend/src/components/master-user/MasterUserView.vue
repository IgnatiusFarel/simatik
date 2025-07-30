<template>
  <CustomTable :columns="columns" :data="data">
    <template #header-filter>
      <a-input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="rounded-[8px] pl-3 pr-3 py-1 text-sm w-60 border-[#9E9E9E]"
        allow-clear
      >
        <template #prefix>
          <Search class="w-4 h-4 text-[#9e9e9e]" />
        </template>
      </a-input>
    </template>
    <template #header-action>
      <a-button
        class="flex items-center gap-2 bg-[#d30007] text-white px-3 py-1 rounded-[8px] font-semibold"
      >
        <Plus class="w-4 h-4" /> Add User</a-button
      >
    </template>
  </CustomTable>
</template>

<script setup>
import CustomTable from "../CustomTable.vue";
import { h } from "vue";
import { SquarePen, Trash2, Plus, Search } from "lucide-vue-next";
import { Tag } from "ant-design-vue";

const data = [
  {
    id: 1,
    nama: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    skpd: "Dinas Pendidikan",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Jane Smith",
    username: "janesmith",
    email: "janesmith@example.com",
    skpd: "Dinas Kesehatan",
    role: "User",
    status: "Suspend",
  },
  {
    id: 3,
    nama: "Michael Johnson",
    username: "michaelj",
    email: "michaelj@example.com",
    skpd: "Dinas Perhubungan",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Emily Davis",
    username: "emilydavis",
    email: "emilydavis@example.com",
    skpd: "Dinas Pekerjaan Umum",
    role: "User",
    status: "Aktif",
  },
  {
    id: 5,
    nama: "David Wilson",
    username: "davidwilson",
    email: "davidwilson@example.com",
    skpd: "Dinas Sosial",
    role: "Admin",
    status: "Suspend",
  },
  {
    id: 6,
    nama: "Laura Martinez",
    username: "lauramartinez",
    email: "lauramartinez@example.com",
    skpd: "Dinas Lingkungan Hidup",
    role: "User",
    status: "Aktif",
  },
  {
    id: 7,
    nama: "Robert Lee",
    username: "robertlee",
    email: "robertlee@example.com",
    skpd: "Dinas Kebudayaan",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 8,
    nama: "Sophia Brown",
    username: "sophiabrown",
    email: "sophiabrown@example.com",
    skpd: "Dinas Tenaga Kerja",
    role: "User",
    status: "Suspend",
  },
  {
    id: 9,
    nama: "William Garcia",
    username: "williamgarcia",
    email: "williamgarcia@example.com",
    skpd: "Dinas Pariwisata",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 10,
    nama: "Olivia Harris",
    username: "oliviaharris",
    email: "oliviaharris@example.com",
    skpd: "Dinas Perdagangan",
    role: "User",
    status: "Suspend",
  },
  {
    id: 1,
    nama: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    skpd: "Dinas Pendidikan",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Jane Smith",
    username: "janesmith",
    email: "janesmith@example.com",
    skpd: "Dinas Kesehatan",
    role: "User",
    status: "Suspend",
  },
  {
    id: 3,
    nama: "Michael Johnson",
    username: "michaelj",
    email: "michaelj@example.com",
    skpd: "Dinas Perhubungan",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Emily Davis",
    username: "emilydavis",
    email: "emilydavis@example.com",
    skpd: "Dinas Pekerjaan Umum",
    role: "User",
    status: "Aktif",
  },
  {
    id: 5,
    nama: "David Wilson",
    username: "davidwilson",
    email: "davidwilson@example.com",
    skpd: "Dinas Sosial",
    role: "Admin",
    status: "Suspend",
  },
  {
    id: 6,
    nama: "Laura Martinez",
    username: "lauramartinez",
    email: "lauramartinez@example.com",
    skpd: "Dinas Lingkungan Hidup",
    role: "User",
    status: "Aktif",
  },
  {
    id: 7,
    nama: "Robert Lee",
    username: "robertlee",
    email: "robertlee@example.com",
    skpd: "Dinas Kebudayaan",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 8,
    nama: "Sophia Brown",
    username: "sophiabrown",
    email: "sophiabrown@example.com",
    skpd: "Dinas Tenaga Kerja",
    role: "User",
    status: "Suspend",
  },
  {
    id: 9,
    nama: "William Garcia",
    username: "williamgarcia",
    email: "williamgarcia@example.com",
    skpd: "Dinas Pariwisata",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 10,
    nama: "Olivia Harris",
    username: "oliviaharris",
    email: "oliviaharris@example.com",
    skpd: "Dinas Perdagangan",
    role: "User",
    status: "Suspend",
  },
];

const columns = [
  { title: "Id", dataIndex: "id" },
  { title: "Nama", dataIndex: "nama" },
  { title: "Username", dataIndex: "username" },
  { title: "email", dataIndex: "email" },
  { title: "SKPD", dataIndex: "skpd" },
  { title: "Role", dataIndex: "role" },
  {
    title: "Status",
    dataIndex: "status",
    customRender: ({ record }) =>
      h(Tag, { color: getStatusTagColor(record.status) }, () => record.status),
  },
  {
    title: "Action",
    key: "action",
    customRender: ({ record }) =>
      h("div", { class: "flex space-x-2" }, [
        h(
          "button",
          {
            class: "text-blue-500 hover:text-blue-700",
            onClick: () => console.log("Edit", record),
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
</script>

<style></style>
