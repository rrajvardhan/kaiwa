import express from 'express'
import jwt from 'jsonwebtoken'

import { getReceiverSocketId, io } from "../socket/socket.js";
import Message from '../models/message.model.js'
import User from '../models/user.model.js'
import Conversation from '../models/conversation.model.js'

async function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res
                .status(401)
                .json({ error: 'unauthorized- no token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res
                .status(401)
                .json({ error: 'unauthorized- invalid token provided' })
        }

        const user = await User.findById(decoded.userid).select('-password')
        if (!user) {
            return res.status(404).json({ error: 'user not found' })
        }

        req.user = user

        next()
    } catch (error) {
        console.log(
            'error in authenticateToken ( sendMessage controller ) ',
            error.message
        )
        res.status(500).json({ error: 'internal server error' })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { id: recieverId } = req.params //from url
        const { message } = req.body //from body(user input)

        const senderId = req.user._id //from token

        //find any previous conversation between sender and reciever,if any.
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] },
        })
        //if there are no previous conversation , create one.
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId],
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
        })

        //push new message into the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        //save message and conversation in database
        // await conversation.save()
        // await newMessage.save()
        //this will run in parrallel
        await Promise.all([conversation.save(), newMessage.save()])

        const receiverSocketId = getReceiverSocketId(recieverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }


        res.status(201).json(newMessage)
    } catch (error) {
        console.log('error in Message controller ( sendMesssage )...', error)
        res.status(500).json({ error: 'internal server error' })
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages') //use populate to get objects instead to references

        if (!conversation) {
            return res.status(200).json([])
        }

        const messages = conversation.messages

        res.status(200).json(messages)
    } catch (error) {
        console.log('error in Messsage controller (getMessages)', error.message)
        res.status(500).json({ error: 'internal server error  ' })
    }
}

const router = express.Router()

//send messages
router.post('/send/:id', authenticateToken, sendMessage)
//get all messages between two users
router.get('/:id', authenticateToken, getMessages)

// Get all users who have a connection with the current user
router.get('/get/users', authenticateToken, async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select('-password')

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error('Error in getUsersForSidebar: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
