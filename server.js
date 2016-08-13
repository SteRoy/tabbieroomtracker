'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const async = require('async');

const PORT = process.env.PORT || 8080;
//const INDEX = path.join(__dirname, 'index.html');

var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'gx97kbnhgjzh3efb.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'ayug90pro8vdtmvw',
  password : 'p105fcq1x7vj72ji',
  database : 'g27yd9pew5qmcsuz'
});

connection.connect();

function setValue(value, holder) {
  holder = value;
 }

const app = express()
  .set('view engine', 'pug')
  .use(express.static(__dirname + '../public'))
  .set('views', __dirname+'/views')

const http = require('http').createServer(app);
const io = socketIO(http);

http.listen(PORT);

	var blue12 = [];
	var blue3 = [];
	var orange0 = [];
	var orange1 = [];
	var orange2 = [];
	var red11 = [];
	var red2 = [];
	var red3 = [];


app.get('/', function(req, res){

async.parallel([

function(callback) {
	connection.query('SELECT * from rooms WHERE rooms.group = "BLUE 1/2"', function(err, rows, fields) {
  if (!err){
  	blue12 = rows;
    callback();
	}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
	connection.query('SELECT * from rooms WHERE rooms.group = "BLUE 3"', function(err, rows, fields) {
  if (!err){
    blue3 = rows;
    callback();
	}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "ORANGE 0"', function(err, rows, fields) {
  if (!err)
    {orange0 = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "ORANGE 1"', function(err, rows, fields) {
  if (!err)
    {orange1 = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "ORANGE 2"', function(err, rows, fields) {
  if (!err)
    {orange2 = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "RED -1/1"', function(err, rows, fields) {
  if (!err)
    {red11 = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "RED 2"', function(err, rows, fields) {
  if (!err)
  	{red2 = rows;
  	    callback();}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "RED 3"', function(err, rows, fields) {
  if (!err)
    {red3 = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
}
],
function(){
	res.render('page', {port: PORT, pageData: [blue12, blue3, orange0, orange1, orange2, red11, red2, red3]});
});
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('roomout', (message) => io.emit('debateOut', message));
  socket.on('roomout', (message) => connection.query('UPDATE rooms SET status = "out" WHERE roomname = "' + message + '"'))
  socket.on('ballotgot', (message) => io.emit('ballotGot', message));
  socket.on('ballotgot', (message) => connection.query('UPDATE rooms SET status = "ballotgot" WHERE roomname = "' + message + '"'))
  socket.on('debateStart', (message) => io.emit('debateStart', message));
  socket.on('debateStart', (message) => connection.query('UPDATE rooms SET status = "in" WHERE roomname = "' + message + '"'))
  socket.on('disconnect', () => console.log('Client disconnected'));
});

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
