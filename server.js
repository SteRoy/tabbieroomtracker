'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const async = require('async');

const PORT = process.env.PORT || 8080;

var mysql      = require('mysql');

var connection = require('./mysqlconnection')

connection.connect();

const app = express()
  .use(express.static(__dirname + '/public'))
  .set('view engine', 'pug');

app.set('views', __dirname + '/views');

app.locals.moment = require('moment');

const http = require('http').createServer(app);
const io = socketIO(http);

http.listen(PORT);

app.get('/admin', function(req, res){

var allrooms;

async.parallel([
function(callback){
connection.query('SELECT * from rooms', function(err, rows, fields) {
  if (!err){
    console.log(rows);
      allrooms = rows;
    	callback();
    }
  else
    console.log('Error while performing Query.');
});
},
],

function(callback){
  res.render('admin', {port: PORT, pageData: [allrooms]});
});
});


app.get('/', function(req, res){

var allrooms, lastRoomGroup;
var allRoomsFormatted = [];
var groupNames = [];
var workingGroup = [];

async.parallel([

function(callback) {
	connection.query('SELECT * from rooms ORDER BY `group`, id', function(err, rows, fields) {
  if (!err){
  	allrooms = rows;
    callback();
	}
  else
    console.log('Error while performing Query.');
});
},

],
function(){
  allrooms.forEach(
    function(entry){
      if(groupNames.indexOf(entry.group) === -1){
        groupNames.push(entry.group);
      }
      if(entry.group !== lastRoomGroup && lastRoomGroup !== undefined){
        allRoomsFormatted.push(workingGroup);
        workingGroup = [];
      }
        workingGroup.push(entry);
        lastRoomGroup = entry.group;
      }
    );
  allRoomsFormatted.push(workingGroup);
  console.log(allRoomsFormatted);
	res.render('page', {port: PORT, pageData: [groupNames, allRoomsFormatted]});
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