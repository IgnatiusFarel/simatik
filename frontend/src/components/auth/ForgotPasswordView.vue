<template>
  <main
    class="min-h-screen bg-gray-50 flex items-center justify-center flex-col px-4"
  >
    <div class="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-6">
      <a-steps
        :current="current"
        :items="items"
        class="mb-6 w-full max-w-[420px]"
      />

      <template v-if="current === 0">
        <h2 class="text-lg text-center font-semibold mb-2">
          Verifikasi Alamat Email
        </h2>
        <p class="text-gray-600 text-sm mb-4">
          Masukkan alamat email akun terdaftar anda untuk mengatur ulang
          password.
        </p>

        <a-form
          layout="vertical"
          ref="formRef1"
          :model="formData"
          :rules="rules"
          @finish="handleSendOtp"
        >
          <a-form-item label="Email" name="email">
            <a-input
              v-model:value="formData.email"
              placeholder="Masukkan Alamat Email Akun Anda "
            />
          </a-form-item>

          <div class="space-y-2">
            <a-button
              block
              type="primary"
              html-type="submit"
              :loading="loading"
              :disabled="loading"
              class="transition-transform transform active:scale-95 border-none w-full rounded-xl font-semibold"
            >
              <span v-if="loading">Memproses...</span>
              <span v-else>Kirim OTP</span>
            </a-button>
            <a-button type="default" block @click="handleBackToLogin">Login</a-button>
          </div>
        </a-form>
      </template>

      <template v-else-if="current === 1">
        <h2 class="text-lg text-center font-semibold mb-4">Verifikasi Akun</h2>
        <p class="text-gray-600 text-sm mb-2">
          Silakan verifikasi akun email Anda terlebih dahulu untuk bisa mengatur
          ulang password.
        </p>
        <p class="text-gray-600 text-sm mb-4">
          Kode verifikasi telah dikirimkan ke email
          <span class="font-semibold">{{ formData.email }}</span
          >.
        </p>

        <h3 class="text-center font-semibold text-base mb-3">
          Kode Verifikasi
        </h3>

        <div class="flex gap-4 justify-center my-4">
          <input
            v-for="(val, index) in otpInputs"
            :key="index"
            v-model="otpInputs[index]"
            maxlength="1"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            class="w-10 h-12 text-center text-lg font-bold border-b-2 border-gray-400 focus:border-blue-500 outline-none"
            @input="handleOtpInput(index, $event)"
          />
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-500">
            Belum menerima kode verifikasi melalui email?
          </p>
          <a
            href="#"
            @click.prevent="handleResendOtp"
            :class="[
              'font-medium text-sm inline-block mt-1',
              countdown > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 cursor-pointer',
            ]"
            :aria-disabled="countdown > 0"
          >
            Kirim Ulang Kode Verifikasi
          </a>
          <span v-if="countdown > 0" class="ml-1 text-gray-500">
            (00:{{ countdown.toString().padStart(2, '0') }})
          </span>
        </div>

        <div class="flex items-center my-4">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="mx-3 text-gray-400 text-sm">atau</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <div class="text-center mt-2">
          <a
            href="#"
            @click.prevent="handleInputEmail"
            class="text-blue-500 font-medium text-sm"
          >
            Ubah Email
          </a>
        </div>
      </template>

      <template v-else-if="current === 2">
        <h2 class="text-lg text-center font-semibold mb-2">Buat Password Baru</h2>
        <p class="text-gray-600 text-sm mb-4">
          Masukkan password baru Anda dan konfirmasi kembali password baru akun Anda.
        </p>

        <a-form
          layout="vertical"
          ref="formRef2"
          :model="formData"
          :rules="rules"
          @finish="handleSubmit"
        >
          <a-form-item label="Password Baru" name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="Masukkan Password Baru Anda"
            />
          </a-form-item>

          <a-form-item label="Konfirmasi Password" name="password_confirmation">
            <a-input-password
              v-model:value="formData.password_confirmation"
              placeholder="Konfirmasi Password Baru Anda"
            />
          </a-form-item>

          <a-button
            block
            type="primary"
            html-type="submit"
            :loading="loading"
            :disabled="loading"
            class="transition-transform transform active:scale-95 border-none w-full rounded-xl font-semibold"
          >
            <span v-if="loading">Memproses...</span>
            <span v-else>Ubah Password</span>
          </a-button>
        </a-form>
      </template>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import router from "@/router/index.js";
