const validator = require('validator')
const database_conn = require('../utils/dbconnect')
const logger = require('../service/logger_service')


const mongoose = database_conn.mongoose

const razorpay_order = mongoose.model('razorpay_order',{
    razorpay_order_id: {
        type: String,
        required: false,
        trim: true
    },
    payment_id: {
        type: String,
        required: false,
        trim: true
    },
    razorpay_signature: {
        type: String,
        required: false,
        trim: true
    },
    receipt: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email Invalid!')
            }
        }
    },
    amount: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("amount is negative!")
            }
        }
    }
})

const getRazorpayOrder = (razorpay_order_id) => {

    return new Promise((resolve,reject) => {

        database_conn.getDBConnection().then((db) => {

            db.collection('razorpay_orders').findOne({
                razorpay_order_id: razorpay_order_id            
            },(error,result) => {
                if(error) {
                    logger.error("Database Error!")
                    reject('Database error')
                }
                else {
                    logger.info("Order successfully retrieved!")
                    resolve(result)
                }
            })
        }).catch((error) => {
            logger.error("Database Error! Could not connect to Database")
            reject('Database error')
        })
    })
}

const updateRazorpayOrder = (razorpay_payment_id,razorpay_order_id,razorpay_signature) => {

    return new Promise((resolve,reject) => {

        database_conn.getDBConnection().then((db) => {
            const query = {razorpay_order_id}
            const newValue = {$set: {razorpay_payment_id,razorpay_signature}}
            db.collection('razorpay_orders').updateOne(query,newValue,(error,res) => {
                if(error) {
                    logger.error("Database Error -- ", error)
                    reject('Database error')
                } 
                else {
                    logger.info('Updated successfully!')
                    resolve('Successful!')
                }
            })
        }).catch((error) => {
            logger.error("Database Error! Could not connect to Database")
            reject('Database error')
        })


    })

}

module.exports = {
    razorpay_order: razorpay_order,
    getRazorpayOrder: getRazorpayOrder,
    updateRazorpayOrder: updateRazorpayOrder
}