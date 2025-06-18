<!-- This page is the signup page where users can create their accounts -->
<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

// Registration mechanism
const username = ref('')
const email = ref('')
const password = ref('')
const SignUp = async () => {
  const request = await fetch('http://localhost:3000/api/v1/auth/signup', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      username: username.value,
      email: email.value,
      password: password.value,
    }),
  })

  const response = await request.json()
  if (response.status === 'success') {
    alert('You have successfully created your account! Redirecting...')
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
        <h1 class="font-bold text-center mb-5">Signup to the dontfinish</h1>
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
          <label class="block mb-1" for="email">Email</label>
          <input
            v-model="email"
            class="bg-isabelline py-2 px-4 rounded-2xl"
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
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
          @click="router.replace({ path: '/login' })"
          class="mb-2.5 text-center cursor-pointer hover:text-moonstone hover:underline"
        >
          <i>You have an account?</i>
        </p>
        <div class="text-center">
          <button
            @click="SignUp"
            class="bg-charcoal text-white px-3 py-2 rounded-3xl cursor-pointer"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
