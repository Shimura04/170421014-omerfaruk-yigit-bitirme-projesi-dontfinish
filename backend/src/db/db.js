// Importing the pg-promise module in order to interact with the postgres database
const pgp = require('pg-promise')()
const db = pgp(process.env.DB_CONNECTION_STRING)

// Exporting the db variable to use in other modules
module.exports = db