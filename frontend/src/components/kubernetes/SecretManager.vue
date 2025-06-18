<script setup>
import { ref, watch } from 'vue'
import { useSecrets } from '@/composables/useSecrets'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const {
  secrets,
  listSecrets,
  createSecret,
  deleteSecret,
  loading,
  error,
} = useSecrets(kubeFile)

const secretName = ref('')
const secretType = ref('Opaque')
const keyValues = ref([{ key: '', value: '' }]) // multi-key support

watch(selectedNamespace, (ns) => {
  listSecrets(ns)
})

const handleCreate = async () => {
  const data = {}
  keyValues.value.forEach(({ key, value }) => {
    if (key) data[key] = btoa(value) // base64 encode
  })

  const secretSpec = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: secretName.value,
    },
    type: secretType.value,
    data,
  }

  await createSecret(selectedNamespace.value, JSON.stringify(secretSpec))

  secretName.value = ''
  secretType.value = 'Opaque'
  keyValues.value = [{ key: '', value: '' }]
}

const addKeyValue = () => {
  keyValues.value.push({ key: '', value: '' })
}

const removeKeyValue = (index) => {
  keyValues.value.splice(index, 1)
}
</script>

<template>
  <div class="p-4 space-y-4">
    <NamespaceSelector v-model="selectedNamespace" />
    <h2 class="text-2xl font-semibold">Secrets in {{ selectedNamespace }}</h2>

    <form @submit.prevent="handleCreate" class="space-y-2 w-96">
      <input v-model="secretName" placeholder="Secret name" class="border p-2 rounded w-full" />
      <select v-model="secretType" class="border p-2 rounded w-full">
        <option value="Opaque">Opaque</option>
        <option value="kubernetes.io/dockerconfigjson">Docker Config</option>
        <option value="kubernetes.io/tls">TLS</option>
      </select>

      <div v-for="(pair, index) in keyValues" :key="index" class="flex space-x-2 items-center">
        <input
          v-model="pair.key"
          placeholder="Key"
          class="border p-1 rounded flex-1"
        />
        <input
          v-model="pair.value"
          placeholder="Value"
          class="border p-1 rounded flex-1"
        />
        <button
          type="button"
          @click="removeKeyValue(index)"
          class="text-red-500 hover:underline"
          v-if="keyValues.length > 1"
        >
          ×
        </button>
      </div>

      <button type="button" @click="addKeyValue" class="text-blue-500 hover:underline text-sm">
        + Add another key
      </button>
      <br>

      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded mt-2">
        Create Secret
      </button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="secret in secrets"
        :key="secret.metadata.uid"
        class="bg-gray-100 p-2 rounded"
      >
        <div class="font-semibold">{{ secret.metadata.name }} ({{ secret.type }})</div>
        <div v-if="secret.data" class="text-sm text-gray-700 mt-1">
          <div v-for="(val, key) in secret.data" :key="key">
            {{ key }}: <code>{{ val }}</code>
          </div>
        </div>
        <button @click="deleteSecret(selectedNamespace, secret.metadata.name)" class="text-red-500 mt-2">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
