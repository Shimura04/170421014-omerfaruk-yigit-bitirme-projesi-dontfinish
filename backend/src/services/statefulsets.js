const { createStatefulset, listStatefulset, delStatefulset } = require('../controllers/k8s/statefulsets')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, statefulSetSpec } = req.body

    if (!kubeConfigName || !namespaceName || !statefulSetSpec) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await createStatefulset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, statefulSetSpec)
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
        const statefulsets = await listStatefulset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: statefulsets })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, statefulSetName } = req.body

    if (!kubeConfigName || !namespaceName, !statefulSetName) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await delStatefulset(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, statefulSetName)
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
