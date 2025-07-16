<!-- <template>
  <div class="bg-white shadow-sm p-4">
    <div class="flex justify-between">
      <p>Show</p>
      entries Recent History
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="false" />
  </div>
</template>

<script setup>
import { h } from "vue";
import { SquarePen, Trash2 } from "lucide-vue-next";

const columns = [
  {
    title: "No. Seri",
    dataIndex: "seri",
  },
  {
    title: "Barang",
    dataIndex: "barang",
    sorter: {
      compare: (a, b) => a.barang - b.barang,
    },
  },
  {
    title: "Tahun Pengadaan",
    dataIndex: "tahun_pengadaan",
    sorter: {
      compare: (a, b) => a.tahun_pengadaan - b.tahun_pengadaan,
    },
  },
  {
    title: "Pemeliharaan",
    dataIndex: "pemeliharaan",
    sorter: {
      compare: (a, b) => a.pemeliharaan - b.pemeliharaan,
    },
  },
  {
    title: "Harga Barang",
    dataIndex: "harga_barang",
  },
  {
    title: "Kategori",
    dataIndex: "kategori",
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: {
      compare: (a, b) => a.status - b.status,
    },
  },
  {
    title: "Action",
    key: "action",
    customRender: ({ record }) => {
      return h("div", { class: "flex space-x-2" }, [
        h(
          "button",
          {
            class: "text-[#624de3] hover:text-blue-700",
            onClick: () => onEdit(record),
            title: "Edit",
          },
          [h(SquarePen, { size: 20 })]
        ),
        h(
          "button",
          {
            class: "text-[#a30d11] hover:text-red-700",
            onClick: () => onDelete(record),
            title: "Delete",
          },
          [h(Trash2, { size: 20 })]
        ),
      ]);
    },
  },
];

function onEdit(record) {
  console.log("Edit clicked:", record);
}

function onDelete(record) {
  console.log("Delete clicked:", record);
}

const data = [
  {
    key: "1",
    seri: "SN001",
    barang: "Laptop",
    tahun_pengadaan: 2022,
    pemeliharaan: 2,
    harga_barang: "15.000.000",
    kategori: "Elektronik",
    status: "Aktif",
  },
];
</script>

<style></style> -->
