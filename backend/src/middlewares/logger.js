const logger = (req, res, next) => {
    next()
    console.log(`[LOG] | ${req.ip} => ${req.originalUrl} ${req.method}`)
}

module.exports = logger