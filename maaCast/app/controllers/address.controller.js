const Item = require('../models/Item.model.js');
const User = require('../models/Users.model.js');
const Restaurant = require('../models/Restaurants.model.js');
const Address = require('../models/Address.model.js');
const logger = require('../../service/logger_service.js');
const format = require('../../service/format.js');

exports.addAddress = (req, res) => {
    logger.info("ADDING ADDRESS /users/address/add __ ");
    UserModel.findOne({userid : req.body.userid})
    .then(user => {

        if(!user) {
            logger.error("USER OBJECT NOT FOUND WITH ID : {0} /users/address/add __ ".format(req.body.userid));
            return res.status(404).json({
                flag:false,
                message: "User not found with id " + req.body.userid
            });
        }

        logger.debug("USER OBJECT /users/address/add __ ",user);
        logger.info("CREATING ADDRESS OBJECT /users/address/add __ ");
        const addressUser = new AddressModel({
            flatNumber: req.body.flatNumber,
            street: req.body.street,
            pincode: req.body.pincode,
            landmark: req.body.locationName
        });

        logger.debug("ADDRESS OBJECT /users/address/add __ ",addressUser);
        addressUser.save()
        .then(address => {

            logger.info("CREATED ADDRESS OBJECT /users/address/add __ ");
            user.address.push(address);
            user.save();
            logger.info("ADDED ADDRESS OBJECT TO USER /users/address/add __ ");

            res.status(200).json({
                flag:true,
                obj: user
            });
        })
        .catch(err => {
            logger.error(err.message);
            return res.status(500).json({
                flag : false,
                message: err.message
            })
        })
        
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            logger.error(err.message);
            return res.status(404).json({
                flag: false,
                message: "User not found with id " + req.body.userid
            });                
        }

        logger.error(err.message);
        return res.status(500).json({
            flag:false,
            message: "Error updating User with id " + req.body.userid
        });
    });
};

exports.deleteAddress = (req, res) => {

    logger.info("DELETING ADDRESS /users/address/delete __ ");
    AddressModel.deleteOne({_id : req.body.addressid})
    .then(address => {

        logger.debug("ADDRESS OBJECT /users/address/delete __ ",address);
        UserModel.findOne({userid : req.body.userid})
        .then(user => {
            logger.debug("USER OBJECT /users/address/delete __ ",user);
            user.address.pull({_id : req.body.addressid});

            logger.info("DELETED ADDRESS /users/address/delete __ ");
            user.save();

            logger.info("SAVED UPDATED USER /users/address/delete __ ");
            return res.status(200).json({
                flag:true,
                message: " Address Deleted "
            })
        })
        .catch(err => {
            logger.error(err.message);
            return res.status(500).json({
                flag:false,
                message: err.message
            });
        })
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            logger.error(err.message);
            return res.status(404).json({
                flag:false,
                message: "Address not found with id " + req.body.addressid
            });                
        }

        logger.error(err.message);
        return res.status(500).json({
            flag:false,
            message: "Error retrieving Address with id " + req.body.addressid
        });
    });
};

exports.updateAddress = (req, res) => {

    logger.info("FINDING USER /users/address/update __ ");
    UserModel.findOne({userid : req.body.userid})
    .then(user => {

        if(!user) {
            logger.error("USER NOT FOUND WITH ID : {0} /users/address/update __ ".format(req.body.userid));
            return res.status(404).json({
                flag:false,
                message: "User not found with id " + req.body.userid
            });
        }

        logger.debug("USER OBJECT /users/address/update __ ",user);
        logger.info("UPDATING ADDRESS /users/address/update __ ");
        AddressModel.updateOne({_id:req.body.addressid}, req.body, {new: true})
        .then(address => {
            logger.info("UPDATED ADDRESS /users/address/update __ ");

            res.status(200).json({
                flag:true,
                obj: address
            });
        })
        .catch(err => {
            logger.error(err.message);
            if(err.kind === 'ObjectId') {
                logger.error(err.message);
                return res.status(404).json({
                    flag:false,
                    message: err.message
                });                
            }

            logger.error(err.message);
            return res.status(500).json({
                flag:false,
                message: err.message
            }); 
        })
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.error(err.message);
            return res.status(404).json({
                flag:false,
                message: err.message
            });                
        }

        logger.error(err.message);
        return res.status(500).json({
            flag:false,
            message: err.message
        });
    });
};

exports.updateRestaurantAddress = (req, res) => {

    logger.info("FINDING USER /restaurant/address/update __ ");
    UserModel.findOne({userid : req.body.userid})
    .then(user => {

        logger.debug("USER OBJECT /restaurant/address/update __",user);
        logger.info("FINDING RESTAURANT /restaurant/address/update __");
        RestaurantModel.findOne({_id : req.body.restaurantid})
        .then(restaurant => {
            if(!restaurant) {
                logger.error("RESTAURANT NOT FOUND WITH ID : {0} /restaurant/address/update __",req.body.restaurantid);
                return res.status(404).json({
                    flag:false,
                    message: "Restaurant not found with id " + req.body.restaurantid
                });
            }

            logger.debug("RESTAURANT OBJECT /restaurant/address/update __",restaurant);
            logger.info("RESTAURANT-USER VALIDATION /restaurant/address/update __");
            if(restaurant.owner.userid != user.userid)
            {
                logger.error("INVALID RESTAURANT UPDATE BU USER WITH ID : {0} /restaurant/address/update __".format(req.body.userid));
                return res.status(500).json({
                    flag:false,
                    message: "Invalid Access " + req.body.userid
                });
            }

            logger.info("FINDING ADDRESS /restaurant/address/update __");
            AddressModel.updateOne({_id:req.body.addressid}, req.body, {new: true})
            .then(address => {
                logger.info("UPDATED ADDRESS /restaurant/address/update __");
                res.status(200).json({
                    flag:true,
                    obj: address
                })
            })       
            .catch(err => {
                if(err.kind === 'ObjectId') {
                    logger.error(err.message);
                    return res.status(404).json({
                        flag:false,
                        message: err.message
                    });                
                }

                logger.error(err.message);
                return res.status(500).json({
                    flag:false,
                    message: err.message
                }); 
            })
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                logger.error(err.message);
                return res.status(404).json({
                    flag:false,
                    message: err.message
                });                
            }

            logger.error(err.message);
            return res.status(500).json({
                flag:false,
                message: err.message
            });
        });
    })
    .catch(err =>{
        if(err.kind === 'ObjectId') {
            logger.error(err.message);
            return res.status(404).json({
                flag:false,
                message: err.message
            });                
        }

        logger.error(err.message);
        return res.status(500).json({
            flag:false,
            message: err.message
        });
    });
};