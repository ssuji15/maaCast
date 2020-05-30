const validator = require('validator')
const mongoose = require('mongoose')

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




module.exports = razorpay_order