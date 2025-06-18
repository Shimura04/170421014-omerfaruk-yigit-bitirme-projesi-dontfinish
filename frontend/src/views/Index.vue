<!-- This page is the main website page -->
<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div>
    <Header />
    <div class="w-full h-screen flex justify-center items-center">
      <div class="flex">
        <img src="/dontfinish.png" alt="icon" width="256px" class="mr-12" />
        <div class="py-4">
          <h1 class="font-bold text-4xl mb-3">What is dontfinish?</h1>
          <p class="text-xl w-128 mb-1.5">
            Dontfinish is a centralized Kubernetes management tool that helps you to manage your
            Kubernetes clusters with ease.
          </p>
          <p class="text-xl mb-1.5"><i>Created by 3 colleagues with great passion.</i></p>
          <p class="text-xl">
            Are you interested in?
            <span
              @click="router.push({ path: '/signup' })"
              class="cursor-pointer hover:text-moonstone hover:underline"
              >Sign up now</span
            >
            and start to use.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
