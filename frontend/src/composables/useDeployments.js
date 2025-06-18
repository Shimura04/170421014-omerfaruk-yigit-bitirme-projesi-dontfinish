// composables/useDeployments.js
import { ref } from 'vue'

export function useDeployments(file) {
  const deployments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listDeployments = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/deployment/list', {
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
      deployments.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createDeployment = async (namespace, deploymentSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/deployment/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          deploymentSpec,
        }),
      })
      await listDeployments(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteDeployment = async (namespace, deploymentName) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/deployment/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          deploymentName,
        }),
      })
      await listDeployments(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    deployments,
    loading,
    error,
    listDeployments,
    createDeployment,
    deleteDeployment,
  }
}
