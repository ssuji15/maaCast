const restaurant = require('../models/Restaurants.model.js');
const user = require('../models/Users.model.js');
const address = require('../models/Address.model.js');
const logger = require('../../service/logger_service.js');
const format = require('../../service/format.js');

exports.create = (req,res) => {

    UserModel.findOne({userid: req.body.userid})
    .then(user => {

        logger.debug("USER OBJECT IN /restaurant/create ___ ",user);
        if(!user) {
            logger.error("USER NOT FOUND WITH ID : {0} /restaurant/create ___".format(req.body.userid));
            return res.status(404).json({
                flag:false,
                message: "User not found with id " + req.body.userid
            });
        }

        logger.info("ADDRESS OBJECT BEING CREATED /restaurant/create ___ ");
        //Add other fields that are present in addressmodel
        const add = new AddressModel({
            flatNumber: req.body.flatNumber,
            street: req.body.street,
            pincode: req.body.pincode,
            landmark: req.body.locationName,
            city: req.body.city
        });
        logger.debug("ADDRESS OBJECT CREATED /restaurant/create ___ ",add);
        add.save();
        
        logger.info("ADDRESS OBJECT SAVED /restaurant/create ___ ");

        logger.info("INITIALISING EMPTY MENU /restaurant/create ___ ");
        const emptyMenu = new MenuModel({});
        logger.debug("EMPTY MENU /restaurant/create __",emptyMenu);
        emptyMenu.save();
        logger.info("CREATED EMPTY MENU /restaurant/create ___ ");

        logger.info("RESTAURANT MODEL BEING CREATED /restaurant/create ___ ");
        const rest = new RestaurantModel({
            restaurantName: req.body.name,
            Latitude: req.body.latitude,
            Longitude: req.body.longitude,
            GSTIN: req.body.gstinnumber,
            contactNumber: req.body.contactnumber,
            emailid: req.body.emailid,
            owner: user._id,
            address: add._id,
            menu: emptyMenu
        });
        logger.debug("RESTAURANT MODEL /restaurant/create ___ ",rest);

        rest.save()
        .then(restaurant => {
            logger.info("RESTAURANT MODEL CREATED /restaurant/create ___");
            res.status(200).json({
                flag:true,
                obj:restaurant
            });
        })
        .catch(err => {
            logger.error(err.message);
            res.status(500).json({
                flag:false,
                message: err.message
            });
        });

    })
    .catch(err =>{
        logger.error(err.message);
        res.status(500).json({ 
            flag:false,
            message: err.message
        });
    });
};

exports.findAll = (req, res) => {
    // find by features to be added ..

    logger.info("FINDING RESTAURANTS /restaurant/list ___ ");
    // RestaurantModel.find({})
    // .then(restaurants => {
    //     logger.debug("RESTAURANTS /restaurant/list ___ ",restaurants);
    //     res.status(200).json({
    //         flag:true,
    //         obj:restaurants
    //     });
    // }).catch(err =>{
    //     logger.error(err.message);
    //     return res.status(500).json({
    //         flag:false,
    //         message: err.message
    //     })
    // });
    console.log(req.body.city);
    RestaurantModel.aggregate([
        {
            $lookup:
            {
                "from" : "address",
                "localField": "address",
                "foreignField": "_id",
                "as": "Address"
            }
        },
        { "$unwind": "$Address" },
        { "$match": { "Address.city": req.body.city } }
    ])

    .then(restaurants => {
        console.log(restaurants);
        res.status(200).json({
            flag:true,
            obj: restaurants
        })
    })
    .catch(err => {
        res.status(500).json({
            flag:false,
            message: err.message
        })
    })
    logger.info("FOUND RESTAURANTS /restaurant/findall ___ ");
};

//Update operation with default restaurantID and contactNumber
exports.update = (req,res) => {
    if(!req.body) {
        logger.error("EMPTY BODY /restaurant/update ___");
        return res.status(400).json({
            flag:false,
            message: "Restaurant body can not be empty"
        });
    }

    logger.info("UPDATING RESTAURANT /restaurant/update ___")
    RestaurantModel.updateOne({_id:req.body.restaurantid}, req.body, {new: false})
    .then(restaurant => {
        if(!restaurant) {
            logger.error("RESTAURANT NOT FOUND WITH ID : {0} /restaurant/update ___ ".format(req.body.restaurantid));
            return res.status(404).json({
                flag:false,
                message: "Restaurant not found with id " + req.body.restaurantid
            });
        }
        logger.debug("RESTAURANT OBJECT /restaurant/update ___ ",restaurant);
        logger.info("UPDATED RESTAURANT /restaurant/update ___ ");
        res.status(200).json({
            flag:true,
            obj:restaurant
        });
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

// Delete a Restaurant with the specified id in the request
exports.delete = (req, res) => {

    logger.info("DELETING RESTAURANT /restaurant/delete ___ ");
    RestaurantModel.deleteOne({_id:req.body.restaurantid})
    .then(restaurant => {
        if(!restaurant) {
            logger.error("RESTAURANT OBJECT NOT FOUND WITH ID : {0} /restaurant/delete ___ ".format(req.body.restaurantid));
            return res.status(404).json({
                flag:false,
                message: "Restaurant not found with id " + req.body.restaurantid
            });
        }

        logger.debug("RESTAURANT OBJECT /restaurant/delete ___ ",restaurant);
        logger.info("DELETED RESTAURANT /restaurant/delete ___ ");
        res.status(200).json({
            flag:true,
            message: "Restaurant deleted successfully!"
        });
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
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

exports.viewDetails = (req,res) =>{

        console.log(req.body.userid);
        UserModel.findOne({userid : req.body.userid}).
        then(user =>{
            if(!user) {
                console.log(user);
                return res.status(404).json({
                    flag: false,
                    message: "User not found with id " + req.body.userid
                });
            }
            RestaurantModel.findOne({owner: user}).populate('Address').
                then(rest =>{
                    if(!rest)
                    {
                        return res.status(404).json({
                            flag: false,
                            message: "Restaurant not found with id " + req.body.userid
                        });
                    }
                    logger.info("Restaurant details found");
                    res.status(200).json({
                        flag : true,
                        obj: rest
                    })
            }).
            catch(err =>{
                logger.error(err.message);
                res.status(500).json({
                    flag: false,
                    message: err.message
                })
            })
        })
        .catch(err =>{
          logger.error(err.message);
          res.status(500).json({
              flag: false,
              message: err.message
          })
        });
};