// Importing the router from express
const { Router } = require('express')
const namespaceService = require('../services/namespaces')
const podService = require('../services/pods')
const deploymentService = require('../services/deployments')
const daemonsetService = require('../services/daemonsets')
const replicasetService = require('../services/replicasets')
const serviceService = require('../services/services')
const configmapService = require('../services/configmaps')
const secretService = require('../services/secrets')
const statefulsetService = require('../services/statefulsets')

const namespaceRouter = Router()
const podRouter = Router()
const deploymentRouter = Router()
const daemonsetRouter = Router()
const replicasetRouter = Router()
const serviceRouter = Router()
const configmapRouter = Router()
const secretRouter = Router()
const statefulsetRouter = Router()

// Using the functions defined in services module
namespaceRouter.post('/create', namespaceService.create)
namespaceRouter.post('/list', namespaceService.list)
namespaceRouter.delete('/del', namespaceService.del)

podRouter.post('/create', podService.create)
podRouter.post('/list', podService.list)
podRouter.delete('/del', podService.del)

deploymentRouter.post('/create', deploymentService.create)
deploymentRouter.post('/list', deploymentService.list)
deploymentRouter.delete('/del', deploymentService.del)

daemonsetRouter.post('/create', daemonsetService.create)
daemonsetRouter.post('/list', daemonsetService.list)
daemonsetRouter.delete('/del', daemonsetService.del)

replicasetRouter.post('/create', replicasetService.create)
replicasetRouter.post('/list', replicasetService.list)
replicasetRouter.delete('/del', replicasetService.del)

serviceRouter.post('/create', serviceService.create)
serviceRouter.post('/list', serviceService.list)
serviceRouter.delete('/del', serviceService.del)

configmapRouter.post('/create', configmapService.create)
configmapRouter.post('/list', configmapService.list)
configmapRouter.delete('/del', configmapService.del)

secretRouter.post('/create', secretService.create)
secretRouter.post('/list', secretService.list)
secretRouter.delete('/del', secretService.del)

statefulsetRouter.post('/create', statefulsetService.create)
statefulsetRouter.post('/list', statefulsetService.list)
statefulsetRouter.delete('/del', statefulsetService.del)

// Exporting the router to use it in app.js file
module.exports = {
    namespaceRouter,
    podRouter,
    deploymentRouter,
    daemonsetRouter,
    replicasetRouter,
    serviceRouter,
    configmapRouter,
    secretRouter,
    statefulsetRouter
}
