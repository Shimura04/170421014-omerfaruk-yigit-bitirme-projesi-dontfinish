<!-- views/DeploymentManager.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useDeployments } from '@/composables/useDeployments'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const { deployments, listDeployments, createDeployment, deleteDeployment, error, loading } =
  useDeployments(kubeFile)

const newDeploymentName = ref('')
const containerName = ref('')
const containerImage = ref('')
const replicas = ref(1)

watch(selectedNamespace, (newNs) => {
  listDeployments(newNs)
})

const handleCreate = () => {
  const deploymentSpec = {
    metadata: {
      name: newDeploymentName.value,
    },
    spec: {
      replicas: replicas.value,
      selector: {
        matchLabels: {
          app: newDeploymentName.value,
        },
      },
      template: {
        metadata: {
          labels: {
            app: newDeploymentName.value,
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

  createDeployment(selectedNamespace.value, JSON.stringify(deploymentSpec))
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">Deployments in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-64">
      <input
        v-model="newDeploymentName"
        placeholder="Deployment name"
        class="border p-1 rounded w-full"
      />
      <input
        v-model="containerName"
        placeholder="Container name"
        class="border p-1 rounded w-full"
      />
      <input
        v-model="containerImage"
        placeholder="Container image (e.g. nginx)"
        class="border p-1 rounded w-full"
      />
      <input
        type="number"
        v-model.number="replicas"
        min="1"
        placeholder="Replicas"
        class="border p-1 rounded w-full"
      />
      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">
        Create Deployment
      </button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="dep in deployments"
        :key="dep.metadata.uid"
        class="flex justify-between items-center bg-gray-100 p-2 rounded"
      >
        <span>{{ dep.metadata.name }}</span>
        <button
          @click="deleteDeployment(selectedNamespace, dep.metadata.name)"
          class="text-red-500"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
