let socket = io();
const messages = document.querySelector('.messages');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
let onlineUsers = document.querySelector('.online-users');
let currentDate = document.querySelector('.current-date');
let currentTime = document.querySelector('.current-time');

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function setDateAndTime() {
    const dateObject = new Date();
    let [month, date, year] = dateObject.toLocaleDateString("IST").split("/");
    let day = dateObject.getDay();
    currentDate.innerText = `${days[day]}, ${months[month-1]} ${date}, ${year}`;

    let [hour, minute, second, ampm] = dateObject.toLocaleTimeString("IST").split(/:| /);
    if(hour.length === 1) hour = '0' + hour;
    currentTime.innerText = `${hour}:${minute}:${second} ${ampm}`;
}
/*
var d=new Date();
var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getFullYear();
var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;

if(nhour==0){ap=" AM";nhour=12;}
else if(nhour<12){ap=" AM";}
else if(nhour==12){ap=" PM";}
else if(nhour>12){ap=" PM";nhour-=12;}

if(nmin<=9) nmin="0"+nmin;
if(nsec<=9) nsec="0"+nsec;

var clocktext=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
document.getElementById('clockbox').innerHTML=clocktext;
*/

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
    if (sender.length != 0) msg.classList.add('msg-left');
    else msg.classList.add('msg-right');

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