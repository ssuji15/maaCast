const User = require('../models/Users.model.js');
const Address = require('../models/Address.model.js');
const Cart = require('../models/Cart.model.js');
const Order = require('../models/Orders.model.js');
const delivery = require('../models/DeliveryExecutive.model.js');
const logger = require('../../service/logger_service.js');
const format = require('../../service/format.js');

// Create and Save a new User
// send proper message for unique emailid,userid and check password
exports.register = (req, res) => {

    logger.info("Inside register function with userType: {0}".format(req.body.userType));
    const emptyCart = new CartModel({});
    emptyCart.save();
    logger.debug("Cart is created for user: {0}".format(emptyCart));
    const emptyOrder = new OrderModel({});
    emptyOrder.save();
    logger.debug("Order is created for user: {0}".format(emptyOrder));
    // Create a User
    const user = new UserModel({
        userid: req.body.userid,
        password: req.body.password,
        firstName: req.body.fname,
        lastName: req.body.lname,
        contactNumber: req.body.contactNumber,
        userType: req.body.userType,
        emailid: req.body.email,
        cart: emptyCart,
        orders: emptyOrder
    });
    const addressUser = new AddressModel({
        flatNumber: req.body.flatNumber,
        street: req.body.street,
        pincode: req.body.pincode,
        landmark: req.body.locationName
    });

    addressUser.save().then(add =>{
    // Save User in the database
        if(!add)
        {
            logger.info("Address is not created");
            return res.status(200).json({
                flag: false,
                message: err.message
            });
        }
        logger.debug("Address schema is updated :{0}".format(add));
        user.address.push(addressUser);
    user.save()
        .then(data => {
            // modify for login with session
            logger.debug("User is created in the Schema: {0]".format(data));
            if(req.body.userType==="Delivery Executive"){
                logger.info("User is Delivery ");
                const deliveryguy = new DeliveryExecutiveModel({
                    userid: user,
                    vehicleType: req.body.vehicleType,
                    vehicleNumber: req.body.vehicleNumber,
                    //drivingLicense: req.body.drivingLicense

                });
                logger.debug("Delivery is created :{0}".format(deliveryguy));
                deliveryguy.save()
                    .then(result =>{
                        logger.info("Delivery Executive is created");
                        res.status(200).json({
                            flag:true,
                            obj: result
                        });
                    })
                    .catch(err =>{
                            logger.error(err.message);
                            res.status(500).json({
                                flag:false,
                                message: err.message
                            });
                        }
                    );
            }
            else
            {
                logger.info("User is created ");
                res.status(200).json({
                    flag: true,
                    obj: data
                });
            }
        }).catch(err => {
        logger.error(err.message);
        res.status(500).json({
            flag:false,
            message: err.message
        });
    })}).catch(err =>{
        res.status(200).json({
            flag:false,
            message:err.message
        })
    });

};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    logger.info("Inside findAll function");
    UserModel.find()
    .then(users => {
        logger.info("List of restaurants is fetched");
        res.send(users);
    }).catch(err => {
        logger.debug(err.message);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single User with a id
exports.findOne = (req, res) => {

    logger.info("Inside Findone function");
    UserModel.find({__id : req.body.userid})
    .then(user => {
        if(!user) {
            logger.info("User not found");
            return res.status(404).send({
                message: "User not found with id " + req.body.userid
            });            
        }
        logger.info("User Object is fetched ");
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.info("User not found");
            return res.status(404).send({
                message: "User not found with id " + req.body.userid
            });                
        }
        logger.error(err.message);
        return res.status(500).send({
            message: "Error retrieving user with id " + req.body.userid
        });
    });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    logger.info("Inside update function");
    if(!req.body) {
        logger.error("Reqpuest body is empty");
        return res.status(400).send({
            message: "User body can not be empty"
        });
    }

    // Find User and update it with the request body
    UserModel.updateOne({userid:req.body.userid}, req.body, {new: false})
    .then(user => {
        if(!user) {
            logger.info("User details not found");
            return res.status(404).send({
                message: "User not found with id " + req.body.userid
            });
        }
        logger.info("User details is updated");
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.info("User not found");
            return res.status(404).send({
                message: "User not found with id " + req.body.userid
            });                
        }
        logger.error(err.message);
        return res.status(500).send({
            message: "Error updating User with id " + req.body.userid
        });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    logger.info("Inside Delete function");
    UserModel.deleteOne({userid:req.body.userid})
    .then(user => {
        if(!user) {
            logger.info("User not found");
            return res.status(404).send({
                message: "User not found with id " + req.body.userid
            });
        }
        logger.info("User is deleted successfully");
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            logger.info("User not found");
            return res.status(404).send({
                message: "User not found with id " + req.body.userid
            });                
        }
        logger.error(err.message);
        return res.status(500).send({
            message: "Could not delete User with id " + req.body.userid
        });
    });
};

exports.login = (req, res) => {
    logger.info("Inside Login function");
    UserModel.findOne({emailid: req.body.emailid})
    .then( user => {
        if(user !== null) 
        {
            if(user.password !== req.body.password)
            {
                res.status(200).json({
                    flag: false,
                    message: "Please check your email or password"
                });
            }

            logger.debug(" User is present for user :{0}  Now creating session".format(user));
            req.session.user = {
                email: user.emailid,
                name: user.userid,
                userType: user.userType
            };
            logger.info("Session is created");
            res.status(200).json({
                flag:true,
                obj: user
            });
        } 
        else 
        {
            logger.info("User not found with emailid");
            return res.status(200).json({
                flag:false,
                message: "Please check your email or password"
            });  
        }
    })
    .catch(err => {
        logger.error(err.message);
        res.status(200).json({
            flag:false,
            message : err.message
        });
    });
};

exports.logout = (req, res) => {

    logger.info("Inside logout function");
    console.log(req.session.user);
    if(req.session.user) 
    {
        logger.debug(" Session is present ");
        var name = req.session.user.name;
        logger.info("Session is deleted");
        delete req.session.user;
        logger.info("User logout");
        res.status(200).json({
            flag:true,
            message:"User logged out"
        })
    } 
    else 
    {
        logger.info("user logout without session");
        res.status(500).json({
            flag:false,
            message : "User logout without session"
        })
    }        
};

exports.sessionCheck = (req,res) =>{
    logger.info("Inside SessionCheck Function");
    UserModel.findOne({userid: req.session.user.name}).then(
        user => {
            if(!user)
            {
                logger.info("User not found");
                return res.status(200).json({
                    flag: false,
                    message: "User not found"
                });
            }
            logger.info("User already login");
            res.status(200).json({
                flag: true,
                obj: user
            })
        }
    ).catch(err =>{
        logger.error(err.message);
        res.status(200).json({
            flag:false,
            message : err.message
        })
    })
    
};