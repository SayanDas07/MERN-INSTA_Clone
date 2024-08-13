//chating
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"

const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.id
    const receiverId = req.params.id
    const { message } = req.body

    const conversation = await Conversation.findOne({
        participants: {
            $all: [senderId, receiverId]
        }
    })

    if(!conversation){
        //create new conversation
        conversation = await Conversation.create({
            participants: [senderId, receiverId]
        })
    }

    //add message to conversation
    const newMessage = await Message.create({
       
        senderId,
        receiverId,
        message
        

    })

    //add message to conversation
    if(newMessage){
        conversation.message.push(newMessage._id)
    }
    await conversation.save()

    await newMessage.save()

    //impliment socket.io here


    return res.status(200).json(new ApiResponse(200, newMessage, "Message sent successfully"))

})

const getMessages = asyncHandler(async (req, res) => {
    const senderId = req.id
    const receiverId = req.params.id

    const conversation = await Conversation.findOne({
        participants:{
            $all: [senderId, receiverId]
        }
    }).populate('message')

    if(!conversation){
        return res.status(200).json(new ApiResponse(200, [], "No messages found"))
    }

    return res.status(200).json(new ApiResponse(200, conversation?.message, "Messages found"))
})


export { sendMessage,
        getMessages
    }   