let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

let userName = prompt("Enter your name to join Global Chat");
if (userName) {
    socket.emit('new-user-joined', userName);
}
function appendLI(text, className) {
    let item = document.createElement('span');
    item.textContent = text;
    item.classList.add(className);
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
}
form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value) {
        appendLI(input.value,'right');
        socket.emit('chat message', input.value);
        input.value = "";
    }
});

socket.on('new-user-joined', userName => {
    let text = `${userName} joined the chat`;
    appendLI(text, 'center');
})
socket.on('chat message', data => {
    let text = `${data.name} : ${data.msg}`;
    appendLI(text, 'left');
});
socket.on('user-disconnected', userName => {
    let text = `${userName} left the chat`;
    appendLI(text, 'center');
})