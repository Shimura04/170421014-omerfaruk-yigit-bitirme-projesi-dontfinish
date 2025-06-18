const { createK8sClients } = require('../../k8s/k8s')

const createNamespace = async (user, file, namespaceName) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.createNamespace({
            body: {
                metadata: {
                    name: namespaceName,
                }
            }
        })
    } catch(err) {
        throw new Error('Namespace creation failed: ' + err.message);
    }
}

const listNamespaces = async (user, file) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        return await coreV1Api.listNamespace()
    } catch(err) {
        throw new Error('Namespace listing failed: ' + err.message);
    }
}

const delNamespace = async (user, file, name) => {
    const { coreV1Api } = await createK8sClients(user, file)
    try {
        await coreV1Api.deleteNamespace({name: name})
    } catch(err) {
        throw new Error('Namespace deletion failed: ' + err.message);
    }
}

module.exports = {
    createNamespace,
    listNamespaces,
    delNamespace,
}