const { createK8sClients } = require('../../k8s/k8s');

const createReplicaset = async (user, file, namespaceName, replicasetSpec) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.createNamespacedReplicaSet({namespace: namespaceName, body: JSON.parse(replicasetSpec)})
    } catch(err) {
        throw new Error('Replicaset creation failed: ' + err.message);
    }
}

const listReplicaset = async (user, file, namespaceName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        return await appsV1Api.listNamespacedReplicaSet({namespace: namespaceName})
    } catch(err) {
        throw new Error('Replicaset listing failed: ' + err.message);
    }
}

const delReplicaset = async (user, file, namespaceName, replicasetName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.deleteNamespacedReplicaSet({namespace: namespaceName, name: replicasetName})
    } catch(err) {
        throw new Error('Replicaset deletion failed: ' + err.message);
    }
}

module.exports = {
    createReplicaset,
    listReplicaset,
    delReplicaset,
}