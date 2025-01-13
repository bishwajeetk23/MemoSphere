import mongoose, { Types } from "mongoose";

const contentType = ['image','video','article','audio'];

const contentSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: contentType,
        require:true
    },
    link:{
        type: String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    tags:{
        type: [{
            type: Types.ObjectId,
            ref:'Tag'
        }],
    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        require:true
    }
});

export const ContentModel = mongoose.model('Content',contentSchema);