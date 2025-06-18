// Loading the required packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Load internal modules
const authRouter = require('./src/routes/auth')
const minioRouter = require('./src/routes/minio')
const { namespaceRouter, podRouter, deploymentRouter, daemonsetRouter, replicasetRouter, serviceRouter, configmapRouter, secretRouter, statefulsetRouter } = require('./src/routes/k8s')
const logger = require('./src/middlewares/logger')
const auth = require('./src/middlewares/auth')

// Loading the env variables
let port = process.env.PORT

// Creating the http server
const app = express()
const apiv1 = express()

// Middlewares
app.use(cors({
    // origin: `http://localhost:5173, http://${process.env.IP_ADDRESS}:5173`,
    origin: `http://localhost:5173`,
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(cookieParser())
app.use(logger)

// Routes
apiv1.use('/auth', authRouter)
apiv1.use('/minio', auth, minioRouter)
apiv1.use('/k8s/namespace', auth, namespaceRouter)
apiv1.use('/k8s/pod', auth, podRouter)
apiv1.use('/k8s/deployment', auth, deploymentRouter)
apiv1.use('/k8s/daemonset', auth, daemonsetRouter)
apiv1.use('/k8s/replicaset', auth, replicasetRouter)
apiv1.use('/k8s/service', auth, serviceRouter)
apiv1.use('/k8s/configmap', auth, configmapRouter)
apiv1.use('/k8s/secret', auth, secretRouter)
apiv1.use('/k8s/statefulset', auth, statefulsetRouter)

app.use('/api/v1', apiv1)
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})