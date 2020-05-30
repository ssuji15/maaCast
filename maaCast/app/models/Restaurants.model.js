var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantsSchema= new Schema
(   {
        restaurantName:{type:String,required:true},
        Latitude:{type:String,required:true},
        Longitude:{type:String,required:true},
        GSTIN:{type:String,required:true},
        contactNumber:{type:String,unique:true,required:true},
        emailid:{type:String,required:true,unique:true,match: /.+\@.+\..+/,index:true},
        owner:{type:Schema.Types.ObjectId,ref:'users',required:true},
        address: {type:Schema.Types.ObjectId,ref:'address',required:true},
        menu: {type:Schema.Types.ObjectId,ref:'menu'},
        orders: [{type:Schema.Types.ObjectId,ref:'orders'}]
    },
    {collection:'restaurants'}
);

RestaurantModel = mongoose.model('Restaurants',restaurantsSchema);
module.exports={RestaurantModel};