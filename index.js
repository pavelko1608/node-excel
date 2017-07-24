var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var fs = require("fs")
var convertExcel = require('excel-as-json').processFile
var mongo = require("mongodb")
var mongoose = require("mongoose")
var Data = require("./models/Data")
var db = require("./db")

var app = express()

mongoose.connect("mongodb://localhost:27017/node-test");
Data.find({}, (err, data) => {
	for(var i = 0; i < data.length; i++) {
		data[i].remove()
	}
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
//ROUTES
app
	.get("/task_1", (req, res) => {
		Data.find({}, function(err, data) {
			console.log(data.length)
			res.render("index", {data: data})
		})
	})
	.get("/task_2", (req, res) => {
		Data.find({Datatype: 1}, (err, data_1) => {
			Data.find({Datatype: 2}, (err, data_2) => {
					for(var i = 0; i < data_1.length; i++) {
						hours = new Date(new Date(data_2[i].CurrentDateTime) - new Date(data_1[i].CurrentDateTime)).getHours() - 2
						minutes = new Date(new Date(data_2[i].CurrentDateTime) - new Date(data_1[i].CurrentDateTime)).getMinutes()
						if (minutes.toString().length < 2) {
							minutes = "0" + minutes
						}
 						data_2[i].CurrentDateTime = "" + hours + ":" + minutes
						data_2[i].Distance = data_2[i].Distance - data_1[i].Distance
					}
				res.render("index_2", {data: data_2})
			})
		})
	})








//SET PORT
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function() {
	console.log("Server started on port" + app.get("port"))
})











