const validator = require('validator')
const database_conn = require('../utils/dbconnect')
const logger = require('../service/logger_service')

const mongoose = database_conn.mongoose
const maacastOrderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    items: [
        {
            itemid: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    razorPayOrderId: {
        type: String,
        required: false
    }
})

const Order = mongoose.model('maacastOrder',maacastOrderSchema)
module.exports = Order