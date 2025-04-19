import { model, Schema } from "mongoose";
import { roles } from "../../src/utils/constant/enum.js"
//schema
const userSchema= new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            lowercase: true,
            trim:true
        },
        password:{
            type:String,
            required:true,
        },
        age:{
            type:String,
            required:true,
        },
        gander:{
            type:String,
            required:true,
        },
        phone:{
            type:String,
            required:true,
            
        },
        role:{
            type:String,
            enum:Object.values(roles),
            default:roles.MANAGMENT
        },
        
        profilePic:{
            secure_url:{type:String,required:false},
            public_id:{type:String,required:false}
        },
        DOB: {type:String,default:Date.now()},
        
        
       
},{timestamps:true})
//model
export const User= model('User',userSchema) 