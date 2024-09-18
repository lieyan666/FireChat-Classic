/*
 * @Author: Lieyan
 * @Date: 2024-09-18 18:59:40
 * @LastEditors: Lieyan
 * @LastEditTime: 2024-09-18 19:18:35
 * @FilePath: /FireChat-Classic/server.js
 * @Description: for firechat-classic server
 * @Contact: QQ: 2102177341  Website: lieyan.space  Github: @lieyan666
 * @Copyright: Copyright (c) 2024 by lieyanDevTeam, All Rights Reserved. 
 */
const net = require('net');

let clients = [];
const serverPassword = 'pswd'; // server password

const server = net.createServer((socket) => {
    socket.write('Password: ');
    socket.on('data', (data) => {
        data = data.toString().trim();
        // pswd verify
        if (!socket.authenticated) {
            if (data === serverPassword) {
                socket.authenticated = true;
                socket.username = `User_${Math.floor(Math.random() * 10000)}`; // random username
                clients.push(socket);
                socket.write(`Connected! Randomized Username: ${socket.username}\n`);
                broadcast(`${socket.username} Connected`, socket);
            } else {
                socket.write('Premission Denied (Password Error) !\n');
                socket.end();
            }
        } else {
            // 广播消息
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

// 监听端口
server.listen(8080, () => {
    console.log('Server Started');
});