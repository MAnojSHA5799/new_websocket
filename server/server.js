const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    let animationInterval;

    ws.on('message', (message) => {
        const data = message.toString();
        console.log('Received:', data);

        if (data === 'Start') {
            animationInterval = setInterval(() => {
                const frame = {
                    y: 20 + Math.random() * 20, // Random wave height (between 20px and 40px)
                };
                ws.send(JSON.stringify(frame));
            }, 100); // Send new animation frame every 100ms
        } else if (data === 'Stop') {
            clearInterval(animationInterval);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(animationInterval);
    });
});

server.listen(8080, () => console.log('WebSocket server running on port 8080'));
