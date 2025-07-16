<template>
  <div class="bg-white shadow-sm p-4 rounded-md">
    <!-- Top Controls: Show entries & Search -->
    <div class="flex items-center justify-start mb-4 flex-wrap gap-4">
      <!-- Page Size Selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium">Show</label>
        <select v-model.number="pageSize" class="border rounded px-2 py-1 text-sm">
          <option v-for="size in [10, 25, 50, 100]" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span class="text-sm">entries</span>
      </div>

      <!-- Search Box -->
      <div class="relative">
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="border rounded pl-9 pr-3 py-1 text-sm w-60"
        />
        <Search class="absolute left-2 top-1.5 w-4 h-4 text-gray-500" />
      </div>
    </div>

    <!-- Table -->
    <a-table
      :columns="columns"
      :data-source="paginatedData"
      :pagination="false"
      row-key="key"
     
  :rowClassName="(_, index) => index % 2 === 0 ? 'bg-[#f7f6fe]' : ''"
      
    />

    <!-- Pagination Centered -->
    <div class="flex justify-center mt-4">
      <a-pagination
        v-model:current="current"
        :page-size="pageSize"
        :total="filteredData.length"
        @change="onPageChange"
        :itemRender="customItemRender"
      />
    </div>
  </div>
</template>

<script setup>
import { h, ref, computed, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
})

const current = ref(1)
const pageSize = ref(10)
const search = ref('')

const onPageChange = (page) => {
  current.value = page
}

const filteredData = computed(() => {
  if (!search.value) return props.data ?? []
  return (props.data ?? []).filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  )
})

const paginatedData = computed(() => {
  const data = filteredData.value ?? []
  const start = (current.value - 1) * pageSize.value
  const end = start + pageSize.value
  return data.slice(start, end)
})

watch([search, pageSize], () => {
  current.value = 1
})

// Custom render pagination item with Tailwind bg-primary
const customItemRender = ({ type, originalElement, page }) => {
  if (type === 'prev') {
    return h('a', { class: 'text-sm px-2' }, 'Previous')
  }
  if (type === 'next') {
    return h('a', { class: 'text-sm px-2' }, 'Next')
  }
  // Active page styling
  const isActive = page === current.value
  return h(
    'a',
    {
      class: [
        'text-sm px-3 py-1 rounded',
        isActive
          ? 'bg-[#d30007] text-white' // <- your "primary" color
          : 'hover:bg-gray-100 text-gray-700',
      ],
    },
    page
  )
}
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: white !important;
  border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
}

</style>