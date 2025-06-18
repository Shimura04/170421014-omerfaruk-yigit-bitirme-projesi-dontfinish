const { createReplicaset, listReplicaset, delReplicaset } = require('../controllers/k8s/replicasets')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, replicaSetSpec } = req.body

    if (!kubeConfigName || !namespaceName || !replicaSetSpec) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await createReplicaset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, replicaSetSpec)
        return res.status(201).json({ status: 'success'})
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const list = async (req, res) => {
    const { kubeConfigName, namespaceName } = req.body

    if (!kubeConfigName || !namespaceName) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        const replicasets = await listReplicaset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: replicasets })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, replicaSetName } = req.body

    if (!kubeConfigName || !namespaceName, !replicaSetName) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await delReplicaset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, replicaSetName)
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
