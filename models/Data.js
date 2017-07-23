var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//USER SCHEMA
var DataSchema = mongoose.Schema({
	Imei: {
		type: Number,
	},
	CurrentDateTime: {
		type: Date
	},
	GPSDateTime: {
		type: Date
	},
	Datatype: {
		type: Number
	},
	Address:  {
		type: String
	},
	Distance: {
		type: Number
	}
});

var Data = module.exports = mongoose.model("Data", DataSchema);