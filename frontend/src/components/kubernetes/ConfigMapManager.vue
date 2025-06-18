<script setup>
import { ref, watch } from 'vue'
import { useConfigMaps } from '@/composables/useConfigMaps'
import { useRouter } from 'vue-router'
import NamespaceSelector from '@/components/kubernetes/NamespaceSelector.vue'

const selectedNamespace = ref('')
const router = useRouter()
const kubeFile = router.currentRoute.value.params.name

const {
  configMaps,
  listConfigMaps,
  createConfigMap,
  deleteConfigMap,
  loading,
  error,
} = useConfigMaps(kubeFile)

const configMapName = ref('')
const keyValues = ref([{ key: '', value: '' }])

watch(selectedNamespace, (ns) => {
  listConfigMaps(ns)
})

const handleCreate = async () => {
  const data = {}
  keyValues.value.forEach(({ key, value }) => {
    if (key) data[key] = value
  })

  const configMapSpec = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: configMapName.value,
    },
    data,
  }

  await createConfigMap(selectedNamespace.value, JSON.stringify(configMapSpec))

  configMapName.value = ''
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
    <h2 class="text-2xl font-semibold">ConfigMaps in {{ selectedNamespace }}</h2>

    <form ref="form" @submit.prevent="handleCreate" class="space-y-2 w-96">
      <input v-model="configMapName" placeholder="ConfigMap name" class="border p-2 rounded w-full" />

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
        Create ConfigMap
      </button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="cm in configMaps"
        :key="cm.metadata.uid"
        class="bg-gray-100 p-2 rounded"
      >
        <div class="font-semibold">{{ cm.metadata.name }}</div>
        <div v-if="cm.data" class="text-sm text-gray-700 space-y-1 mt-1">
          <div v-for="(val, k) in cm.data" :key="k">
            <strong>{{ k }}</strong>: <code>{{ val }}</code>
          </div>
        </div>
        <button @click="deleteConfigMap(selectedNamespace, cm.metadata.name)" class="text-red-500 mt-2">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
