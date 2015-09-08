var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GoddessSchema = new Schema({
	id: Number,
	image_url:  String
});

var EntitySchema = new Schema({
	type: String,
	style_no: String,
	title: String,
	sub_title: String,
	dimension: String,
	price: String,
	thumbnail: String,
	detail_pictures:[String]
});

module.exports.GoddessModel = mongoose.model('GoddessModel', GoddessSchema);
module.exports.EntityModel = mongoose.model('EntityModel', EntitySchema);