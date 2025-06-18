<script setup>
import { ref, watch } from 'vue'
import { useServices } from '@/composables/useServices'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const { services, listServices, createService, deleteService, error, loading } =
  useServices(kubeFile)

const serviceName = ref('')
const selectorApp = ref('')
const port = ref(80)
const targetPort = ref(80)
const type = ref('ClusterIP') // Default type

watch(selectedNamespace, (ns) => {
  listServices(ns)
})

const handleCreate = () => {
  const svcSpec = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: serviceName.value,
    },
    spec: {
      selector: {
        app: selectorApp.value,
      },
      ports: [
        {
          port: port.value,
          targetPort: targetPort.value,
        },
      ],
      type: type.value,
    },
  }

  createService(selectedNamespace.value, JSON.stringify(svcSpec))
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">Services in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-64">
      <input v-model="serviceName" placeholder="Service name" class="border p-1 rounded w-full" />
      <input
        v-model="selectorApp"
        placeholder="Selector (app=...)"
        class="border p-1 rounded w-full"
      />
      <input
        v-model.number="port"
        type="number"
        placeholder="Port"
        class="border p-1 rounded w-full"
      />
      <input
        v-model.number="targetPort"
        type="number"
        placeholder="Target Port"
        class="border p-1 rounded w-full"
      />
      <select v-model="type" class="border p-1 rounded w-full">
        <option value="ClusterIP">ClusterIP</option>
        <option value="NodePort">NodePort</option>
        <option value="LoadBalancer">LoadBalancer</option>
        <option value="ExternalName">ExternalName</option>
      </select>
      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">Create Service</button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="svc in services"
        :key="svc.metadata.uid"
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-100 p-2 rounded"
      >
        <div>
          <div class="font-semibold">{{ svc.metadata.name }} ({{ svc.spec.type }})</div>
          <div class="text-sm text-gray-700">
            Ports:
            <span v-for="(port, idx) in svc.spec.ports" :key="idx" class="inline-block mr-2">
              {{ port.port }}→{{ port.targetPort }}/{{ port.protocol }}
            </span>
          </div>
        </div>
        <button
          @click="deleteService(selectedNamespace, svc.metadata.name)"
          class="text-red-500 mt-2 sm:mt-0"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
