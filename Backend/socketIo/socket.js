import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['GET', 'POST']
    }
})

const userSocketMap = {}  // Map to store user socket id with user id

export const getReciverSocketId = (receiverId) => userSocketMap[receiverId]

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket id ${socket.id}`)
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId]
            console.log(`User ${userId} disconnected from socket id ${socket.id}`)
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})


export {app, server, io}

