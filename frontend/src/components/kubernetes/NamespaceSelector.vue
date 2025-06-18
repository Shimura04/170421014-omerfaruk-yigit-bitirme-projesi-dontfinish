<!-- components/NamespaceSelector.vue -->
<script setup>
import { onMounted } from 'vue'
import { useNamespaces } from '@/composables/useNamespaces'
import { useRouter } from 'vue-router'
const route = useRouter()

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const { namespaces, listNamespaces, loading, error } = useNamespaces(
  route.currentRoute.value.params.name,
)

onMounted(listNamespaces)

const handleSelect = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="space-y-1 w-64">
    <label class="block font-medium">Select Namespace</label>

    <select :value="modelValue" @change="handleSelect" class="border px-3 py-2 rounded w-full">
      <option disabled value="">-- Choose namespace --</option>
      <option v-for="ns in namespaces" :key="ns.metadata.name" :value="ns.metadata.name">
        {{ ns.metadata.name }}
      </option>
    </select>

    <div v-if="loading" class="text-sm text-gray-500">Loading namespaces...</div>
    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
  </div>
</template>
