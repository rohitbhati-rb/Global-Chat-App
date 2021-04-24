let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

let userName = prompt("Enter your name to join Global Chat");
if (userName) {
    socket.emit('new-user-joined', userName);
}

// Functions
function appendLI(text, className) {
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
    appendLI(text, 'center');
})
socket.on('chat message', data => {
    appendMessage(data.name, data.msg, 'left');
});
socket.on('user-disconnected', userName => {
    let text = `${userName} left`;
    appendLI(text, 'center');
})