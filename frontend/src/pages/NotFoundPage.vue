<template>
  <div class="flex items-center justify-center h-screen flex-col">
    <h1 class="text-4xl font-bold text-red-500">404</h1>
    <p class="text-gray-500 mb-4">Halaman tidak ditemukan</p>
    <a-button type="primary" @click="$router.push('/dashboard')">
      Kembali ke Dashboard
    </a-button>
  </div>
</template>
