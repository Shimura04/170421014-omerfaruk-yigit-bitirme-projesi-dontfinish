<script setup>
import { ref, watch } from 'vue'
import { useReplicaSets } from '@/composables/useReplicasets'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const { replicaSets, listReplicaSets, createReplicaSet, deleteReplicaSet, error, loading } =
  useReplicaSets(kubeFile)

const rsName = ref('')
const replicas = ref(1)
const containerName = ref('')
const containerImage = ref('')

// Watch namespace change
watch(selectedNamespace, (newNs) => {
  listReplicaSets(newNs)
})

const handleCreate = () => {
  const rsSpec = {
    apiVersion: 'apps/v1',
    kind: 'ReplicaSet',
    metadata: {
      name: rsName.value,
    },
    spec: {
      replicas: replicas.value,
      selector: {
        matchLabels: {
          app: rsName.value,
        },
      },
      template: {
        metadata: {
          labels: {
            app: rsName.value,
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

  createReplicaSet(selectedNamespace.value, JSON.stringify(rsSpec))
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">ReplicaSets in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-64">
      <input v-model="rsName" placeholder="ReplicaSet name" class="border p-1 rounded w-full" />
      <input
        v-model.number="replicas"
        type="number"
        min="1"
        placeholder="Replicas"
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
      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">
        Create ReplicaSet
      </button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="rs in replicaSets"
        :key="rs.metadata.uid"
        class="flex justify-between items-center bg-gray-100 p-2 rounded"
      >
        <span>{{ rs.metadata.name }}</span>
        <button @click="deleteReplicaSet(selectedNamespace, rs.metadata.name)" class="text-red-500">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
