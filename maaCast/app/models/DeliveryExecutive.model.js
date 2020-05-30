var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deliveryExecutiveSchema= new Schema({
  userid:{type:Schema.Types.ObjectId,ref:'users',required:true},
  vehicleType:{type:String,required:true},
  vehicleNumber:{type:String,required:true},
 // drivingLicense:{type:binData,required:true}
},{collection:'deliveryExecutive'});
 
DeliveryExecutiveModel = mongoose.model('DeliveryExecutive',deliveryExecutiveSchema);

module.exports={DeliveryExecutiveModel};