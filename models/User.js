const mongoose =require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema =new mongoose.Schema({
	username:String,
	password:String
});

// below line makes us easy to implement login and keep password in encoded form 
// show that we have not worry about privacy issue
// basically it adds some methods to our user schema to make login functionality easier

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);