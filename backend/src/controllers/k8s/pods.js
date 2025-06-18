const { createK8sClients } = require('../../k8s/k8s')

const createPod = async (user, file, namespaceName, podSpec) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.createNamespacedPod({namespace: namespaceName, body: JSON.parse(podSpec)})
    } catch(err) {
        throw new Error('Pod creation failed: ' + err.message);
    }
}

const listPods = async (user, file, namespaceName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        return await coreV1Api.listNamespacedPod({namespace: namespaceName})
    } catch(err) {
        throw new Error('Pod listing failed: ' + err.message);
    }
}

const delPod = async (user, file, namespaceName, podName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.deleteNamespacedPod({namespace: namespaceName, name: podName})
    } catch(err) {
        throw new Error('Pod deletion failed: ' + err.message);
    }
}

module.exports = {
    createPod,
    listPods,
    delPod,
}