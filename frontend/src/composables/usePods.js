// composables/usePods.js
import { ref } from 'vue'

export function usePods(file) {
  const pods = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listPods = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/pod/list', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
        }),
      })
      const result = await res.json()
      pods.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createPod = async (namespace, podSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/pod/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          podSpec: podSpec,
        }),
      })
      await listPods(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deletePod = async (namespace, podName) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/pod/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          podName,
        }),
      })
      await listPods(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    pods,
    loading,
    error,
    listPods,
    createPod,
    deletePod,
  }
}
