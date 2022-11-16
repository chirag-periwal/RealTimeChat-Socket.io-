const socket = io('http://localhost:8000');
// Get DOM elementd in respective Js varaibles
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const dropdowncontent = document.querySelector('.dropbtn');
const selected = document.getElementById('select1');
var audio = new Audio('ting.mp3');

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == 'left') {
    audio.play();
  }
};
let selecteduser = '';
selected.addEventListener('change', function () {
  selecteduser = this.value;
  console.log(selecteduser);
});

const addtodropdown = (name) => {
  dropdowncontent.innerHTML += `<option value="${name}">${name}</option> `;
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  if (selecteduser == 'BroadCast' || selecteduser == '') {
    socket.emit('send', message, name);
  } else {
    socket.emit('private-send', message, name, selecteduser);
  }
  messageInput.value = '';
});
// Ask new user for his/her name
const name = prompt('Enter Your name to join');

socket.emit('new-user-joined', name);
// If a new user joins, receive his name from the server
socket.on('user-joined', (name) => {
  // console.log(dropdowncontent.innerHTML);
  append(`${name} joined the chat`, 'right');
});
// If server sends, receive the message
socket.on('receive', (data) => {
  append(`${data.name}: ${data.message}`, 'left');
});
socket.on('receive1', (data) => {
  append(`${data.name}: ${data.message}`, 'left');
});
socket.on('dropdown', (allnames) => {
  dropdowncontent.innerHTML = `<option value="BroadCast">BroadCast</option>  `;
  allnames.forEach((addname) => (addname != name ? addtodropdown(addname) : 1));
});
// If user leaves the chat, append the info to the container
socket.on('left', (name) => {
  append(`${name} left the chat `, 'left');
});
// socket.on('sendto',(data) => {
//   append(`${data.name}: ${data.message}`, 'left');
// })
let formNew = document.getElementById('form');
formNew.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e.target.elements.img.files[0]);
  socket.emit('upload', {
    name: e.target.elements.img.files[0].name,
    type: e.target.elements.img.files[0].type,
    sendDate: new Date(),
    buffer: e.target.elements.img.files[0],
  });
});

socket.on('imageFile', (src) => {
  console.log(src);
  let img = document.createElement('img');
  // img.style.position='relative';
  img.style.height = '200px';
  img.style.width = '200px';
  var arrayBufferView = new Uint8Array(src.buffer);
  var blob = new Blob([arrayBufferView], { type: src.type });
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(blob);
  img.src = imageUrl;
  messageContainer.append(img);
});
socket.on('audioFile', (src) => {
  let audio = document.createElement('audio');
  var arrayBufferView = new Uint8Array(src.buffer);
  var blob = new Blob([arrayBufferView], { type: src.type });
  var urlCreator = window.URL || window.webkitURL;
  var audioUrl = urlCreator.createObjectURL(blob);
  audio.autoplay = 'true';
  audio.controls = 'true';
  audio.src = audioUrl;
  messageContainer.append(audio);
});
socket.on('videoFile', (src) => {
  let video = document.createElement('video');
  var arrayBufferView = new Uint8Array(src.buffer);
  var blob = new Blob([arrayBufferView], { type: src.type });
  var urlCreator = window.URL || window.webkitURL;
  var audioUrl = urlCreator.createObjectURL(blob);
  // video.autoplay = 'true';
  video.controls = 'true';
  video.style.height = '200px';
  video.style.width = '200px';
  video.src = audioUrl;
  messageContainer.append(video);
});
