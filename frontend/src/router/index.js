import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/auth/LoginPage.vue';
import DashboardPage from '../pages/dashboard/DashboardPage.vue';

const routes = [
  { path: '/login', component: LoginPage, meta: {public: true}},  
  { path: '/dashboard', component: DashboardPage, meta: {public: true}},  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
