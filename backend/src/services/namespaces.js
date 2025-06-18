const { createNamespace, listNamespaces, delNamespace } = require('../controllers/k8s/namespaces')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName } = req.body
    console.log(req.body)

    if (!kubeConfigName || !namespaceName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        const namespace = await createNamespace(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(201).json({ status: 'success'})
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const list = async (req, res) => {
    const { kubeConfigName } = req.body
    console.log(req.body)

    if (!kubeConfigName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath' })
    }

    try {
        const namespaces = await listNamespaces(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'))
        return res.status(200).json({ status: 'success', data: namespaces })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName } = req.body

    if (!kubeConfigName || !namespaceName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await delNamespace(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
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
