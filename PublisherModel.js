const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let publisherSchema = Schema({
	pub_name:{type: String, required: true},
	address:{type: String, required: true},
	email: {type: String, required: true},
	phone_num: {type: String, required: true},
	acc_num:{type: String, required: true},
});

module.exports = mongoose.model("publisher", publisherSchema);
