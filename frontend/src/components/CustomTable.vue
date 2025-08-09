<template>
  <div class="bg-white shadow-sm p-4 rounded-md">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Show</label>
           <a-select
          :value="pageSize"
          @change="handlePageSizeChange"
          :options="pageSizeOptions"
          class="page-size-select"
        />
          <span class="text-sm">entries</span>
        </div>
        <slot name="header-filter"></slot>
      </div>
      <slot name="header-action"></slot>
    </div>

    <a-table
      :columns="columns"
       :data-source="data"
      :pagination="false"
      :loading="loading"
      row-key="key" 
      :scroll="{ x: 'max-content' }"
      :rowClassName="(_, index) => (index % 2 === 0 ? 'bg-[#f7f6fe]' : '')"
    />

    <div class="flex justify-center mt-4">
      <a-pagination
        :current="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        @change="onPageChange"
        :itemRender="customItemRender"        
      />
    </div>
  </div>
</template>

<script setup>
import { h, ref, computed, watch } from "vue";

const emit = defineEmits(["page-change", "page-size-change"]);

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  currentPage: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  totalItems: { type: Number, required: true },
});

const pageSizeOptions = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

function handlePageSizeChange(value) {
  emit("page-size-change", value);
  emit("page-change", 1); 
}

function onPageChange(page) {
  emit("page-change", page);
}

// const filteredData = computed(() => {
//   if (!search.value) return props.data ?? [];
//   return (props.data ?? []).filter((item) =>
//     Object.values(item).some((val) =>
//       String(val).toLowerCase().includes(search.value.toLowerCase())
//     )
//   );
// });

// const paginatedData = computed(() => {
//   const data = filteredData.value ?? [];
//   const start = (current.value - 1) * pageSize.value;
//   const end = start + pageSize.value;
//   return data.slice(start, end);
// });

// watch([search, pageSize], () => {
//   current.value = 1;
// });

const customItemRender = ({ type, page }) => {
  if (type === "prev") return h("a", { class: "text-sm px-2" }, "Previous");
  if (type === "next") return h("a", { class: "text-sm px-2" }, "Next");

  const isActive = page === props.currentPage;
  return h(
    "a",
    {
      class: [
        "text-sm px-3 py-1.5 rounded",
        isActive
          ? "bg-[#d30007] text-white"
          : "hover:bg-gray-100 text-gray-700",
      ],
    },
    page
  );
};
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: white !important;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.ant-select-selector) {
  border-radius: 8px !important;
  background-color: #e0e0e0 !important;
  border: none !important;
}

:deep(.page-size-select .ant-select-selector) {
  height: 34px !important;
  display: flex;
  align-items: center;
}
</style>
