import { ref } from 'vue'

export function useStatefulSets(file) {
  const statefulSets = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listStatefulSets = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/statefulset/list', {
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
      statefulSets.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createStatefulSet = async (namespace, statefulSetSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/statefulset/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          statefulSetSpec,
        }),
      })
      await listStatefulSets(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteStatefulSet = async (namespace, name) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/statefulset/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          statefulSetName: name,
        }),
      })
      await listStatefulSets(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    statefulSets,
    loading,
    error,
    listStatefulSets,
    createStatefulSet,
    deleteStatefulSet,
  }
}
