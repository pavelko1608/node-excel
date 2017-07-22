var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var Sequelize = require('sequelize')

var app = express()

//SQLITE CONNECTION
const sequelize = new Sequelize('database', null, null, {
  dialect: 'sqlite',
  storage: './test.sqlite'
});

//  SYNC SCHEMA
sequelize
  .sync({ force: true })
  .then(function(err) {
    console.log('It worked!');
  }, function (err) {
    console.log('An error occurred while creating the table:', err);
  });

//SEQUELIZE AUTHENTICATION
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function (err) {
    console.log('Unable to connect to the database:', err);
  });

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
  DataType: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  Adress: {
  	allowNull: false,
  	type: Sequelize.STRING
  },
  Distance: {
  	allowNull: false,
  	type: Sequelize.INTEGER
  }
});  

//BODYPARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//VIEW ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//ROUTES











