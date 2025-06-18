const { createPod, listPods, delPod } = require('../controllers/k8s/pods')

const create = async (req, res) => {
    const { kubeConfigName, namespaceName, podSpec } = req.body

    if (!kubeConfigName || !namespaceName || !podSpec) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await createPod(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, podSpec)
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
        const pods = await listPods(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName)
        return res.status(200).json({ status: 'success', data: pods })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const del = async (req, res) => {
    const { kubeConfigName, namespaceName, podName } = req.body

    if (!kubeConfigName || !namespaceName, !podName) {
        return res.status(400).json({ error: 'Missing kubeconfigPath or namespaceName' })
    }

    try {
        await delPod(Buffer.from(req.username, 'utf-8').toString('hex'), Buffer.from(kubeConfigName, 'utf-8').toString('hex'), namespaceName, podName)
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
