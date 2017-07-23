var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var fs = require("fs")
var convertExcel = require('excel-as-json').processFile
var mongo = require("mongodb");
var mongoose = require("mongoose");
var Data = require("./models/Data");
var db = require("./db");

var app = express()

mongoose.connect("mongodb://localhost:27017/node-test");
collection = mongoose.connection.collection('data');

convertExcel("logging.xlsx", "logging.json")
data = fs.readFileSync("logging.json")
var jsonData = JSON.parse(data)
jsonData.forEach((unit) => {
	var newUnit = new Data({
		Imei: unit.Imei, 
		CurrentDateTime: unit.CurrentDateTime,
		Datatype: unit.Datatype,
		GPSDateTime: unit.GPSDateTime,
		Address: unit.Address,
		Distance: unit.Distance
	})
	newUnit.save()
})

//BODYPARSER MIDDLEWARE
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

//VIEW ENGINE
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")))

	// node_xj({
 //    		input: "./logging.xlsx",  // input xlsx
 //    		output: "./output.json" // output json 
 //  		}, function(err, result) {
 //    			if(err) {
 //      				console.log(err);
 //    			} else {
 //    				var content = result
 //    			}
 //  		});

//ROUTES
app.
	get("/task_1", (req, res) => {
		collection.findAll((err, data) => {
			res.render("inted", {data: data})
		})
	})








//SET PORT
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function() {
	console.log("Server started on port" + app.get("port"))
})











