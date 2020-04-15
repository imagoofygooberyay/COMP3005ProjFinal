QUESTIONSPERQUIZ=10;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	first_name:{type: String, required: true},
	last_name:{type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	address:{type: String, required: true},
	type:{type:String},
	carts:[{type: String}],
});


userSchema.statics.userList=function(){

return this.find({privacy:false});

}

//updates the avg_score of a user
userSchema.statics.updateAvg = function(name,avg,callback){

return this.findOneAndUpdate({username:name},{$set:{avg_score:avg}},function(err,result){

});
}

//updates the privacy setting of user
userSchema.statics.updatePriv = function(name,bool,callback){

return this.findOneAndUpdate({username:name},{$set:{privacy:bool}},function(err,result){

});
}

//updates the total score and total quizzes of user
userSchema.statics.updateStats = function(name,correct,callback){

return this.findOneAndUpdate({username:name},{$inc:{total_score:correct,total_quizzes:1}},function(err,result){

});
}
module.exports = mongoose.model("User", userSchema);
