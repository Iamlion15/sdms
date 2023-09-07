import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    nID: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:
    {
        type:String,
        default: "FARMER",
        enum: ["FARMER", "AGRO","RAB","ADMIN"],
    }
})

const userModel=model("user",userSchema);

export default userModel;
