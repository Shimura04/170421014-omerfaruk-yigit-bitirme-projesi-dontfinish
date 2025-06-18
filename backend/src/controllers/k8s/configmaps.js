const { createK8sClients } = require('../../k8s/k8s');

const createConfigmap = async (user, file, namespaceName, configMapSpec) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.createNamespacedConfigMap({namespace: namespaceName, body: JSON.parse(configMapSpec)})
    } catch(err) {
        throw new Error('Configmap creation failed: ' + err.message);
    }
}

const listConfigmap = async (user, file, namespaceName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        return await coreV1Api.listNamespacedConfigMap({namespace: namespaceName})
    } catch(err) {
        throw new Error('Configmap listing failed: ' + err.message);
    }
}

const delConfigmap = async (user, file, namespaceName, configMapName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.deleteNamespacedConfigMap({namespace: namespaceName, name: configMapName})
    } catch(err) {
        throw new Error('Configmap deletion failed: ' + err.message);
    }
}

module.exports = {
    createConfigmap,
    listConfigmap,
    delConfigmap,
}