//chating
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { getReciverSocketId, io } from "../socketIo/socket.js"

const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.id
    const receiverId = req.params.id
    const { textMessage : message } = req.body
    console.log("messages",message)

    let conversation = await Conversation.findOne({
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
    await Promise.all([conversation.save(),newMessage.save()])

    //impliment socket.io here
    const reciverSocketId = getReciverSocketId(receiverId)

    if(reciverSocketId){
        io.to(reciverSocketId).emit('newMessage', newMessage)
    }


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

    //console.log("conversation",conversation)

    if(!conversation){
        return res.status(200).json({success:true, messages:[]})
    }

    return res.status(200).json({success:true, messages:conversation?.message})
})


export { sendMessage,
        getMessages
    }   