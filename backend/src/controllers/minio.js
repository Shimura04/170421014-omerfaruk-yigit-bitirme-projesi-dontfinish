// Import minio
const minio = require('minio')

// Create MinIO client in order to interact with MinIO API
const client = new minio.Client({
    endPoint: process.env.IP_ADDRESS,
    port: process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_ACCESS_KEY,
    useSSL: false,
})

// CreateBucket function creates a bucket for user. The bucket name is base64 encoded username
const CreateBucket = (username) => {
    const bucketName = Buffer.from(username).toString('hex');
    client.makeBucket(bucketName)
    .then(() => {
        return true
    })
    .catch(() => {
        return false
    })
};

// UploadFile function uploads ONE file to the bucket
const UploadFile = (req, res) => {
    const bucketName = Buffer.from(req.username).toString('hex')
    const fileName = Buffer.from(req.file.originalname).toString('hex')
    client.putObject(bucketName, fileName, req.file.buffer, req.file.size)
    .then(data => {
        return res.status(201).json({
            status: 'success',
            data: data
        })
    })
    .catch(error => {
        return res.status(400).json({
            status: 'error',
            message: error
        })
    })
}

// DeleteFile function deletes the specified file from bucket
const DeleteFile = (req, res) => {
    const bucketName = Buffer.from(req.username).toString('hex')
    const fileName = Buffer.from(req.header('x-filename')).toString('hex')
    client.removeObject(bucketName, fileName)
    .then(data => {
        return res.status(200).json({
            status: 'success',
            data: data
        })
    })
    .catch(error => {
        return res.status(400).json({
            status: 'error',
            message: error
        })
    })
}

// ListFiles function lists all the files in a specific bucket
const ListFiles = (req, res) => {
    const bucketName = Buffer.from(req.username).toString('hex')

    const data = []
    const stream = client.listObjects(bucketName)
    stream.on('data', obj => {
        data.push(Buffer.from(obj.name, 'hex').toString())
    })
    stream.on('end', () => {
        return res.status(200).json({
            status: 'success',
            data: data
        })
    })
    stream.on('error', error => {
        return res.status(400).json({
            status: 'error',
            message: error
        })
    })
}

const UseFile = async (req, res) => {

}

module.exports = {
    client,
    CreateBucket,
    ListFiles,
    UploadFile,
    DeleteFile,
    UseFile
}