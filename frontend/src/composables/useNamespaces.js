// composables/useNamespaces.js
import { ref } from 'vue'

export function useNamespaces(file) {
  const namespaces = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listNamespaces = async () => {
    error.value = null
    loading.value = true

    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/namespace/list', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          kubeConfigName: file,
        }),
      })
      const ns = await res.json()
      namespaces.value = ns.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createNamespace = async (name) => {
    error.value = null
    loading.value = true

    try {
      await fetch('http://localhost:3000/api/v1/k8s/namespace/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: name,
        }),
      })
      await listNamespaces(file) // Refresh
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteNamespace = async (name) => {
    error.value = null
    loading.value = true

    try {
      await fetch('http://localhost:3000/api/v1/k8s/namespace/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: name,
        }),
      })
      await listNamespaces(file) // Refresh
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    namespaces,
    loading,
    error,
    listNamespaces,
    createNamespace,
    deleteNamespace,
  }
}
