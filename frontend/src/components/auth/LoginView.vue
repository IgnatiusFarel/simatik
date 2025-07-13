<template>
  <main class="flex h-screen">
    <!-- Sisi kiri -->
    <div class="w-1/2 bg-black"></div>

    <!-- Sisi kanan -->
    <div class="w-1/2 flex items-center justify-center">
      <div class="w-full max-w-[480px] px-4 space-y-4">
        <!-- Logo -->
        <div class="flex justify-center">
          <img src="@/assets/Logo.png" alt="logo" class="w-48" />
        </div>

        <!-- Form -->
        <a-form layout="vertical" ref="formRef" :model="formData" :rules="rules" class="w-full">
          <a-form-item label="Email" name="email">
            <a-input
              v-model:value="formData.email"
              placeholder="Input your email account"
              class="w-full h-[56px] border border-[#E9EAEC] rounded-[8px]"
            />
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="Input your password account"
              class="w-full h-[56px] border border-[#E9EAEC] rounded-[8px]"
            />
          </a-form-item>

          <!-- Remember & Forgot -->
          <div class="flex justify-between items-center mb-4">
            <a-checkbox v-model:checked="formData.remember">
              <span class="text-sm text-[#657081] font-medium">Remember Me</span>
            </a-checkbox>
            <a class="text-sm text-[#657081] font-medium hover:underline hover:text-blue-500 cursor-pointer">
              Forgot Password
            </a>
          </div>

          <!-- Button -->
          <a-button
            type="primary"
            html-type="submit"
            block
            class="bg-red-600 hover:bg-red-700 border-none w-full h-[56px] rounded-xl"
            @click="onSubmit"
          >
            Login
          </a-button>
        </a-form>

        <!-- Footer -->
        <p class="text-xs text-gray-400 text-center mt-4">
          Design Inspired by @
        </p>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, reactive, toRaw } from 'vue'

const formRef = ref()

const formData = reactive({
  email: '',
  password: '',
  remember: false
})

const rules = {
  email: [
    {  message: 'Input your email account!' },
    { type: 'email', message: 'Please input a valid email!' } // Menambahkan validasi email
  ],
  password: [
    {  message: 'Input your password account!' },
    { min: 6, message: 'Password must be at least 6 characters!' } // Menambahkan validasi panjang password
  ]
}


const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('VALID:', toRaw(formData))
    })
    .catch((error) => {
      console.log('Validation Failed:', error)
    })
}
</script>



