const Razorpay = require('razorpay')
const razorpay_order = require('../app/models/razorpay_order')
var crypto = require('crypto')
const logger = require('./logger_service')

var instance = new Razorpay({
    key_id: 'rzp_test_2ThovjqRDKoU7r',
    key_secret: 'jAkd5j3KUQOJ2a5ZvA2IED5N'
  })

const createOrder = (amount,receipt) => {

    return new Promise((resolve,reject)=> {
        amount = amount * 100
        instance.orders.create({amount, currency: 'INR', receipt, payment_capture: 0},(error,order) => {
            if(error) {
                logger.error('Could not create order', error)
                reject('Sry could not connect to Razorpay. Try again after some time')
            }
                amount = amount / 100
                logger.info('Razor pay order created successfully!')
                const new_order = new razorpay_order({
                    razorpay_order_id: order.id,
                    receipt,
                    amount
                }).save().then(() => {
                    logger.info("SUJI..")
                    logger.info("Order stored in database", order.id)
                    resolve(order.id)
                }).catch(() => {
                    logger.error("Database error! could not store razorpay order", order.id)
                    reject('Try again after some time!')
                })                
        }) 
    })

}

const checkPayment = (razorpay_payment_id,razorpay_order_id,razorpay_signature) => {

    return new Promise(async (resolve,reject) => {

        const hmac = crypto.createHmac('sha256', 'jAkd5j3KUQOJ2a5ZvA2IED5N');
        const data = hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        if(data.digest('hex') === razorpay_signature) {
                logger.info('Signature matched. Payment Successful', razorpay_order_id)
                await razorpay_order.findOneAndUpdate(razorpay_order_id,{razorpay_payment_id,razorpay_signature},(err,query)=>{
                    if(err) {
                        console.log("UNSUCCESSFULL!")
                        return reject()``
                    }
                    console.log("SUCCESSFULL!")
                    resolve()
                })                
        }
        else {
            logger.error("Signature matching failed! Payment unsuccessful", razorpay_order_id)
            reject('Payment failed! Kindly retry..')
        }  
    })
    
}



module.exports = {
    createOrder: createOrder,
    checkPayment: checkPayment
}