var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema= new Schema
(   {
        userid:{type:String,index:true,unique:true,trim:true,required:true},
        password:{type:String,required:true,match: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[a-zA-Z0-9]{6,20}$/}, ///^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,20}$/
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        contactNumber:{type:String,required:true},
        //idProof:{type:binData},
        userType:{type:String,default:"Consumer"},
        emailid:{type:String,required:true,unique:true,match: /.+\@.+\..+/,index:true},
        address: [
            {type:Schema.Types.ObjectId,ref:'address',required:true}
        ],
        orders: {type:Schema.Types.ObjectId,ref:'orders'},
        cart: {type:Schema.Types.ObjectId,ref:'cart'}
    },
    {collection:'users'}
);

UserModel = mongoose.model('Users',usersSchema);
module.exports={UserModel};