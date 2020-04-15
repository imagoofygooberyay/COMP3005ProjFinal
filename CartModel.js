const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let cartSchema = Schema({
	_id:{type: String, required: true},
	date:{type:String,required:true},
	shipping_address:{type:String,required:true},
	payment_info:{type:String,required:true},
	status:{type:String,required:true},
	contents:[{type: String}]


});


cartSchema.statics.updateStat = function(cart,stat,callback){
//console.log(stat)
//console.log(cart)

return this.findOneAndUpdate({_id:cart},{$set:{status:stat}},{useFindAndModify:false},function(err,result){

});

}

cartSchema.statics.test = function(cart,callback){
//console.log(stat)
//console.log(cart)

return this.findOne({_id:cart},function(err,result){
	return result
});

}





module.exports = mongoose.model("Cart", cartSchema,"carts");
