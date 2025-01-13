import express from "express";
import dotenv from 'dotenv';
import { auth } from "./middlewares/auth";
import { UserModel } from "./models/user.models";
import connectDB from "./db";
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
app.post('/api/v1/signin',()=>{

});
// add new content end point
app.post('/api/v1/content',auth,()=>{

});
// fetch all content endpoint
app.get('/api/v1/content',auth,()=>{

});
// delete content end point
app.delete('',auth,()=>{

});
// share endpoint
app.get('',auth,()=>{});

// fetch others links
app.get('',auth,()=>{

});


// server is listening on port 8000
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}/`);
    
});