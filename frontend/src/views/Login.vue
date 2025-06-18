<!-- This page is the login page where users can authenticate -->
<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

// Login request mechanism
const username = ref('')
const password = ref('')
const Login = async () => {
  const request = await fetch('http://localhost:3000/api/v1/auth/signin', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })

  const response = await request.json()
  if (response.status === 'success') {
    alert('You have logged in! Redirecting...')
    setTimeout(() => {}, 2000)
    localStorage.setItem('dontfinish-username', response.data.username)
    router.push({ name: 'clusters', params: { id: response.data.userID } })
  } else {
    alert(response.message)
  }
}
</script>

<template>
  <div>
    <Header :show-login-buttons="false" justify="center" />
    <div class="w-full h-screen flex justify-center items-center">
      <div>
        <h1 class="font-bold text-center mb-5">Login to the dontfinish</h1>
        <div class="mb-2.5">
          <label class="block mb-1" for="username">Username</label>
          <input
            v-model="username"
            class="bg-isabelline py-2 px-4 rounded-2xl"
            type="text"
            name="username"
            id="username"
            placeholder="example"
          />
        </div>
        <div class="mb-2.5">
          <label class="block mb-1" for="password">Password</label>
          <input
            v-model="password"
            class="bg-isabelline py-2 px-4 rounded-2xl"
            type="password"
            name="password"
            id="password"
            placeholder="verystrongpassword123"
          />
        </div>
        <p
          @click="router.replace({ path: '/signup' })"
          class="mb-2.5 text-center cursor-pointer hover:text-moonstone hover:underline"
        >
          <i>You don't have an account?</i>
        </p>
        <div class="text-center">
          <button
            @click="Login"
            class="bg-charcoal text-white px-3 py-2 rounded-3xl cursor-pointer"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
