const { createConfigmap, listConfigmap, delConfigmap } = require('../controllers/k8s/configmaps')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, configMapSpec } = req.body

    if (!kubeConfigName || !namespaceName || !configMapSpec) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await createConfigmap(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, configMapSpec)
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
        const configmaps = await listConfigmap(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: configmaps })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, configMapName } = req.body

    if (!kubeConfigName || !namespaceName, !configMapName) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await delConfigmap(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, configMapName)
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
