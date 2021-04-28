let socket = io();
const messages = document.querySelector('.messages');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
let onlineUsers = document.querySelector('.online-users');
let currentDate = document.querySelector('.current-date');
let currentTime = document.querySelector('.current-time');

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function setDate() {
    let d = new Date();
    let day = d.getDay(), month = d.getMonth(), date = d.getDate(), year = d.getFullYear();
    currentDate.innerText = `${days[day]}, ${months[month]} ${date}, ${year}`;
}
function setTime() {
    let d = new Date();
    let hour = d.getHours(), minutes = d.getMinutes(), seconds = d.getSeconds(), ampm;
    if (hour < 12) {
        ampm = " AM";
        if (hour === 0) {
            hour = 12;
            setDate();
        }
    }
    else if (hour === 12) ampm = " PM";
    else {
        ampm = " PM";
        hour -= 12;
    }
    if (hour <= 9) hour = "0" + hour;
    if (minutes <= 9) minutes = "0" + minutes;
    if (seconds <= 9) seconds = "0" + seconds;
    currentTime.innerText = `${hour}:${minutes}:${seconds} ${ampm}`;
}
setDate();
setTime();
setInterval(setTime, 1000);

// Functions
function getMessageTime(){
    let d = new Date();
    let hour = d.getHours(), minutes = d.getMinutes(), ampm;
    if (hour < 12) {
        ampm = " AM";
        if (hour === 0) hour = 12;
    }
    else if (hour === 12) ampm = " PM";
    else {
        ampm = " PM";
        hour -= 12;
    }
    if (minutes <= 9) minutes = "0" + minutes;
    return `${hour}:${minutes} ${ampm}`;
}
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
    if (sender.length != 0) msg.classList.add('msg-left');
    else msg.classList.add('msg-right');

    let time = document.createElement('p');
    time.textContent = getMessageTime();
    time.classList.add('time');

    if (sender.length != 0) item.appendChild(user);
    item.appendChild(msg);
    item.appendChild(time);
    messages.scrollTo(0, messages.scrollHeight);
}
const updateUserCount = (totalUsers) => onlineUsers.innerText = totalUsers;

// Events
let userName = prompt("Enter your name to join Global Chat");
if (userName) {
    appendNotification('You joined', 'center');
    socket.emit('new-user-joined', userName);
    onlineUsers.innerText = `${parseInt(onlineUsers.innerText) + 1}`;
}
form.addEventListener('submit', e => {
    e.preventDefault();
    if (/\S/.test(input.value)) {
        appendMessage('', input.value, 'right');
        socket.emit('chat message', input.value);
        input.value = "";
    }
});

// Socket Events
socket.on('new-user-joined', username => {
    let text = `${username} joined`;
    appendNotification(text, 'center');
})
socket.on('chat message', data => {
    appendMessage(data.username, data.message, 'left');
});
socket.on('user-disconnected', username => {
    let text = `${username} left`;
    appendNotification(text, 'center');
})
socket.on('updateUserCount', totalUsers => {
    updateUserCount(totalUsers);
})