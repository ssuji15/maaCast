const Menu = require('../models/Menu.model.js');
const itemList = require('../models/Item.model.js');
const user = require('../models/Users.model.js');
const restaurant = require('../models/Restaurants.model.js');
const logger = require('../../service/logger_service');
const format = require('../../service/format.js');

//Function used to create item and add that item to the menu
exports.create = (req, res) => {

    logger.info("Creating an Item and assign it to menu");
    UserModel.find({userid: req.body.userid}).
    then(user =>{

        if(user){
            logger.debug("Owner is present  "+user);
            RestaurantModel.find({owner: user}).select(' menu').
            then(rest => {



                if(rest.length)
                {
                    logger.debug("Restaurant is present  "+rest);
                    logger.info("Restaurant Object in menu/create ",rest);

                    const item = new ItemModel({
                        name: req.body.name,
                        price: req.body.price,
                        quantity: req.body.quantity,
                        description: req.body.description

                    });

                    item.save().
                    then(data =>{
                        if(data){
                            logger.debug("Item is created in menu/create: {0}".format(data));
                            MenuModel.findOne({_id: req.body.menuid}).
                            then(menuitem =>{
                                logger.debug("Finding MenuId to link with items: {0}".format(menuitem));
                                menuitem.item.push(data);
                                menuitem.save().then(me  =>{
                                    logger.info("Item is created and link with menu ");
                                    res.status(200).json({
                                        flag:true,
                                        obj:me
                                    });
                                });
                            })


                        }else{
                            logger.info("no Item is created");
                            res.status(404).json({
                                flag:false,
                                message: err.message
                            })
                        }
                    }).
                    catch(err =>{
                        logger.error(err.message);
                        res.status(500).json({
                            flag: false,
                            message: err.message
                        })
                    });
                }else{
                    logger.info("Restaurant not found");
                    res.status(404).json({
                        flag:false,
                        message: err.message
                    })
                }
            }).
            catch(err =>{
                logger.error(err.message);
                res.status(500).json({
                    flag: false,
                    message : err.message
                })
            });
        }else{
            logger.info("User not found with userid: {0}".format(req.body.userid));
            res.status(404).json({
                flag: false,
                message : err.message
            })
        }
    }).
    catch(err => {
        logger.error(err.message);
        res.status(500).json({
            flag: false,
            message :err.message})
    });
};
//this function call by Owner to see the menu
exports.findMenu = (req,res) =>{
    logger.info("FindMenu function for viewing all the items of particular Restaurant");
    UserModel.findOne({userid: req.body.userid}).then(user =>{
        if(user){
            logger.debug("User is found with user: {0}".format(user));
            RestaurantModel.findOne({owner: user}).select('menu')
            .then(rest =>{
                if(rest){
                    logger.debug("Restaurant was found with restaurant: {0}".format(rest));
                    MenuModel.find({_id: req.body.menuid})
                    .then(data => {
                        logger.debug("Menu was found with menu: {0}".format(data));
                        ItemModel.find({_id: {$in: data[0]['item']}}, function(err,itemList){
                            logger.info("List of Items was found ");
                            return res.status(200).json({
                                flag: true,
                                obj: itemList
                            });
                        }).catch(err =>{
                            logger.error(err.message);
                            res.status(500).json({
                                flag: false,
                                message: err.message
                            });
                        });
                        // .then( itemList =>{
                        //     console.log(itemList);
                        //     return res.status(200).send(itemList);
                        // })
                })}
                else {
                    logger.info("Restaurant Object was not found");
                    return res.status(404).json({
                        flag:false,
                    message: err.message
                    });
                }
            })
            .catch(err =>{
                logger.error(err.message);
                res.status(500).json({
                    flag: false,
                    message : err.message
                });
            })
        }
        else{
            logger.info("User Object not found");
            return res.status(404).json({
                flag: false,
                message : err.message});
        }
    })
    .catch(err => {
        logger.error(err.message);
        res.status(500).json({
            flag: false,
            messgae : err.message
        });
    })
};

exports.findMenuItem = (req,res) =>{

    logger.info("Inside FindMenuItem function");
    MenuModel.find({_id: req.body.menuid}).
    then(menus => {
        if(!menus)
        {
            logger.info("Menu not found");
            res.status(404).json({
                flag:false,
                message: "Menu not found"
            });
        }
        logger.debug("Menu Object is fetched :{0}".format(menus));
        ItemModel.find({_id: {$in: menus[0]['item']}}, function(err,itemList){
            logger.info("List of Items was found ");
            return res.status(200).json({
                flag: true,
                obj: itemList
            });
        }).catch(err =>{
            logger.error(err.message);
            res.status(500).json({
                flag: false,
                message: err.message
            });
        });


    }).
    catch(err =>{
        res.status(500).json({
            flag: false,
            message: err.message
        })
    })
};

exports.findAllItem = (req,res) =>{

    MenuModel.remove().then(data =>{
        res.status(200).json(data);
    })
};