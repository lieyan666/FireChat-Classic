/*
 * @Author: Lieyan
 * @Date: 2024-09-18 19:10:49
 * @LastEditors: Lieyan
 * @LastEditTime: 2024-09-18 19:58:31
 * @FilePath: /FireChat-Classic/client.js
 * @Description: for firechat-classic client
 * @Contact: QQ: 2102177341  Website: lieyan.space  Github: @lieyan666
 * @Copyright: Copyright (c) 2024 by lieyanDevTeam, All Rights Reserved. 
 */
const net = require('net');
const fs = require('fs');
const readline = require('readline');

// server config
const serverMap = JSON.parse(fs.readFileSync('clientConfig.json', 'utf8'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// connect
rl.question('Enter ServerID: ', (serverId) => {
    const serverInfo = serverMap[serverId];
    if (!serverInfo) {
        console.log('Invalid ServerID');
        rl.close();
        return;
    }
    const client = net.createConnection(serverInfo.port, serverInfo.ip, () => {
        console.log('[Client] Connected!');
    });

    client.on('data', (data) => {
        console.log(data.toString());
    });

    client.on('end', () => {
        console.log('Server Disconnected.');
        rl.close();
    });

    client.on('error', (err) => {
        console.log(`Connection ERROR: ${err.message}`);
        rl.close();
    });

    rl.question('->', (password) => {
        client.write(password);
        rl.on('line', (input) => {
            client.write(input);
        });
    });
});