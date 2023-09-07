import { Schema,model } from "mongoose";

const transactionSchema=new Schema({
    quantity:{
        type:Number
    },
    amount:{
        type:Number
    },
    seed:{
        type:Schema.Types.ObjectId,
        ref:'seed'
    },
    requestedBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    requestedFrom:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    status:{
        Status:String,
        enum: ["pending", "fulfilled"]
    }
})

const transactionModel=new model("transaction",transactionSchema)

export default transactionModel;