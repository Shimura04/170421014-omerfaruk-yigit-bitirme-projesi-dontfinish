import { ref } from 'vue'

export function useServices(file) {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listServices = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/service/list', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
        }),
      })
      const result = await res.json()
      services.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createService = async (namespace, serviceSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/service/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          serviceSpec,
        }),
      })
      await listServices(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteService = async (namespace, name) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/service/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          serviceName: name,
        }),
      })
      await listServices(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    services,
    loading,
    error,
    listServices,
    createService,
    deleteService,
  }
}
