import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import LoginPage from "@/pages/auth/LoginPage.vue";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage.vue";
import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import MasterBarangPage from "@/pages/master-data/MasterBarangPage.vue";
import MasterUserPage from "@/pages/master-data/MasterUserPage.vue";
import ReportBarangPage from "@/pages/report-barang/ReportBarang.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

function normalizeRole(role) {
  return (role || "").toLowerCase().replace(/\s+/g, "");
}

const routes = [
  {
    path: "/login",
    component: LoginPage,
    meta: { public: true, layout: "empty" },
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    meta: { public: true, layout: "empty" },
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true, roles: ["superadmin"], layout: "dashboard" },
  },
  {
    path: "/master-barang",
    component: MasterBarangPage,
    meta: { requiresAuth: true, roles: ["superadmin"], layout: "dashboard" },
  },
  {
    path: "/master-user",
    component: MasterUserPage,
    meta: { requiresAuth: true, roles: ["superadmin"], layout: "dashboard" },
  },
  {
    path: "/report-barang",
    component: ReportBarangPage,
    meta: { requiresAuth: true, roles: ["superadmin"], layout: "dashboard" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
    meta: { public: true, layout: "empty" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuth = auth.isAuthenticated;
  const userRole = normalizeRole(auth.user?.role);

  if (to.path === "/") {
    return next(isAuth ? "/dashboard" : "/login");
  }

  if (to.path === "/login" && isAuth) {
    return next("/dashboard");
  }

  if (to.meta.requiresAuth && !isAuth) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  if (to.meta.roles?.length) {
    const allowedRoles = to.meta.roles.map(normalizeRole);
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next("/dashboard");
    }
  }

  return next();
});

export default router;
