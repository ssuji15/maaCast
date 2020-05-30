const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    items: [
        {
            item:   {
                        type:Schema.Types.ObjectId,ref: 'item'
                    },
            quantity:{type:Number,default:1}
        }
    ],
    restaurant: {
        type:Schema.Types.ObjectId,ref: 'restaurant',default:null
    }
    // maybe some price details..
},{collection:'cart'});

CartModel = mongoose.model('Cart',cartSchema);
module.exports = {CartModel};