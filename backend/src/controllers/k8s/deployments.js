const { createK8sClients } = require('../../k8s/k8s')

const createDeployment = async (user, file, namespaceName, deploymentSpec) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.createNamespacedDeployment({namespace: namespaceName, body: JSON.parse(deploymentSpec)})
    } catch(err) {
        throw new Error('Pod creation failed: ' + err.message);
    }
}

const listDeployment = async (user, file, namespaceName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        return await appsV1Api.listNamespacedDeployment({namespace: namespaceName})
    } catch(err) {
        throw new Error('Pod listing failed: ' + err.message);
    }
}

const delDeployment = async (user, file, namespaceName, deploymentName) => {
    const { appsV1Api } = await createK8sClients(user, file)
    try {
        await appsV1Api.deleteNamespacedDeployment({namespace: namespaceName, name: deploymentName})
    } catch(err) {
        throw new Error('Pod deletion failed: ' + err.message);
    }
}

module.exports = {
    createDeployment,
    listDeployment,
    delDeployment,
}