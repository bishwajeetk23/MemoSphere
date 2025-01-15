import express from "express";
import dotenv from 'dotenv';
import { auth } from "./middlewares/auth";
import { UserModel } from "./models/user.models";
import jwt from "jsonwebtoken";
import connectDB from "./db";
import {  JWT_SECRET } from "./constant";
import { ContentModel } from "./models/content.models";
import { LinkModel } from "./models/link.models";
import { random } from "./utils/hashGenerator";
dotenv.config();
const app = express();
app.use(express.json());
connectDB().then((error)=>{

}).catch((error)=>{
    console.log("Mongo db connection failed !!!", error);
    
});
const port : string = process.env.PORT || '3000';
app.get('/',(req,res)=>{
    res.send("Server is running");
})
// sign in end point
app.post('/api/v1/signup',async (req,res)=>{
    // TODO: add zod validation , Hash the password, also add whole validation and specific status code from slides
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username: username,
            password: password
        });

        res.json({
            message: "User signed up"
        });
    } catch (error) {
        console.log(error);
        
        res.status(411).json({
            message: "User already exist"
        });
    }
    


});
// sign up end point
app.post('/api/v1/signin',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try {
        const userExist = await UserModel.findOne({
            username,
            password
        });
        if(!userExist){
            res.status(403).json({
                message:"provide valid username"
            });
        }else{
            const SECRET = JWT_SECRET;
            if(!SECRET){
                throw new Error('JWT_SECRET is not defined in the environment variables');
            }
            const token = jwt.sign({
                id: userExist._id
            },SECRET);
            
            res.json({
                token
            });
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "server error"
        });   
    }
});
// add new content end point
app.post('/api/v1/content',auth,async (req,res)=>{
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    
   try {
        await ContentModel.create({
            link,
            type,
            title,
            // TODO: remove ts ignore 
            //@ts-ignore
            userId: req.userId,
            tags:[]
        });
        res.json({
            message:"Content added"
        });
   } catch (error) {
        res.status(411).json({
            message:"something went wrong"
        });
   }
});
// fetch all content endpoint
app.get('/api/v1/content',auth,async (req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    try {
        const content = await ContentModel.find({
            userId: userId
        }).populate("userId","username createdAt");
        // want to populate user info in content as well so need to use .populate() from mongoose 
        // also want only specific columns like username and createdAt
        res.json({
            content
        });
    } catch (error) {
        res.json({
            message: "something went wrong"
        });
    }
});
// delete content end point
app.delete('/api/v1/content',auth,async (req,res)=>{
    const contentId = req.body.contentId;
    try {
        await ContentModel.deleteMany({
            _id:contentId,
            // @ts-ignore
            userId: req.userId
        });
        res.json({
            message:"Deleted successfully!!!"
        });
    } catch (error) {
        res.status(411).json({
            message: "content not deleted. Something went wrong!!!"
        });
    }
});
// share endpoint
// this api is voilating single responsibility principle
app.post('/api/v1/brain/share',auth,async (req,res)=>{
    const share = req.body.share;
    if(share){
            const ExistingLink = await LinkModel.findOne({
                // @ts-ignore
                userId:req.userId,
            });
            if(ExistingLink){
                res.json({
                    link: '/api/v1/brain/'+ExistingLink.hash
                });
                return;
            }
        const hash = random(10);
        await LinkModel.create({
            // @ts-ignore
            userId:req.userId,
            hash: hash
        });
        res.json({
            link: '/api/v1/brain/'+hash
        });
    }else{
        
        await LinkModel.deleteOne({
            // @ts-ignore
            userId:req.userId,
        });
        res.json({
           message: "Share disabled!!!"
        });
    }
});

// fetch others links
// this api gives data showing to world without sign in. 
app.get('/api/v1/brain/:shareLink',async (req,res)=>{
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message:"invalid link"
        });
        return;
    }
    // userId content using hash code 
    const content = await ContentModel.find({
        userId:link.userId
    });
    // getting username using userid from hash
    const user = await UserModel.findOne({
        _id:link.userId
    });

    if(!user){
        res.status(411).json({
            message:"user not found, error should ideally not happen"
        });
        return;
    }

    // (?.) is called optional chaining
    res.json({
        username:user.username,
        content:content,
    });

});


// server is listening on port 8000
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}/`);
    
});