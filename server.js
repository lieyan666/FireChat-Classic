/*
 * @Author: Lieyan
 * @Date: 2024-09-18 18:59:40
 * @LastEditors: Lieyan
 * @LastEditTime: 2024-09-18 20:00:05
 * @FilePath: /FireChat-Classic/server.js
 * @Description: for firechat-classic server
 * @Contact: QQ: 2102177341  Website: lieyan.space  Github: @lieyan666
 * @Copyright: Copyright (c) 2024 by lieyanDevTeam, All Rights Reserved. 
 */
const net = require('net');
const fs = require('fs');

let clients = [];
const config = JSON.parse(fs.readFileSync('serverConfig.json', 'utf8'));
const serverPassword = config.password;

function generateRandomUsername() {
    return 'User_' + Math.random().toString(36).substr(2, 8);
}

const server = net.createServer((socket) => {
    socket.write('[Server] Password: ');
    socket.on('data', (data) => {
        data = data.toString().trim();
        // pswd verify
        if (!socket.authenticated) {
            if (data === serverPassword) {
                socket.authenticated = true;
                // socket.username = `User_${Math.floor(Math.random() * 10000)}`; // random username
                socket.username = generateRandomUsername();
                clients.push(socket);
                socket.write(`[Server] Connected! Randomized Username: ${socket.username}\n`);
                broadcast(`${socket.username} Connected`, socket);
            } else {
                socket.write('[Server] Premission Denied (Password Error) !\n');
                socket.end();
            }
        } else {
            // broadcast msg.
            broadcast(`${socket.username}: ${data}`, socket);
        }
    });

    socket.on('end', () => {
        clients = clients.filter(client => client !== socket);
        broadcast(`${socket.username} Disconnected`, socket);
    });

    socket.on('error', (err) => {
        console.log(`Socket error: ${err.message}`);
    });

    function broadcast(message, sender) {
        clients.forEach(client => {
            if (client !== sender) {
                client.write(`${message}\n`);
            }
        });
    }
});

// start server
server.listen(config.port, () => {
    console.log(`Server Started, PORT=${config.port}`);
});