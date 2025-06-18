const { createSecret, listSecret, delSecret } = require('../controllers/k8s/secrets')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, secretSpec } = req.body

    if (!kubeConfigName || !namespaceName || !secretSpec) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await createSecret(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, secretSpec)
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
        const secrets = await listSecret(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: secrets })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, secretName } = req.body

    if (!kubeConfigName || !namespaceName, !secretName) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await delSecret(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, secretName)
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
