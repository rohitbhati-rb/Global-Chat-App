let socket = io();
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
let currentDate = document.querySelector('.currentDate');
let currentTime = document.querySelector('.currentTime');

let days = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function setDateAndTime() {
    let currDate = new Date();
    let currDay = currDate.getDay(), currMonth = currDate.getMonth(), date = currDate.getDate(), currYear = currDate.getFullYear();
    currentDate.innerText = `${days[currDay]}, ${months[currMonth]} ${date}, ${currYear}`;
    currentTime.innerText = String(new Date().toLocaleTimeString()) + " IST";
}
setDateAndTime();
setInterval(setDateAndTime, 1000);

// Functions
function appendNotification(text, className) {
    let item = document.createElement('div');
    item.textContent = text;
    item.classList.add(className);
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
}
function appendMessage(sender, text, className) {
    let item = document.createElement('div');
    item.classList.add(className);
    messages.appendChild(item);

    let user = document.createElement('p');
    user.textContent = sender;
    user.classList.add('sender');

    let msg = document.createElement('p');
    msg.textContent = text;
    if (sender.length != 0) msg.classList.add('msgLeft');
    else msg.classList.add('msgRight');

    let time = document.createElement('p');
    let temp = String(new Date().toLocaleTimeString());
    temp = temp.slice(0, temp.lastIndexOf(':')) + temp.slice(temp.lastIndexOf(' '));
    time.textContent = temp;
    time.classList.add('time');

    if (sender.length != 0) item.appendChild(user);
    item.appendChild(msg);
    item.appendChild(time);
    messages.scrollTo(0, messages.scrollHeight);
}

// Events
let userName = prompt("Enter your name to join Global Chat");
if (userName) {
    appendNotification('You joined', 'center');
    socket.emit('new-user-joined', userName);
}
form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value) {
        appendMessage('', input.value, 'right');
        socket.emit('chat message', input.value);
        input.value = "";
    }
});

// Socket Events
socket.on('new-user-joined', userName => {
    let text = `${userName} joined`;
    appendNotification(text, 'center');
})
socket.on('chat message', data => {
    appendMessage(data.name, data.msg, 'left');
});
socket.on('user-disconnected', userName => {
    let text = `${userName} left`;
    appendNotification(text, 'center');
})