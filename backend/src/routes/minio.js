// Importing the router from express
const { Router } = require('express')
// Multer is a helper module for file upload transactions
const upload = require('multer')()
const minioController = require('../controllers/minio')

const router = Router()

// Using the functions defined in controllers module

// Requires a form-data value(file) with the key 'kubeconfig-file'
router.post('/upload', upload.single('kubeconfig-file'), minioController.UploadFile)

router.get('/list', minioController.ListFiles)

// Requires a x-filename header, which will be the name of the file
router.delete('/delete', minioController.DeleteFile)

router.post('/use', minioController.UseFile)

// Exporting the router to use it in app.js file
module.exports = router