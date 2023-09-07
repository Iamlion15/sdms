import { Schema, model } from 'mongoose'

const seedSchema = new Schema({
    seedname:{
        type:String,
        required:true,
        unique:true
    },
    detail:{
        type:String
    },
    manudate:{
        type:Date,
        required:true
    },
},{timestamps:true})

const seedsModel=model("seed",seedSchema);

export default seedsModel;
