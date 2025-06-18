<script setup>
import { ref, watch } from 'vue'
import { useDaemonSets } from '@/composables/useDaemonsets'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const { daemonSets, listDaemonSets, createDaemonSet, deleteDaemonSet, error, loading } =
  useDaemonSets(kubeFile)

const dsName = ref('')
const containerName = ref('')
const containerImage = ref('')

// Watch namespace change
watch(selectedNamespace, (newNs) => {
  listDaemonSets(newNs)
})

const handleCreate = () => {
  const dsSpec = {
    apiVersion: 'apps/v1',
    kind: 'DaemonSet',
    metadata: {
      name: dsName.value,
    },
    spec: {
      selector: {
        matchLabels: {
          app: dsName.value,
        },
      },
      template: {
        metadata: {
          labels: {
            app: dsName.value,
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

  createDaemonSet(selectedNamespace.value, JSON.stringify(dsSpec))
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">DaemonSets in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-64">
      <input v-model="dsName" placeholder="DaemonSet name" class="border p-1 rounded w-full" />
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
        Create DaemonSet
      </button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="ds in daemonSets"
        :key="ds.metadata.uid"
        class="flex justify-between items-center bg-gray-100 p-2 rounded"
      >
        <span>{{ ds.metadata.name }}</span>
        <button @click="deleteDaemonSet(selectedNamespace, ds.metadata.name)" class="text-red-500">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
