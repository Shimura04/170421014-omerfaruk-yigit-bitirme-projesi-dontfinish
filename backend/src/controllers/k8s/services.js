const { createK8sClients } = require('../../k8s/k8s');

const createService = async (user, file, namespaceName, serviceSpec) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.createNamespacedService({namespace: namespaceName, body: JSON.parse(serviceSpec)})
    } catch(err) {
        throw new Error('Service creation failed: ' + err.message);
    }
}

const listService = async (user, file, namespaceName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        return await coreV1Api.listNamespacedService({namespace: namespaceName})
    } catch(err) {
        throw new Error('Service listing failed: ' + err.message);
    }
}

const delService = async (user, file, namespaceName, serviceName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.deleteNamespacedService({namespace: namespaceName, name: serviceName})
    } catch(err) {
        throw new Error('Service deletion failed: ' + err.message);
    }
}

module.exports = {
    createService,
    listService,
    delService,
}