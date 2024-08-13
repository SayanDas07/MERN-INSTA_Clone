import mongoose,{Schema} from "mongoose";


const commentSchema = new Schema({
    text :{
        type : String,
        required : true,
        trim : true
    },
    author :{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    post :{
        type : Schema.Types.ObjectId,
        ref : "Post",
        required : true
    }
})

export const Comment = mongoose.model("Comment", commentSchema);


