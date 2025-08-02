<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Login</h1>
    <form @submit.prevent="onSubmit" class="space-y-2">
      <input v-model="email" placeholder="Email" class="border p-2 w-full" />
      <input type="password" v-model="password" placeholder="Password" class="border p-2 w-full" />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2">Sign in</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const onSubmit = () => {
  router.push('/')
}
</script>
