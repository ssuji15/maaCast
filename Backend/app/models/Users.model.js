var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema= new Schema
(   {
        userid:{type:String,index:true,unique:true,trim:true,required:true},
        password:{type:String,required:true,match: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,20}$/},
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        contactNumber:{type:String,required:true},
        //idProof:{type:binData},
        userType:{type:String,default:"Consumer"},
        emailid:{type:String,required:true,match: /.+\@.+\..+/,index:true}
    },
    {collection:'users'}
);

usersSchema.statics.getId=function(_userid,cb){
    console.log("userid"+_userid);
    return UserModel.find({ userid: new RegExp(_userid, 'i') },{userid:1,_id:1}, cb);
};

usersSchema.methods.getUserId=function(_userid,cb){
    console.log("userid"+_userid);
    return UserModel.find({ userid: new RegExp(_userid, 'i') },{userid:1,_id:1}, cb);
};

UserModel = mongoose.model('Users',usersSchema);
module.exports={UserModel};