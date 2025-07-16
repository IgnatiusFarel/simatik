import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/auth/LoginPage.vue';
import DashboardPage from '../pages/dashboard/DashboardPage.vue';
import MasterUserPage from '../pages/master-data/MasterUserPage.vue';
import MasterBarangPage from '../pages/master-data/MasterBarangPage.vue'
import ReportBarangPage from '../pages/report-barang/ReportBarang.vue';

const routes = [
  { path: '/login', component: LoginPage, meta: { public: true, layout: 'empty' } },
  { path: '/dashboard', component: DashboardPage, meta: {public: true}},  
  { path: '/master-barang', component: MasterBarangPage, meta: {public: true}},  
  { path: '/master-user', component: MasterUserPage, meta: {public: true}},  
  { path: '/report-barang', component: ReportBarangPage, meta: {public: true}},  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
