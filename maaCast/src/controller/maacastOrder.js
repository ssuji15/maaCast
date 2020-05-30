const MaacastOrder = require('../model/maacast_order')
const logger = require('../service/logger_service')
const createOrder = (userId,restaurantId,items,totalAmount) => {
    return new Promise((resolve,reject)=>{
        const newOrder = new MaacastOrder({
            userId,
            restaurantId,
            items,
            totalAmount,
            paymentStatus: "Pending",
            status: "Awaiting restaurant Confirmation"
        }).save().then((order)=>{
            logger.info("maacastOrder stored in database", newOrder.id)
            resolve(order)
        }).catch((e)=>{
            logger.info("Database Error")
            reject()
        })
    })
}

const updatePaymentStatusByRazorPayId = async (razorPayId,status) => {

    return new Promise(async (resolve,reject) => {
        try {
            logger.info('Updated Payment status')
            await MaacastOrder.findOneAndUpdate({razorPayOrderId:razorPayId},{paymentStatus:status})
            resolve()
        }
        catch(e) {
            logger.error('Could not update payment status!')
            reject()
        }
    })
}

module.exports = {
    updatePaymentStatusByRazorPayId:updatePaymentStatusByRazorPayId,
    createOrder:createOrder
}