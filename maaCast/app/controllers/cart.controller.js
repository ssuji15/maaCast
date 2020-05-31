const Item = require('../models/Item.model.js');
const User = require('../models/Users.model.js');
const Restaurant = require('../models/Restaurants.model.js');
const logger = require('../../service/logger_service.js');
const format = require('../../service/format.js');
const cart = require('../models/Cart.model.js');
const maaCastOrder = require('../models/maacast_order')
exports.addItem = (req, res) => {

    logger.info("Inside addItem function ");
    ItemModel.findOne({_id : req.body.itemid})
    .then(item => {
        if(!item) {
            logger.info(" Item mot found with itemid: {0}".format(req.body.itemid));
            return res.status(404).json({
                flag:false,
                message: err.message
            });            
        }
        
        logger.debug("Item is fetch with item:{0}".format(item));
        RestaurantModel.findOne({_id : req.body.restaurantid})
        .then(restaurant => {
            if(!restaurant) {
                logger.info(" Restaurant not found eith restaurantid: {0}".format(req.body.restaurantid));
                return res.status(404).json({
                    flag: false,
                    message: err.message
                });            
            }

            logger.debug("Restuarnt Object is fetched with restaurant: {0}".format(restaurant));
            UserModel.findOne({userid : req.body.userid})
            .then(user => {
                if(!user) {
                    logger.info("User not found with userid: {0}".format(req.body.userid));
                    return res.status(404).json({
                        flag: false,
                        message: err.message
                    });
                }
                logger.debug("User Object is fetched with userid:{0]".format(user));
                CartModel.findOne({'_id' : user['cart']})
                .then(cart => {
                    logger.debug("Cart is fetchedn from user object: {0}".format(cart));
                    if(cart['items'].length == 0 || (cart['restaurant'] == req.body.restaurantid))
                    {
                        cart['items'].push({
                            item:item,
                            quantity:req.body.quantity
                        });
                        cart['restaurant'] = restaurant['_id'];

                        logger.debug("Restaurant id is updated in cart: {0}".format(cart));
                        cart.save()
                        .then(data => {
                            logger.info("New Item is added in Cart");
                            return res.status(200).json({
                                flag: true,
                                obj: data
                            })
                        })
                        .catch(err => {
                            logger.error(err.message);
                            return res.status(500).json({
                                flag: false,
                                message: err.message
                            });
                        });
                    }
                    else
                    {
                        logger.info("Cannot add Items from Different Restaurants");
                        return res.status(500).json({
                            flag: false,
                            message: err.message
                        });
                    }
                })
                .catch(err => {
                    logger.error(err.message);
                    return res.status(404).json({
                        flag: false,
                        message: err.message
                    });
                });
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    logger.info("User not found with userid:{0}".format(req.body.userid));
                    return res.status(404).json({
                        flag: false,
                        message: err.message
                    });                
                }
                logger.error(err.message);
                return res.status(500).json({
                    flag: false,
                    message: err.message
                });
            });

        }).catch(err => {
            if(err.kind === 'ObjectId') {
                logger.info("User not found with userid:{0}".format(req.body.userid));
                return res.status(404).json({
                    flag: false,
                    message: err.message
                });                
            }
            logger.error(err.message);
            return res.status(500).json({
                flag: false,
                message: err.message
            });
        });

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.info("User not found with userid:{0}".format(req.body.userid));
            return res.status(404).json({
                flag: false,
                message: err.message
            });                
        }
        logger.error(err.message);
        return res.status(500).json({
            flag: false,
            message: err.message
        });
    });
};

exports.deleteItem = (req, res) => {

    logger.info("Inside DeleteItem function");
    UserModel.findOne({userid : req.body.userid})
    .then(user => {

        if(!user) {
            logger.info("User Object not found with userid: {0}".format(req.body.userid));
            return res.status(404).json({
                flag: false,
                message: err.message
            });
        }

        logger.debug("User Object is fetched with user: {0}".format(user));

        CartModel.findOneAndUpdate({'_id' : user['cart']},{$pull : {items : {item : req.body.itemid}}},{new: true})
        .then(data => {
            logger.info("Item is Removed from Cart");
            return res.status(200).json({
                flag: true,
                message: data + "Removed item"
            });
        })
        .catch(err => {
            logger.error(err.message);
            return res.status(404).json({
                flag:false,
                message:  err.message
            });
        })
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.info("User Object not found witb userid: {0}".format(req.body.userid));
            return res.status(404).json({
                flag: false,
                message: err.message
            });                
        }
        logger.error(err.message);
        return res.status(500).json({
            flag: false,
            message: err.message
        });
    });
};

exports.updateQuantity = (req, res) => {
    logger.info("Inside updateQuantity function");
    UserModel.findOne({userid : req.body.userid})
    .then(user => {
        if(!user) {
            logger.info("User object not found");
            return res.status(404).json({
                flag : false,
                message: err.message
            });
        }

        logger.debug("User Object is fetched with user: {0}".format(user));
        CartModel.findOneAndUpdate({'_id' : user['cart'] ,'items.item' : req.body.itemid},{$set : {'items.$.quantity' : req.body.quantity}},{new:true})
        .then(data => {
            logger.info(" Quantity of item in cart is updated");
            return res.status(200).json({
                flag: true,
                message: "Updated item"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId') {
                logger.info("Item not found with itemid: {0}".format(req.body.itemid));
                return res.status(404).json({
                    flag: false,
                    message:err.message
                });                
            }
            logger.error(err.message);
            return res.status(500).json({
                flag : false,
                message: err.message
            }); 
        })
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.info("User Object not found".format(req.body.userid));
            return res.status(404).json({
                flag: false,
                message:err.message
            });                
        }
        logger.error(err.message);
        return res.status(500).json({
            flag : false,
            message: err.message
        });
    });
};

exports.viewCart = (req, res) => {
    CartModel.aggregate([
         { 
             "$match":
             {
                 "_id": ObjectId(req.body.cartid)
             }
         },
        {
            "$lookup":
            {
                "from" : "item",
                "localField": "items.item",
                "foreignField": "_id",
                "as": "Items"
            }
        },
        { "$unwind": "$Items" }
    ])
    .then(cart => {
        res.status(200).json({
            flag: true,
            obj: cart
        })
    })
    .catch(err => {
        res.status(500).json({
            flag: false,
            message: err.message
        })
    })
};

exports.emptyCart = (userid) => {
    // above _id is userId

    return new Promise((resolve,reject)=>{

    const user = UserModel.findOne({userid})

    const cart = CartModel.findOneAndUpdate({'_id' : user['cart']},{
        restaurant: undefined,
        items:[]
    },(err,res) => {
        if(err) {
            logger.error('Database Error! - Could not clear cart')
            return reject()
        }
        logger.info("Cart clearted Successfully")
        resolve()
    })

    })
}
