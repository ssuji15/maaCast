const validator = require('validator')

const mongoose = require('mongoose')
const maacastOrderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    deliveryExecutiveId: {
        type: String,
        required: false
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
},{
    timestamps: true
})

const Order = mongoose.model('maacastOrder',maacastOrderSchema)
module.exports = Order