import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    senderId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
   
    }

})

export const Message = mongoose.model("Message", messageSchema);