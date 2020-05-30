var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var addressSchema= new Schema({
  addresstype:{type:String,default:"Residence"},
  flatNumber:{type:String,required:true},
  apartmentName:{type:String},
  street:{type:String},
  city:{type:String},
  state:{type:String},
  country:{type:String},
  landmark:{type:String},
  pincode:{type:Number,required:true}
},{collection:'address'});
 
AddressModel = mongoose.model('Address',addressSchema);

module.exports={AddressModel};