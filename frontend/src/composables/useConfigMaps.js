import { ref } from 'vue'

export function useConfigMaps(file) {
  const configMaps = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listConfigMaps = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/configmap/list', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
        }),
      })
      const result = await res.json()
      configMaps.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createConfigMap = async (namespace, configMapSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/configmap/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          configMapSpec,
        }),
      })
      await listConfigMaps(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteConfigMap = async (namespace, name) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/configmap/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          configMapName: name,
        }),
      })
      await listConfigMaps(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    configMaps,
    loading,
    error,
    listConfigMaps,
    createConfigMap,
    deleteConfigMap,
  }
}
