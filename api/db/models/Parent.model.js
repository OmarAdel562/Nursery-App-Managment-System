import { model, Schema } from "mongoose";

//schema
const parentSchema= new Schema(
    {
        userId: { type:Schema.Types.ObjectId, ref: 'User', required: true }, 
        studentId: { type: Schema.Types.ObjectId, ref: 'Student'} ,
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },  
        
       
},{timestamps:true})
//model
export const Parent= model('Parent',parentSchema)