<!-- The Header Compoent which will be shown at the top if the screen -->
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const SignOut = async () => {
  const request = await fetch('http://localhost:3000/api/v1/auth/signout', {
    credentials: 'include',
    method: 'DELETE',
  })

  const response = await request.json()
  if (response.status === 'success') {
    alert('You signed out successfully!')
    router.push({ path: '/' })
  } else {
    alert(response.message)
  }
}

// Props for the header
const props = defineProps({
  justify: {
    type: String,
    default: 'between',
  },
  showLoginButtons: {
    type: Boolean,
    default: true,
  },
  username: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    :class="[
      'bg-moonstone',
      'text-white',
      'w-screen',
      'h-24',
      'fixed',
      'flex',
      `justify-${justify}`,
      'items-center',
      'px-12',
    ]"
  >
    <div
      @click="router.replace({ path: '/' })"
      class="flex justify-center items-center cursor-pointer"
    >
      <img src="/dontfinish.png" alt="icon" width="64px" class="mr-2" />
      <h1 class="text-2xl">Dontfinish</h1>
    </div>
    <div v-show="props.showLoginButtons" class="w-64 flex">
      <button
        class="bg-charcoal hover:bg-gunmetal transition duration-150 px-3 py-2 mx-1 rounded-3xl cursor-pointer w-full"
        @click="router.push({ path: '/login' })"
      >
        LOGIN
      </button>
      <button
        class="bg-charcoal hover:bg-gunmetal transition duration-150 px-3 py-2 mx-1 rounded-3xl cursor-pointer w-full"
        @click="router.push({ path: '/signup' })"
      >
        SIGN UP
      </button>
    </div>
    <div v-show="username !== ''" class="">
      <h1>Welcome {{ username }}!</h1>
      <button
        class="bg-charcoal hover:bg-gunmetal transition duration-150 px-3 py-2 mx-1 rounded-3xl cursor-pointer w-full"
        @click="SignOut()"
      >
        SIGN OUT
      </button>
    </div>
  </div>
</template>
