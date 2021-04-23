let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

let userName = prompt("Enter your name to join Global Chat");
if (userName) {
    socket.emit('new-user-joined', userName);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value) {
        let item = document.createElement('li');
        item.textContent = input.value;
        item.classList.add('right');
        messages.appendChild(item);
        socket.emit('chat message', input.value);
        input.value = "";
    }
});

socket.on('new-user-joined', userName => {
    let item = document.createElement('li');
    item.textContent = `${userName} joined the chat`;
    item.classList.add('center');
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})
socket.on('chat message', data => {
    let item = document.createElement('li');
    item.textContent = `${data.name} : ${data.msg}`;
    item.classList.add('left');
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
socket.on('user-disconnected', userName => {
    let item = document.createElement('li');
    item.textContent = `${userName} left the chat`;
    item.classList.add('center');
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})