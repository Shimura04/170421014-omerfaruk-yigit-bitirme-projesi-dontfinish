const { createDaemonset, listDaemonset, delDaemonset } = require('../controllers/k8s/daemonsets')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, daemonSetSpec } = req.body

    if (!kubeConfigName || !namespaceName || !daemonSetSpec) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await createDaemonset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, daemonSetSpec)
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
        const daemonsets = await listDaemonset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: daemonsets })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, daemonSetName } = req.body

    if (!kubeConfigName || !namespaceName, !daemonSetName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await delDaemonset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, daemonSetName)
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
