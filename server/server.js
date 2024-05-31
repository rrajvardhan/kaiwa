//packages
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import path from 'path'

//routes
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'

//database
import connectToMongoDb from './db/connect.js'

const __dirname = path.resolve()

//server port
const PORT = process.env.PORT || 3000

// Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It facilitates the development of server-side web applications by providing a simple, yet powerful, set of features for web and mobile applications.
import { app, server } from './socket/socket.js'

// dotenv is a Node.js module that loads environment variables from a .env file into process.env. It's particularly useful for managing configuration in Node.js applications, especially when dealing with sensitive information like API keys, database URIs, or other credentials.
//configure dotenv package
dotenv.config()

// In Express.js, middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. They can execute any code, make changes to the request and response objects, end the request-response cycle, and call the next middleware function in the stack.
// app.use() is used to mount the specified middleware function(s) at the specified path.
//middlware to parse the incoming requests with JSON and cokies
app.use(express.json())
app.use(cookieParser())
//middleware for Auth (signup,login,logout) Routes.
app.use('/api/auth', authRoutes)
//middleware for Message ( sendMessage, getMessages) Routes.
app.use('/api/message', messageRoutes)

app.use(express.static(path.join(__dirname + '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

server.listen(PORT, () => {
    connectToMongoDb()
    console.log(`server running on PORT: ${PORT}`)
})

