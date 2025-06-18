import { ref } from 'vue'

export function useSecrets(file) {
  const secrets = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listSecrets = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/secret/list', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
        }),
      })
      const result = await res.json()
      secrets.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createSecret = async (namespace, secretSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/secret/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          secretSpec,
        }),
      })
      await listSecrets(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteSecret = async (namespace, name) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/secret/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          secretName: name,
        }),
      })
      await listSecrets(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    secrets,
    loading,
    error,
    listSecrets,
    createSecret,
    deleteSecret,
  }
}
