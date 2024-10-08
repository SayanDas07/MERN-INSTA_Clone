//Here we listening the server on port
import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import { app, server } from './socketIo/socket.js';
import path from 'path';

dotenv.config({})

const __dirname = path.resolve()

//middlewares
app.use(express.json())
app.use(cookieParser()) // to get the cookie from the server
app.use(urlencoded({ extended: true }))
const corsOptions = {
    origin: process.env.URL,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

//routes
import userRoutes from './routes/user.route.js'
app.use('/api/v1/user', userRoutes)
//http://localhost:8000/api/v1/user/register

import messageRoutes from './routes/message.route.js'
app.use('/api/v1/message', messageRoutes)

import postRoutes from './routes/post.route.js'
app.use('/api/v1/post', postRoutes)

app.use(express.static(path.join(__dirname, "Frontend/Frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend","Frontend", "dist", "index.html"));
})

const PORT = process.env.PORT || 8000

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })