const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let bookSchema = Schema({
	isbn: {type: String, required: true},
	title: {type: String, required: true},
	author: [{type: String, required: true}],
	genre:{type:String, required:true},
	pub_name:[{type:String,required:true}],
	price:{type:Number,required:true},
	royalty:{type:Number,required:true},
	tags:[{type:String,required:false}],
	year:{type:String,required:true},
	pages:{type:Number, min: 0,required:true},
	stock:{type:Number, min: 0,required:true}
//	incorrect_answers: [{type: String, required: true}]
});


module.exports = mongoose.model("Book", bookSchema);
