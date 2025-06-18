const { createK8sClients } = require('../../k8s/k8s');

const createDaemonset = async (user, file, namespaceName, daemonsetSpec) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.createNamespacedDaemonSet({namespace: namespaceName, body: JSON.parse(daemonsetSpec)})
    } catch(err) {
        throw new Error('Pod creation failed: ' + err.message);
    }
}

const listDaemonset = async (user, file, namespaceName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        return await appsV1Api.listNamespacedDaemonSet({namespace: namespaceName})
    } catch(err) {
        throw new Error('Pod listing failed: ' + err.message);
    }
}

const delDaemonset = async (user, file, namespaceName, daemonsetName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.deleteNamespacedDaemonSet({namespace: namespaceName, name: daemonsetName})
    } catch(err) {
        throw new Error('Pod deletion failed: ' + err.message);
    }
}

module.exports = {
    createDaemonset,
    listDaemonset,
    delDaemonset,
}