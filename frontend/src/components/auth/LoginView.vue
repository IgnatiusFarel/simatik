<template>
  <main class="flex h-screen">
    <div class="hidden lg:block w-1/2 bg-black"></div>
    <div class="w-full lg:w-1/2 flex items-center justify-center">
      <div class="w-full max-w-[480px] px-4 space-y-4">
        <div class="flex justify-center">
          <img src="@/assets/Logo.png" alt="logo" class="w-48" />
        </div>

        <a-form
          layout="vertical"
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="w-full"
          hideRequiredMark
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
            >
              Forgot Password
            </a>
          </div>

          <a-button
            type="primary"
            html-type="submit"
            block
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
import { useAuthStore } from "@/stores/auth";
import { ref, reactive, toRaw } from "vue";
import { message } from "ant-design-vue";
import router from "@/router";

const auth = useAuthStore();
const formRef = ref();
const loading = ref(false);

const formData = reactive({
  login: "",
  password: "",
  remember: false,
});

const rules = {
  login: [
    { required: true, message: "Email atau Username wajib diisi" },
    // { type: "email", message: "Format email tidak valid" },
  ],
  password: [
    { required: true, message: "Password wajib diisi" },
    { min: 8, message: "Password minimal 8 karakter" },
  ],
};
const handleLogin = async () => {
  try {
    loading.value = true;
    await auth.login(toRaw(formData));
    message.success("Login Berhasil!");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error login:", error);
    message.error(error?.message || "Login Gagal!");
  } finally {
    loading.value = false;
  }
};



</script>
