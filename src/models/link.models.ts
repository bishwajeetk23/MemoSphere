import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    hash:{
        type:String,
    },
    userId : {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true,
        unique:true,
    }
});

export const LinkModel = mongoose.model('Links',linkSchema);