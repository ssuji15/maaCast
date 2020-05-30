const mongoose = require('mongoose');
const schema = mongoose.Schema;

const itemSchema = new schema(
    {
        name:{type:String,required:true},
        price:{type: Number,required:true},
        quantity: {type:Number,required: true},
        description: {type: String}
    },{collection:'item'}
);

ItemModel = mongoose.model('Item', itemSchema);
module.exports ={ItemModel};