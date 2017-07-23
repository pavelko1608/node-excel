var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var fs = require("fs")
var convertExcel = require('excel-as-json').processFile

var app = express()

//SQLITE CONNECTION
const sequelize = new Sequelize('database', null, null, {
  dialect: 'sqlite',
  storage: './data.sqlite'
})

//  SYNC SCHEMA
sequelize
  .sync({ force: true })
  .then(function(err) {
    console.log('It worked!')
  }, function (err) {
    console.log('An error occurred while creating the table:', err)
  })

//SEQUELIZE AUTHENTICATION
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.')
  }, function (err) {
    console.log('Unable to connect to the database:', err)
  })

//DEFINING MODEL 
const Data = sequelize.define('data', {
  Imei: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER
  },	
  CurrentDateTime: {
  	allowNull: false,
    type: Sequelize.TIME
  },
  GPSDateTime: {
  	allowNull: false,
    type: Sequelize.TIME
  },
  Datatype: {
    type: Sequelize.INTEGER
  },
  Address: {
  	allowNull: false,
  	type: Sequelize.STRING
  },
  Distance: {
  	allowNull: false,
  	type: Sequelize.INTEGER
  }
}) 

convertExcel("logging.xlsx", "logging.json")
data = fs.readFileSync("logging.json")
var jsonData = JSON.parse(data)
jsonData.forEach((unit) => {
	Data.create({
				Imei: unit.Imei, 
				CurrentDateTime: unit.CurrentDateTime,
				Datatype: unit.Datatype,
				GPSDateTime: unit.GPSDateTime,
				Address: unit.Address,
				Distance: unit.Distance
				 }).then((err, data) =>{
				 	data.save()
				 })
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
		Data.findAll().then((data) => {
			res.render("index", {data: data})
		})
	})








//SET PORT
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function() {
	console.log("Server started on port" + app.get("port"))
})











