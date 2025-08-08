<template>
  <main class="w-full h-[96px] flex items-center justify-between px-3 border-b border-[#E9EAEC] bg-white">
    <div class="flex items-center gap-4">
      <a-button type="text" class="p-2" @click="$emit('toggle-sidebar')">
        <Menu class="w-5 h-5" />
      </a-button>
      
      <a-dropdown trigger="click" placement="bottomLeft">
        <template #overlay>
          <a-menu class="max-h-[240px] overflow-auto">
            <a-menu-item
              v-for="item in filteredMenus"
              :key="item.key"
              @click="goToRoute(item)"
            >
              <span>{{ item.label }}</span>
            </a-menu-item>
            <a-menu-item v-if="filteredMenus.length === 0" disabled>
              <span>Tidak ada hasil</span>
            </a-menu-item>
          </a-menu>
        </template>
        <a-input
          v-model:value="searchText"
          placeholder="Cari menu..."
          allow-clear
          :bordered="false"
          class="w-[320px] h-[48px] rounded-[8px] bg-[#FAFAFA] pl-3 text-sm"
        >
          <template #prefix>
            <Search class="w-4 h-4 text-[#21252B]" />
          </template>
        </a-input>
      </a-dropdown>
    </div>
    
    <div class="flex items-center gap-4">      
      <a-dropdown trigger="click" placement="bottomRight" class="border rounded-full" >
        <template #overlay>
          <div class="w-[300px] max-h-[300px] overflow-y-auto bg-white rounded-lg shadow p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold text-sm">🔔 Notifikasi</span>
              <a-button type="link" size="small" @click.stop="toggleAllNotifications">
                {{ showAllNotifications ? 'Tampilkan 3' : 'Lihat semua' }}
              </a-button>
            </div>
            <div
              v-for="(notif, index) in displayedNotifications"
              :key="index"
              class="p-2 rounded-md hover:bg-gray-50 cursor-pointer mb-1 border"
            >
              <p class="font-medium text-sm">{{ notif.title }}</p>
              <p class="text-xs text-gray-500">{{ notif.time }}</p>
            </div>
            <div
              v-if="notifications.length === 0"
              class="text-center text-sm text-gray-400 py-4"
            >
              Tidak ada notifikasi
            </div>
          </div>
        </template>
        <a-badge :count="notifications.length" size="small">
          <a-button type="text" class="p-2">
            <Bell class="w-5 h-5" />
          </a-button>
        </a-badge>
      </a-dropdown>
      
      <a-dropdown trigger="click" placement="bottomRight" class="border">
        <template #overlay>
          <a-menu>
            <a-menu-item key="logout" @click="() => handleProfileSelect('logout')">
              <div class="flex items-center gap-2 text-red-500">
                <LogOut class="w-4 h-4" />
                <span>Logout</span>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full">
          <a-avatar size="large" src="https://i.pravatar.cc/40" />
          <ChevronRight class="w-4 h-4 text-[#21252B]" />
        </div>
      </a-dropdown>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { Menu, Bell, ChevronRight, Search, LogOut } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { message } from "ant-design-vue";

const auth = useAuthStore();
const router = useRouter();
const searchText = ref("");
const showAllNotifications = ref(false);

const menus = ref([
  { key: "dashboard", label: "Dashboard", path: "/dashboard" },
  { key: "master-barang", label: "Master Barang", path: "/master-barang" },
  { key: "master-user", label: "Master User", path: "/master-user" },
  { key: "report-barang", label: "Report Barang", path: "/report-barang" },
]);

const notifications = ref([
  { title: "Barang baru ditambahkan", time: "2 menit yang lalu" },
  { title: "Stok barang menipis", time: "10 menit yang lalu" },
  { title: "User baru terdaftar", time: "1 jam yang lalu" },
  { title: "Backup sistem berhasil", time: "2 jam yang lalu" },
  { title: "Update aplikasi tersedia", time: "3 jam yang lalu" },
]);

const filteredMenus = computed(() =>
  menus.value.filter((m) =>
    m.label.toLowerCase().includes(searchText.value.toLowerCase())
  )
);

const displayedNotifications = computed(() => {
  return showAllNotifications.value
    ? notifications.value
    : notifications.value.slice(0, 3);
});

const goToRoute = (item) => {
  router.push(item.path);
  searchText.value = "";
};

const handleProfileSelect = (key) => {
  if (key === "logout") {
    auth.logout(); 
    message.success("Logout Berhasil!");
  }
};

const toggleAllNotifications = () => {
  showAllNotifications.value = !showAllNotifications.value;
};
</script>

