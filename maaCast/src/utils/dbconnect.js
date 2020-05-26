const mongodb = require('mongodb')
const mongoose = require('mongoose')
const logger = require('../service/logger_service')

const MongoClient = mongodb.MongoClient
const connectionUrl = "mongodb://127.0.0.1:27017"
const databaseName = "maacast"

const getDBConnection = ()=> {

    return new Promise((resolve,reject) => {
        MongoClient.connect(connectionUrl,{ useNewUrlParser: true}, (error,client) => {
            if(error) {
                logger.error("Database ERROR! Could not connect to database")
                reject("Could not connect to database!")
            }
            else {
                logger.info("DATABASE client retrieved!")
                const db = client.db(databaseName)
                resolve(db)
            }            
        })
    })
}
mongoose.connect('mongodb://127.0.0.1:27017/maacast',{useNewUrlParser: true,useCreateIndex:true})

module.exports = {
    getDBConnection: getDBConnection,
    mongoose: mongoose
}
