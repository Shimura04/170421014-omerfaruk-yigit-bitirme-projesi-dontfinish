<script setup>
import { ref, watch } from 'vue'
import { usePods } from '@/composables/usePods'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'
const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const { pods, listPods, createPod, deletePod, error, loading } = usePods(kubeFile)

const newPodName = ref('')
const newContainerImage = ref('') // default image
const containerName = ref('') // container name

// Watch for namespace selection change
watch(selectedNamespace, (newNs) => {
  listPods(newNs)
})

const handleCreate = () => {
  const podSpec = {
    metadata: {
      name: newPodName.value,
    },
    spec: {
      containers: [
        {
          name: containerName.value,
          image: newContainerImage.value,
        },
      ],
    },
  }

  createPod(selectedNamespace.value, JSON.stringify(podSpec))
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">Pods in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-64">
      <input v-model="newPodName" placeholder="Pod name" class="border p-1 rounded w-full" />
      <input
        v-model="containerName"
        placeholder="Container name"
        class="border p-1 rounded w-full"
      />
      <input
        v-model="newContainerImage"
        placeholder="Container image (e.g. nginx)"
        class="border p-1 rounded w-full"
      />
      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">Create Pod</button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="pod in pods"
        :key="pod.metadata.uid"
        class="flex justify-between items-center bg-gray-100 p-2 rounded"
      >
        <span>{{ pod.metadata.name }}</span>
        <button @click="deletePod(selectedNamespace, pod.metadata.name)" class="text-red-500">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
