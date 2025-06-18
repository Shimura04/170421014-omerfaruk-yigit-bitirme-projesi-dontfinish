<script setup>
import { ref, watch } from 'vue'
import { useStatefulSets } from '@/composables/useStatefulSets'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const {
  statefulSets,
  listStatefulSets,
  createStatefulSet,
  deleteStatefulSet,
  error,
  loading,
} = useStatefulSets(kubeFile)

const ssName = ref('')
const replicas = ref(1)
const containerName = ref('')
const containerImage = ref('')
const serviceName = ref('') // Required for StatefulSet

// Watch namespace change
watch(selectedNamespace, (newNs) => {
  listStatefulSets(newNs)
})

const handleCreate = () => {
  const ssSpec = {
    apiVersion: 'apps/v1',
    kind: 'StatefulSet',
    metadata: {
      name: ssName.value,
    },
    spec: {
      serviceName: serviceName.value,
      replicas: replicas.value,
      selector: {
        matchLabels: {
          app: ssName.value,
        },
      },
      template: {
        metadata: {
          labels: {
            app: ssName.value,
          },
        },
        spec: {
          containers: [
            {
              name: containerName.value,
              image: containerImage.value,
            },
          ],
        },
      },
    },
  }

  createStatefulSet(selectedNamespace.value, JSON.stringify(ssSpec))
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">StatefulSets in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-64">
      <input v-model="ssName" placeholder="StatefulSet name" class="border p-1 rounded w-full" />
      <input v-model="serviceName" placeholder="Headless Service name" class="border p-1 rounded w-full" />
      <input v-model.number="replicas" type="number" min="1" placeholder="Replicas" class="border p-1 rounded w-full" />
      <input v-model="containerName" placeholder="Container name" class="border p-1 rounded w-full" />
      <input
        v-model="containerImage"
        placeholder="Container image (e.g. redis)"
        class="border p-1 rounded w-full"
      />
      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">Create StatefulSet</button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="ss in statefulSets"
        :key="ss.metadata.uid"
        class="flex justify-between items-center bg-gray-100 p-2 rounded"
      >
        <span>{{ ss.metadata.name }}</span>
        <button @click="deleteStatefulSet(selectedNamespace, ss.metadata.name)" class="text-red-500">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
