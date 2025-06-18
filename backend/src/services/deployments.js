const { createDeployment, listDeployment, delDeployment } = require('../controllers/k8s/deployments')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, deploymentSpec } = req.body

    if (!kubeConfigName || !namespaceName || !deploymentSpec) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await createDeployment(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, deploymentSpec)
        return res.status(201).json({ status: 'success'})
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const list = async (req, res) => {
    const { kubeConfigName, namespaceName } = req.body

    if (!kubeConfigName || !namespaceName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath' })
    }

    try {
        const deployments = await listDeployment(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: deployments })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, deploymentName } = req.body

    if (!kubeConfigName || !namespaceName, !deploymentName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await delDeployment(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, deploymentName)
        return res.status(200).json({ status: 'success'})
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

module.exports = {
    create,
    list,
    del,
}
