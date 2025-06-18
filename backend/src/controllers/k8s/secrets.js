const { createK8sClients } = require('../../k8s/k8s');

const createSecret = async (user, file, namespaceName, secretSpec) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.createNamespacedSecret({namespace: namespaceName, body: JSON.parse(secretSpec)})
    } catch(err) {
        throw new Error('Secret creation failed: ' + err.message);
    }
}

const listSecret = async (user, file, namespaceName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        return await coreV1Api.listNamespacedSecret({namespace: namespaceName})
    } catch(err) {
        throw new Error('Secret listing failed: ' + err.message);
    }
}

const delSecret = async (user, file, namespaceName, secretName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.deleteNamespacedSecret({namespace: namespaceName, name: secretName})
    } catch(err) {
        throw new Error('Secret deletion failed: ' + err.message);
    }
}

module.exports = {
    createSecret,
    listSecret,
    delSecret,
}