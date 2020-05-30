const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [
        {
            item:   {
                        type:Schema.Types.ObjectId,ref: 'item'
                    },
            quantity:{type:Number,default:1}
        }
    ],
    restaurant: {type:Schema.Types.ObjectId,ref: 'restaurant',default:null},
    status: {type:String,default:"Pending"}
    // pricing details
},{collection:'orders'});

OrderModel = mongoose.model('Orders',orderSchema);
module.exports = {OrderModel};