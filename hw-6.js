const io = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');





const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

const socket = io(app);

let count = 0;

socket.on('connection', function (socket) {
    let ID = (socket.id).toString().substr(0, 5);
    console.log('New connection');
    console.log(`Client with id ${ID} connected`)
    // событие новое подключение
    socket.broadcast.emit('NEW_CONN_EVENT', { msg: `Client with id ${ID} is connected` })

    // событие счетчика подключений при новом подключении
    count++
    socket.emit('COUNT_ADD', { msg: `Number of Client is: ${count}` })
    socket.broadcast.emit('COUNT_ADD', { msg: `Number of Client is: ${count}` })

    // событие передачи сообщения 
    socket.on('CLIENT_MSG', (data) => {
        socket.emit('SERVER_MSG', { msg: `${ID}: ` + data.msg.split('').join('') })
        socket.broadcast.emit('SERVER_MSG', { msg: `${ID}: ` + data.msg.split('').join('') })

    });

    // событие отключение подключения

    socket.on('disconnect', () => {
        console.log('Connection fall');
        socket.broadcast.emit('CONN_FALL', { msg: `Client with id ${ID} is disconnected` })
        console.log(`Client with id ${ID} disconnected`)
    // событие счетчика подключений при отключении
    
        count--
        socket.emit('COUNT_REDUCE', { msg: `Number of Client is: ${count}` })
        socket.broadcast.emit('COUNT_REDUCE', { msg: `Number of Client is: ${count}` })
    })

});

app.listen(3000, 'localhost');