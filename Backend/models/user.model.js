import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new Schema({
    username :{
        type : String,
        required : true,
        unique : true,
        trim : true,
        index : true,
        lowercase : true
    },
    email :{
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    fullName :{
        type : String,
        trim : true,
    },
    profilePicture :{
        type : String, //cloudinary url
        requied :true
    },
    bio :{
        type : String,
        default : ''
    },
    password :{
        type :String,
        required : [true, "Password is required"]
    },
    gender :{
        type : String,
        enum : ["male", "female", "other"],
    },
    followers :[
        {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    following :[
        {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    posts :[
        {
            type : Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    bookmarks :[
        {
            type : Schema.Types.ObjectId,
            ref : "Post"
        }
    ]
},{timestamps : true})

userSchema.methods.isPasswordCorrect = async function(password){

    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )



}

export const User = mongoose.model("User", userSchema);


