var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GoddessSchema = new Schema({
	index: Number,
	image_url:  String
});

var DesignSchema = new Schema({
	index: Number,
	image_url:  String
});

var EntitySchema = new Schema({
	type: String,
	style_no: String,
	title: String,
	sub_title: String,
	dimension: String,
	price: String,
	detail_pictures:[String]
});

module.exports.GoddessModel = mongoose.model('GoddessModel', GoddessSchema);
module.exports.EntityModel = mongoose.model('EntityModel', EntitySchema);
module.exports.DesignModel = mongoose.model('DesignModel', DesignSchema);