import Api from "@/services/Api.js";

const current = ref(0);
const loading = ref(false);
const countdown = ref(0);
const formRef1 = ref();
const formRef2 = ref();

const otpInputs = ref(["", "", "", ""]);
const verifiedOtp = ref("");
const steps = [{ title: "" }, { title: "" }, { title: "" }];
const items = steps.map((item) => ({ key: item.title, title: item.title }));

const rules = {
  email: [
    { required: true, message: "Email wajib diisi!" },
    { type: "email", message: "Format email tidak valid!" },
  ],
  password: [
    { required: true, message: "Password wajib diisi!" },
    { min: 8, message: "Password minimal 8 karakter!" },
  ],
  password_confirmation: [
    {
      required: true,
      message: "Konfirmasi password wajib diisi!",
    },
    {
      validator: (_, value) => {
        if (value !== formData.password) {
          return Promise.reject("Password dan konfirmasi tidak cocok!");
        }
        return Promise.resolve();
      },
    },
  ],
};

const formData = reactive({
  email: "",
  password: "",           
  password_confirmation: "", 
});

const handleBackToLogin = () => {
  router.push("/login");
};

const handleSendOtp = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append("email", formData.email);
    await Api.post("/send-otp", fd);
    message.destroy();

    message.success("Kode OTP berhasil dikirimkan ke email anda", 3);
    current.value = 1;
    otpInputs.value = ["", "", "", ""];
    startCountdown();
  } catch (error) {
    message.destroy();    
    message.error(error?.response?.data?.message || "Email anda tidak terdaftar", 3);
  } finally {
    loading.value = false;
  }
};

const handleOtpInput = async (index, event) => {
  const value = event.target.value.replace(/\D/g, "");
  otpInputs.value[index] = value;

  if (value && index < otpInputs.value.length - 1) {
    event.target.nextElementSibling?.focus();
  }

  const otp = otpInputs.value.join("");
  if (otp.length === 4) {
    await verifyOtpRealtime(otp);
  }
};

const verifyOtpRealtime = async (otp) => {
  if (loading.value) return;
  loading.value = true;

  try {
    const payload = { email: formData.email, otp };
    await Api.post("/verify-otp", payload);
    message.destroy();
    message.success("OTP benar, silakan ganti password", 3);
    current.value = 2;

    verifiedOtp.value = otp; 
  } catch (error) {
    message.destroy();
    message.error(
      error?.response?.data?.message ||
        "Kode OTP salah atau sudah kadaluarsa! Silakan cek email atau kirim ulang OTP.",
      5
    );
    otpInputs.value = ["", "", "", ""];
  } finally {
    loading.value = false;
  }
};

const handleResendOtp = async () => {
  if (countdown.value > 0) {
    message.destroy();
    message.info(`Silakan tunggu ${countdown.value} detik sebelum mengirim ulang OTP`);
    return;
  }
  await handleSendOtp();
};

const handleInputEmail = () => {
  formData.email = "";
  otpInputs.value = ["", "", "", ""];
  countdown.value = 0;
  current.value = 0;
  loading.value = false;
};

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const payload = {
      email: formData.email,
      otp: verifiedOtp.value,   
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };
    await Api.post("/reset-password", payload);
    message.destroy();
    message.success("Password berhasil diubah. Silakan login kembali.", 3);
   await router.push("/login"); 
  } catch (error) {
    message.destroy();
    message.error(error?.response?.data?.message || "Gagal mengubah password", 3);
  } finally {
    loading.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};
</script>
