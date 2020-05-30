const mongoose = require('mongoose');
const schema = mongoose.Schema;

const menuSchema = new schema({
        item:[{
            type: schema.Types.ObjectId,ref:"item",required:true,unique:true
        }]
},{collection:"menu"});

MenuModel = mongoose.model('Menu',menuSchema);
module.exports ={MenuModel};