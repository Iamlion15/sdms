import { Schema, model } from 'mongoose'

const stockSchema = new Schema({
    quantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    seed:{
        type:Schema.Types.ObjectId,
        ref:'seed'
    },

    
},{timestamps:true})

const stockModel=model("stock",stockSchema);

export default stockModel;
