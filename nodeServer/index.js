// Node server which will handle socket io connections.
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname + '/public')));
const io = require('socket.io')(8000, {
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e9,
});

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
const users = {};
// io.on listens to all the socket events happening in the server on the other hand socket.on listens to a specific socket events.
io.on('connection', (socket) => {
  // If any new user joins, let the other users connected to the server know
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    allnames = Object.values(users);
    console.log(allnames);
    io.emit('dropdown', allnames);
  });
  // If someone sends a message, broadcast it to the other people
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('upload', (file) => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      io.emit('imageFile', {
        buffer: file.buffer,
        type: file.type,
      });
    } else if (file.type === 'audio/mp3' || file.type === 'audio/mpeg') {
      io.emit('audioFile', {
        buffer: file.buffer,
        type: file.type,
      });
    }
    if (file.type === 'video/mp4') {
      io.emit('videoFile', {
        buffer: file.buffer,
        type: file.type,
      });
    }
  });

  // If someone leaves the chat, let others know
  socket.on('disconnect', (message) => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
  socket.on('private-send', (message, name, selecteduser) => {
    const socketId = getKeyByValue(users, selecteduser);
    console.log(socketId);
    io.to(socketId).emit('receive1', {
      message: message,
      name: users[socket.id],
    });
  });
});
// io.on is a socket event which will listen to socket connections.
// aaa
