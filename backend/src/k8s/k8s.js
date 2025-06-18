const fs = require('fs')
const os = require('os')
const k8s = require('@kubernetes/client-node')
const path = require('path')
const { client } = require('../controllers/minio')

const clientCache = new Map()

async function createK8sClients(user, file) {
  const fullPath = path.join(user, file)

  // if (clientCache.has(fullPath)) {
    // return clientCache.get(fullPath)
  // }

  // Step 1: Download from MinIO if not already downloaded
  const localPath = path.join(os.tmpdir(), fullPath)

  if (!fs.existsSync(localPath)) {
    await client.fGetObject(user, file, localPath)
  }

  // Step 2: Load and cache Kubernetes clients
  const kc = new k8s.KubeConfig()
  kc.loadFromFile(localPath)

  const coreV1Api = kc.makeApiClient(k8s.CoreV1Api)
  const appsV1Api = kc.makeApiClient(k8s.AppsV1Api)

  const res = { kc, coreV1Api, appsV1Api }
  clientCache.set(fullPath, client)

  return res
}

module.exports = {
  createK8sClients,
}