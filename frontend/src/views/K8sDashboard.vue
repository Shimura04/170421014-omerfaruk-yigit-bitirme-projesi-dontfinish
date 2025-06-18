<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white p-4 space-y-2">
      <button
        v-for="item in items"
        :key="item.name"
        class="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        :class="{ 'bg-gray-700': selected === item.name }"
        @click="selected = item.name"
      >
        {{ item.label }}
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-auto">
      <component :is="selectedComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Import components
import NamespaceManager from '@/components/kubernetes/NamespaceManager.vue'
import PodManager from '@/components/kubernetes/PodManager.vue'
import DeploymentManager from '@/components/kubernetes/DeploymentManager.vue'
import ServiceManager from '@/components/kubernetes/ServiceManager.vue'
import ReplicaSetManager from '@/components/kubernetes/ReplicaSetManager.vue'
import StatefulSetManager from '@/components/kubernetes/StatefulSetManager.vue'
import DaemonSetManager from '@/components/kubernetes/DaemonSetManager.vue'
import ConfigMapManager from '@/components/kubernetes/ConfigMapManager.vue'
import SecretManager from '@/components/kubernetes/SecretManager.vue'

const selected = ref('Namespaces')

const items = [
  { name: 'Namespaces', label: 'Namespaces', component: NamespaceManager },
  { name: 'Pods', label: 'Pods', component: PodManager },
  { name: 'Deployments', label: 'Deployments', component: DeploymentManager },
  { name: 'ReplicaSets', label: 'ReplicaSets', component: ReplicaSetManager },
  { name: 'StatefulSets', label: 'StatefulSets', component: StatefulSetManager },
  { name: 'DaemonSets', label: 'DaemonSets', component: DaemonSetManager },
  { name: 'Services', label: 'Services', component: ServiceManager },
  { name: 'ConfigMaps', label: 'ConfigMaps', component: ConfigMapManager },
  { name: 'Secrets', label: 'Secrets', component: SecretManager },
]

const selectedComponent = computed(() => {
  return items.find((i) => i.name === selected.value)?.component || NamespaceManager
})
</script>

<style scoped>
button {
  transition: background 0.2s;
}
</style>
