const { createK8sClients } = require('../../k8s/k8s');

const createStatefulset = async (user, file, namespaceName, statefulSetSpec) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.createNamespacedStatefulSet({namespace: namespaceName, body: JSON.parse(statefulSetSpec)})
    } catch(err) {
        throw new Error('Statefulset creation failed: ' + err.message);
    }
}

const listStatefulset = async (user, file, namespaceName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        return await appsV1Api.listNamespacedStatefulSet({namespace: namespaceName})
    } catch(err) {
        throw new Error('Statefulset listing failed: ' + err.message);
    }
}

const delStatefulset = async (user, file, namespaceName, statefulSetName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.deleteNamespacedStatefulSet({namespace: namespaceName, name: statefulSetName})
    } catch(err) {
        throw new Error('Statefulset deletion failed: ' + err.message);
    }
}

module.exports = {
    createStatefulset,
    listStatefulset,
    delStatefulset
}