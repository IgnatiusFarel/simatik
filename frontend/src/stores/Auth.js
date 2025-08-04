import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Api from "@/services/Api";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("auth_token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const tokenExpiry = ref(localStorage.getItem("token_expiry") || null);

  function isTokenExpired() {
    return !tokenExpiry.value || new Date() > new Date(tokenExpiry.value);
  }

  const isAuthenticated = computed(() => token.value && !isTokenExpired());

  async function login(credentials) {
  try {
    const res = await Api.post("/login", credentials);
    if (!res.data?.status) {
      throw new Error(res.data?.message || "Login gagal!");
    }

    const { token: authToken, user: userData, expired_at } = res.data.data;

    token.value = authToken;
    user.value = userData;
    tokenExpiry.value = new Date(expired_at).toISOString();

    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token_expiry", tokenExpiry.value);

    return res.data;
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const firstKey = Object.keys(errors)[0];
      throw new Error(errors[firstKey][0] || "Data tidak valid");
    }
    throw new Error(error.response?.data?.message || error.message || "Login gagal!");
  }
}


  async function logout() {
    try {
      await Api.post("/logout"); // panggil endpoint logout
    } catch (error) {
      console.warn("Logout API error:", error?.response?.data || error.message);
      // Tetap lanjut hapus data walaupun API gagal
    } finally {
      token.value = null;
      user.value = null;
      tokenExpiry.value = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiry");
      router.push("/login");
    }
  }

  return { token, user, isAuthenticated, login, logout };
});
