const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const logger = require('./service/logger_service')
const razorpayservice = require('./service/razorpay_service')
const maacastController = require('./controller/maacastOrder')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/maacast',{useNewUrlParser: true,useCreateIndex:true})

const publicPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../template/views')
const partialPath = path.join(__dirname,'../template/partials')

app = express()
app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)


//logger = new Logger('app')

app.get('/test',(req,res) => {
    logger.setLogData(req.body)
    logger.info("Request recieved at home", req.body)
    logger.info("Return success response - test", {"success": true})
    res.send('SUCCESS')
})

app.get('/test2',(req,res) => {
    logger.setLogData(req.body)
    logger.info("Request recieved at home", req.body)
    logger.info("Return success response - test2", {"success": true})
    res.send('Test2')
})


// {
// 	"totalAmount": 10,
// 	"receipt": "sujindars25@gmail.com",
// 	"userId": "001",
// 	"restaurantId":"002",
// 	"items": [
// 		{
// 			"itemid":"aaab",
// 			"quantity":"2"
// 		},
// 		{
// 			"itemid":"accb",
// 			"quantity":"2"
// 		}
// 		]
// }
app.get('/initiatePayment',(req,res) => {
    console.log(req.body)
    logger.setLogData(req.body)
    logger.info("Request received for payment", req.body)

    maacastController.createOrder(req.body.userId,req.body.restaurantId,req.body.items,req.body.totalAmount).then((maacastOrder)=>{
        razorpayservice.createOrder(req.body.totalAmount,req.body.receipt).then((order_id)=> {
            maacastOrder.razorPayOrderId = order_id
            maacastOrder.save().then(()=>{
                logger.info("Razor pay order stored in maacast order!")
            }).catch((e)=>{
                logger.error("Could not save razor pay id in maacast order!")
                return res.status(500).send()
            })

            res.send({
                order_id
            })
        }).catch((error)=>{
            maacastController.updatePaymentStatusByRazorPayId(req.body.razorpay_order_id,"Failed!").then(()=>{
                logger.info('Payment status updated successfully')
            }).catch((e)=>{
                logger.error('Payment update failed! Please try again later..')
                return res.status(500).send('Payment update failed! Please try again later..')
            })
            logger.error('Sorry, could not connect with razor pay!')
            res.status(500).send("Sorry, could not connect with razor pay!")
        })

    }).catch((e)=>{
        logger.error('Could not Process the request at the moment!')
        res.status(500).send('Could not Process the request at the moment!')
    })
    
})

app.post('/checkPayment',(req,res) => {

    razorpayservice.checkPayment(req.body.razorpay_payment_id,req.body.razorpay_order_id,req.body.razorpay_signature).then(() => {

        maacastController.updatePaymentStatusByRazorPayId(req.body.razorpay_order_id,"Success").then(()=>{
            logger.info('Payment status updated successfully')
        }).catch((e)=>{
            logger.error('Payment update failed! Please try again later..')
            return res.status(500).send('Payment update failed! Please try again later..')
        })

        res.send("Payment Successful")

    }).catch((error) => {

        maacastController.updatePaymentStatusByRazorPayId(req.body.razorpay_order_id,"Failed!").then(()=>{
            logger.info('Payment status updated successfully')
        }).catch((e)=>{
            logger.error('Payment update failed! Please try again later..')
            return res.status(500).send('Payment update failed! Please try again later..')
        })
        res.send("Payment Failed")
    })    
})

app.get('/orders',(req,res) => {

    if(req.body.deliveryExecutiveId && (req.body.userId || req.body.restaurantId))
    {
        req.status(400).send()
    }
    else if(req.body.deliveryExecutiveId) {
        maacastController.getOrderByDeliveryExecutive(req.body.deliveryExecutiveId).then((orders)=>{
            res.send(orders)
        }).catch((e)=>{
            res.status(500).send()
        })
    }
    else if(req.body.userId && req.body.restaurantId) {
        maacastController.getOrderByUserandRestaurant(req.body.userId,req.body.restaurantId).then((orders)=>{
            res.send(orders)
        }).catch((e)=>{
            res.status(500).send()
        })
    }
    else if(req.body.userId) {
        maacastController.getOrderByUser(req.body.userId).then((orders)=>{
            res.send(orders)
        }).catch((e)=>{
            res.status(500).send()
        })
    }
    else if(req.body.restaurantId) {
        maacastController.getOrderByRestaurant(req.body.restaurantId).then((orders)=>{
            res.send(orders)
        }).catch((e)=>{
            res.status(500).send()
        })
    }
    else {
        res.status(400).send()
    }
})

app.listen(8081, () => {
    logger.info('Server started! running at 8081')
})