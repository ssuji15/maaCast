const MaacastOrder = require('../models/maacast_order')
const logger = require('../../service/logger_service')
const Restaurant = require('../models/Restaurants.model')
const Item = require('../models/Item.model.js');
const createOrder = (userId,restaurantId,items,totalAmount) => {

    console.log(userId,restaurantId,items,totalAmount)
    const myitem = []

    items.forEach(element => {
        var myobj = {
            itemid: element._id,
            quantity: element.quantity
        }
        myitem.push(myobj)
    });
    console.log('====')
    console.log(myitem)
    console.log('====')
    return new Promise((resolve,reject)=>{
        const newOrder = new MaacastOrder({
            userId,
            restaurantId,
            items: myitem,
            totalAmount,
            paymentStatus: "Pending",
            status: "Awaiting restaurant Confirmation"
        }).save().then((order)=>{
            logger.info("maacastOrder stored in database", newOrder.id)
            resolve(order)
        }).catch((e)=>{
            console.log("______________________-")
            console.log(e)
            console.log("______________________")
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
            await MaacastOrder.find({userId},[],{
                sort: {
                    updatedAt: -1
                }
            },(err,docs)=>{
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

const populateOrder = async(orders) => {
    
    return new Promise(async (resolve,reject)=>{
            let populatedOrderList = []


            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                  await callback(array[index]);
                }
                console.log(populatedOrderList)
                resolve(populatedOrderList)
              }

            asyncForEach(orders, async(order)=>{
                const myrestaurant =  await RestaurantModel.findById(order.restaurantId)
                let myItems = []
                let myitemId = []
                let orderQuantity = []
                order.items.forEach((item)=>{
                    myitemId.push(item.itemid)
                    orderQuantity.push(item.quantity)
                })
                await ItemModel.find({
                    '_id': {
                        $in: myitemId
                    }
                },(err,docs)=>{
                    //console.log(err)
                    //console.log(docs)
                    const newOrder = {
                        _id: order._id,
                        userId: order.userId,
                        restaurant: myrestaurant,
                        items: docs,
                        itemQuantity:orderQuantity,
                        totalAmount: order.totalAmount,
                        paymentStatus: order.paymentStatus,
                        status: order.status,
                        razorPayOrderId: order.razorPayOrderId
                    }
                    console.log(newOrder)
                    populatedOrderList.push(newOrder)
                })

            })
            console.log(populatedOrderList)
            
        })
}


module.exports = {
    updatePaymentStatusByRazorPayId:updatePaymentStatusByRazorPayId,
    createOrder:createOrder,
    getOrderByRestaurant:getOrderByRestaurant,
    getOrderByUser:getOrderByUser,
    getOrderByUserandRestaurant:getOrderByUserandRestaurant,
    getOrderByDeliveryExecutive:getOrderByDeliveryExecutive,
    populateOrder:populateOrder
}