import { ref } from 'vue'

export function useReplicaSets(file) {
  const replicaSets = ref([])
  const loading = ref(false)
  const error = ref(null)

  const listReplicaSets = async (namespace) => {
    error.value = null
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/api/v1/k8s/replicaset/list', {
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
      replicaSets.value = result.data.items || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createReplicaSet = async (namespace, rsSpec) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/replicaset/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          replicaSetSpec: rsSpec,
        }),
      })
      await listReplicaSets(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteReplicaSet = async (namespace, name) => {
    error.value = null
    loading.value = true
    try {
      await fetch('http://localhost:3000/api/v1/k8s/replicaset/del', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kubeConfigName: file,
          namespaceName: namespace,
          replicaSetName: name,
        }),
      })
      await listReplicaSets(namespace)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    replicaSets,
    loading,
    error,
    listReplicaSets,
    createReplicaSet,
    deleteReplicaSet,
  }
}
