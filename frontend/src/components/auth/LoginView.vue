<template>
  <main class="flex h-screen">
    <div class="hidden lg:block w-1/2 relative">
      <img
        src="https://images.unsplash.com/photo-1707157281599-d155d1da5b4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center">
      <div class="w-full max-w-[480px] px-4 space-y-4">
        <div class="flex justify-center">
          <img src="@/assets/Logo.png" alt="logo" class="w-48" />
        </div>

        <a-form
          layout="vertical"
          :model="formData"
          :rules="rules"
          class="w-full"
          @finish="handleLogin"
        >
          <a-form-item label="Email/Username" name="login">
            <a-input
              v-model:value="formData.login"
              placeholder="Masukkan Email/Username Anda"
              class="w-full border border-[#E9EAEC] rounded-[8px]"
            />
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="Masukkan Password Anda"
              class="w-full border border-[#E9EAEC] rounded-[8px]"
            />
          </a-form-item>

          <div class="flex justify-between items-center mb-4">
            <a-checkbox v-model:checked="formData.remember">
              <span class="text-sm text-[#657081] font-medium"
                >Remember Me</span
              >
            </a-checkbox>
            <a
              class="text-sm text-[#657081] font-medium hover:underline hover:text-blue-500 cursor-pointer"
              href="/forgot-password"
            >
              Forgot Password
            </a>
          </div>

          <a-button
            block
            type="primary"
            html-type="submit"
            :loading="loading"
            :disabled="loading"
            class="transition-transform transform active:scale-95 border-none w-full rounded-xl h-[46px] font-semibold"
          >
            <span v-if="loading">Memproses...</span>
            <span v-else>Login</span>
          </a-button>
        </a-form>

        <a
          href="https://www.figma.com/community/file/1426385374644644649/sistem-informasi-manajemen-aset-tik"
          target="_blank"
          rel="noopener noreferrer"
          class="block text-xs text-gray-400 text-center mt-4 hover:underline hover:text-blue-500 cursor-pointer"
        >
          Design by Dinkz Nasaruddin
        </a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from "@/stores/Auth.js";
import { ref, reactive, toRaw, onMounted, h } from "vue";
import { message, notification } from "ant-design-vue";
import router from "@/router";

const auth = useAuthStore();
const loading = ref(false);

const showTrialNotification = () => {
  notification.open({
    message: "✨ Demo Trial Account ✨",
    description: () =>
      h("div", [
        h("p", { innerHTML: "🔑 For Trial, using the following credentials:" }),
        h("p", {
          style: { margin: "4px 0 0 0" },
          innerHTML: "📧 Email: superadmin@gmail.com",
        }),
        h("p", {
          style: { margin: "4px 0 0 0" },
          innerHTML: "🔒 Password: 12345678",
        }),
      ]),
    duration: 0,
    type: "info",
    placement: "top",
  });
};

const formData = reactive({
  login: "",
  password: "",
  remember: false,
});

const rules = {
  login: [{ required: true, message: "Email atau Username wajib diisi!" }],
  password: [
    { required: true, message: "Password wajib diisi!" },
    { min: 8, message: "Password minimal 8 karakter!" },
  ],
};

const handleLogin = async () => {
  try {
    loading.value = true;
    message.destroy();
    await auth.login(toRaw(formData));
    message.success("Login Berhasil!");
    router.push("/dashboard");
  } catch (error) {
    message.destroy();
    message.error(error?.message || "Login Gagal!");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  showTrialNotification();
});
</script>
