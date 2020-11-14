const express = require('express');
const app = express();
const http = require('http').Server(app);
const ejs = require('ejs');
const io = require('socket.io')(http);
const marked = require('marked');
const fs = require('fs');
var randomColor = require('randomcolor');

let dataNames = {
	"mckenna": ["💚", "green"],
  	"leo": ["Owner", "#FFD700 "]
    };

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render("index");
});

io.sockets.on('connection', (socket) => {
  var now= new Date();
  socket.on('username', function(username) {
    socket.username = username;

    if (username){
        io.emit('is_online', 'welcome <i>' + socket.username + '!</i>');
    }
  });

  socket.on('disconnect', (username) => {
    if (username){
      io.emit('is_online', 'goodbye <i>' + socket.username + '!</i>');
    }
  });

  socket.on('chat_message', (message) => {
      if (socket.username == undefined){
          socket.username = "expired"
      }
      var color = `style = "color: ${randomColor()}`
      if (socket.username.toLowerCase() == "mckenna"){
        color = `style = "color: green "`;
      };
      if (socket.username.toLowerCase() != ""){
        io.emit('chat_message',`</strong> [${now.toLocaleDateString("en-us")}]</strong>` +  `<strong ${color}> ` + socket.username + '</strong> ⟶ ' + message);
        fs.appendFileSync('messages.txt', `[${now.toLocaleDateString("en-us")}] ` +   socket.username + ' ⟶ ' + message + "\n");
      }
  });
});

const server = http.listen(8080, () => {
  console.log('listening on *:8080');
});