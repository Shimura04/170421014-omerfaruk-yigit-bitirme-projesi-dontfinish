<script setup>
import { onMounted } from 'vue'
import { useNamespaces } from '@/composables/useNamespaces'
import { useRouter } from 'vue-router'
const router = useRouter()
const { namespaces, listNamespaces, createNamespace, deleteNamespace, error } = useNamespaces(
  router.currentRoute.value.params.name,
)
onMounted(listNamespaces)
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-2xl font-semibold">Namespaces</h2>

    <form @submit.prevent="createNamespace(newItemName)" class="flex gap-2">
      <input v-model="newItemName" placeholder="New namespace" class="border p-1 rounded" />
      <button type="submit" class="bg-blue-600 text-white px-3 py-1 rounded">Create</button>
    </form>

    <div v-if="isLoading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul class="space-y-2">
      <li
        v-for="ns in namespaces"
        :key="ns"
        class="flex justify-between items-center bg-gray-100 p-2 rounded"
      >
        <span>{{ ns.metadata.name }}</span>
        <div class="flex gap-2">
          <button @click="getItem(ns)" class="text-blue-500">Get</button>
          <button @click="deleteNamespace(ns.metadata.name)" class="text-red-500">Delete</button>
        </div>
      </li>
    </ul>

    <div v-if="selectedItem" class="p-4 mt-4 border rounded bg-white">
      <h3 class="font-semibold">Namespace Detail: {{ selectedItem.name }}</h3>
      <input
        v-model="updatedItemName"
        type="text"
        placeholder="New name"
        class="border p-1 mt-2 rounded"
      />
      <button
        @click="updateItem(selectedItem.name)"
        class="ml-2 bg-green-600 text-white px-3 py-1 rounded"
      >
        Update
      </button>
      <button @click="selectedItem = null" class="ml-2 text-gray-500">Cancel</button>
    </div>
  </div>
</template>
