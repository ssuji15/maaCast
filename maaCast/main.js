const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./service/logger_service')
const razorpayservice = require('./service/razorpay_service')
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const uuid =  require('uuid');
const maacastController = require('./app/controllers/maacastOrder')
const cart = require('./app/controllers/cart.controller')
const maacastOrder = require('./app/models/maacast_order')
const fs = require('fs')

// const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const store = new MongoDBStore({
    uri: dbConfig.url,
    collection: 'sessions'
});

// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// log all requests
app.use(morgan('dev'));

// parse application/json
app.use(bodyParser.json());

app.use(express.static('./maaCast/public'));

app.use(session({
    secret: 'jsbfiaopgiargiosdn;ogbnk;odfig;oirgn;aoirnv;gozifnhaioubgr;ign;oifnblsizubfkjzbshfilzesugolzesiuflzbglik',
    resave: false,
    saveUninitialized: false,
    store: store,
    name: 'session_cookie',
    cookie: {
                path: '/',
                httpOnly: true,
                maxAge:  1800000
            },
    genid: (req) => {
        // Returns a random string to be used as a session ID
        return uuid.v4();
    }
}));

app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


app.post('/initiatePayment',(req,res) => {
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
        // const mymaacastOrder = maacastOrder.findOne({razorPayOrderId:req.body.razorpay_order_id})
        // cart.emptyCart(mymaacastOrder.userId).then(()=>{
        //     logger.info("Cart cleared successfully!")
        // }).catch(()=>{
        //     return res.status(500).send()
        // })

        res.redirect('order-status.html')

    }).catch((error) => {

        maacastController.updatePaymentStatusByRazorPayId(req.body.razorpay_order_id,"Failed!").then(()=>{
            logger.info('Payment status updated successfully')
        }).catch((e)=>{
            logger.error('Payment update failed! Please try again later..')
            return res.status(500).send('Payment update failed! Please try again later..')
        })
        res.redirect('order-status.html')
    })    
})

app.post('/orders',(req,res) => {



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
        console.log('----------')
        maacastController.getOrderByUser(req.body.userId).then((orders)=>{

            //console.log(orders)

            maacastController.populateOrder(orders).then((newOrderList)=>{

                res.send(newOrderList)

            }).catch((e)=>{
                res.status(500).send()
            })
            
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

require('./app/routes/user.routes.js')(app);
require('./app/routes/cart.routes.js')(app);
require('./app/routes/restaurant.routes.js')(app);
require('./app/routes/address.routes.js')(app);
require('./app/routes/item.routes.js')(app);

// listen for requests
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});

