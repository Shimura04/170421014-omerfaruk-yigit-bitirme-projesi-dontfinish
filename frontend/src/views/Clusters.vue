<!-- This page shows the logged in user their uploaded kubeconfig files -->
<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { onMounted, ref, computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
const username = ref(localStorage.getItem('dontfinish-username'))
const response = ref('')

const file = ref(null)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref('')

const router = useRouter()
const isViewingConfig = computed(() => !!router.currentRoute.value.params.name)

const onFileChange = (event) => {
  file.value = event.target.files[0] || null
  uploadSuccess.value = false
  uploadError.value = ''
}

const UploadFile = async () => {
  if (!file.value) return

  const formData = new FormData()
  formData.append('kubeconfig-file', file.value)

  uploading.value = true
  uploadSuccess.value = false
  uploadError.value = ''

  try {
    const request = await fetch('http://localhost:3000/api/v1/minio/upload', {
      credentials: 'include',
      method: 'POST',
      body: formData,
    })

    const response = await request.json()

    if (response.status !== 'success') {
      const errorText = response.message
      throw new Error(errorText || 'Upload failed')
    }

    uploadSuccess.value = true
  } catch (err) {
    uploadError.value = err.message
  } finally {
    uploading.value = false
    ListFiles()
  }
}

const DeleteFile = async (name) => {
  const request = await fetch('http://localhost:3000/api/v1/minio/delete', {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      'x-filename': name,
    },
  })

  const response = await request.json()
  if (response.status === 'success') {
    ListFiles()
    alert(`File ${name} has deleted!`)
  } else {
    alert(response.message)
  }
}

const ListFiles = async () => {
  const request = await fetch('http://localhost:3000/api/v1/minio/list', {
    credentials: 'include',
  })
  const res = await request.json()
  response.value = res
}

const RedirectToConfigFile = (configName) => {
  router.push({
    name: 'config',
    params: {
      name: configName,
    },
  })
}

onMounted(ListFiles)
</script>

<template>
  <Header :show-login-buttons="false" :username="username" />
  <div class="min-h-screen flex flex-col pt-24 pb-12">
    <!-- Render child routes like K8sDashboard -->
    <RouterView v-if="isViewingConfig" />

    <!-- Main content (shown only if NOT viewing a specific config) -->
    <main v-else class="flex-1 flex flex-col items-center justify-center px-4">
      <div class="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Your Cluster Config Files</h2>

        <!-- Upload Form -->
        <form @submit.prevent="UploadFile" class="space-y-4 mb-6">
          <input
            type="file"
            @change="onFileChange"
            class="block w-full text-sm text-gray-700 text-center"
          />
          <button
            type="submit"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            :disabled="!file || uploading"
          >
            {{ uploading ? 'Uploading...' : 'Upload File' }}
          </button>
          <p v-if="uploadSuccess" class="text-green-600 text-center">Upload successful!</p>
          <p v-if="uploadError" class="text-red-600 text-center">
            Upload failed: {{ uploadError }}
          </p>
        </form>

        <!-- File List -->
        <div v-if="response.status === 'success'">
          <div v-if="response.data.length">
            <div
              v-for="configName in response.data"
              :key="configName"
              class="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3 mb-3"
            >
              <h3 class="text-lg font-medium truncate">{{ configName }}</h3>
              <div class="flex gap-2">
                <button
                  @click="RedirectToConfigFile(configName)"
                  class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Use
                </button>
                <button
                  @click="DeleteFile(configName)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">No config files have been added.</div>
        </div>

        <div v-else class="text-center text-red-600 mt-4">
          Something went wrong fetching config files.
        </div>
      </div>
    </main>
  </div>
  <Footer />
</template>
