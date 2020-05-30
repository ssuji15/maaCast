const itemList = require('../models/Item.model.js');
const user = require('../models/Users.model.js');
const restaurant = require('../models/Restaurants.model.js');
const menus = require('../models/Menu.model.js');
const logger = require('../../service/logger_service.js');
const format = require('../../service/format.js');

// Not being called
exports.create = (req, res) => {

    const item = new Item({

    });
};

//Function used to update the item inside menu
exports.update = (req, res) => {
    logger.info("Update function used to update items");
    UserModel.find({userid: req.body.userid}).then( user => {
        if(user){
            logger.debug("Owner is present  "+user);
            RestaurantModel.find({owner:user}).select('menu')
                .then(rest => {
                if(rest){
                    logger.debug("Restaurant is present  "+rest);
                    ItemModel.update({'_id' : req.body.itemid}, {
                        $set:{ name: req.body.name, price: req.body.price,
                        quantity: req.body.quantity, description: req.body.description}
                    }).then(data => {
                        logger.info("Item is updated with itemid:{0}".format(req.body.itemid));
                        res.status(200).json({
                            flag:true,
                            message:" Item is updated"
                        });
                    }).catch(err => {
                        logger.error(err.message);
                        res.status(500).json({
                            flag:false,
                            message : err.message
                        });
                    });
                }else{
                    logger.info("Restaurant Object was not found");
                    return res.status(404).json({
                        flag: false,
                        message: err.message
                    });
                }
            }).
            catch(err =>{
                logger.error(err.message);
                res.status(500).json({
                    flag: false,
                    message : err.message
                });
            });
        }else{
            logger.info("User Object was not found");
            return res.status(404).json({
                flag: false,
                message: err.message
            });
        }
    }).
    catch(err => {
        logger.error(err.message);
        res.status(500).json({
            flag: false,
            messgae : err.message
        });
    });
} ;


//function used to remove item from menu
exports.deleteItem = (req,res) =>{
    logger.info("Inside delete Item function");
   ItemModel.deleteOne({_id: req.body.itemid})
   .then(data => {
       logger.debug("Item is deleted with item :{0}".format(data));
       MenuModel.findOne({_id: req.body.menuid})
       .then(menu =>{
           logger.debug("Updating menu :{0}".format(menu));
           menu.item.pull({_id: req.body.itemid});
           menu.save()
           .then(data =>{
               logger.info("Item is deleted and menu is updated");
               res.status(200).json({
                   flag: true,
                   obj: data
               });
           })
           .catch(err => {
               logger.error(err.message);
               return res.status(500).json({
                   flag: false,
                   message : err.message
               });
           });
       })
       .catch(err => {
           logger.error(err.message);
            return res.status(500).json({
                flag: false,
                message : err.message
            });
       });
   })
   .catch(err => {
       logger.error(err.message);
        return res.status(500).json({
            flag: false,
            message : err.message
        });
   });
};