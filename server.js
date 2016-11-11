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
  .use(express.static(__dirname + '/public'))
  .set('view engine', 'pug')

app.set('views', __dirname + '/views');

const http = require('http').createServer(app);
const io = socketIO(http);

http.listen(PORT);

	var union = [];
	var cie = [];
	var sgm = [];
	var ec = [];
	var valdata = [];

app.get('/admin', function(req, res){

async.parallel([

function(callback){
connection.query('SELECT * from rooms', function(err, rows, fields) {
  if (!err)
    {valdata = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
}
],
function(){
	res.render('admin', {port: PORT, pageData: [valdata]});
});
});


app.get('/', function(req, res){

async.parallel([

function(callback) {
	connection.query('SELECT * from rooms WHERE rooms.group = "Union"', function(err, rows, fields) {
  if (!err){
  	union = rows;
    callback();
	}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
	connection.query('SELECT * from rooms WHERE rooms.group = "CIE"', function(err, rows, fields) {
  if (!err){
    cie = rows;
    callback();
	}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "EC"', function(err, rows, fields) {
  if (!err)
    {ec = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
},

function(callback){
connection.query('SELECT * from rooms WHERE rooms.group = "SGM"', function(err, rows, fields) {
  if (!err)
    {sgm = rows;
    	callback();}
  else
    console.log('Error while performing Query.');
});
},
],
function(){
	res.render('page', {port: PORT, pageData: [cie, ec, sgm, union]});
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
  socket.on('blanket', (message) => io.emit('blanket', message));
  socket.on('blanket', (message) => connection.query('UPDATE rooms SET status = "noDebate" WHERE roomname = "' + message + '"'))
  socket.on('disconnect', () => console.log('Client disconnected'));
});

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
