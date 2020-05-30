const MaacastOrder = require('../models/maacast_order')
const logger = require('../../service/logger_service')
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

const getOrderByUser = async(userId) => {
    return new Promise(async (resolve,reject) => {
        try {
            await MaacastOrder.find({userId},(err,docs)=>{
                if(err) {
                    return reject()
                }
                resolve(docs)
            })
        }
        catch(e) {
            reject()
        }
    })
}
const getOrderByRestaurant = async(restaurantId) => {
    return new Promise(async (resolve,reject) => {
        try {
            await MaacastOrder.find({restaurantId},(err,docs)=>{
                if(err) {
                    return reject()
                }
                resolve(docs)
            })
        }
        catch(e) {
            reject()
        }
    })
}
const getOrderByDeliveryExecutive = async(deliveryExecutiveId) => {
    return new Promise(async (resolve,reject) => {
        try {
            await MaacastOrder.find({deliveryExecutiveId},(err,docs)=>{
                if(err) {
                    return reject()
                }
                resolve(docs)
            })
        }
        catch(e) {
            reject()
        }
    })
}
const getOrderByUserandRestaurant = async(userId,restaurantId) => {
    return new Promise(async (resolve,reject) => {
        try {
            await MaacastOrder.find({userId,restaurantId},(err,docs)=>{
                if(err) {
                    return reject()
                }
                resolve(docs)
            })
        }
        catch(e) {
            reject()
        }
    })
}



module.exports = {
    updatePaymentStatusByRazorPayId:updatePaymentStatusByRazorPayId,
    createOrder:createOrder,
    getOrderByRestaurant:getOrderByRestaurant,
    getOrderByUser:getOrderByUser,
    getOrderByUserandRestaurant:getOrderByUserandRestaurant,
    getOrderByDeliveryExecutive:getOrderByDeliveryExecutive
}