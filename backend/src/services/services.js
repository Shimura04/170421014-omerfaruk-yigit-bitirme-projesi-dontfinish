const { createService, listService, delService } = require('../controllers/k8s/services')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, serviceSpec } = req.body

    if (!kubeConfigName || !namespaceName || !serviceSpec) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await createService(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, serviceSpec)
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
        const services = await listService(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: services })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, serviceName } = req.body

    if (!kubeConfigName || !namespaceName, !serviceName) {
        return res.status(400).json({ error: 'Missing data' })
    }

    try {
        await delService(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, serviceName)
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
