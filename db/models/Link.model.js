import { model, Schema } from "mongoose";

//schema
const linkSchema= new Schema(
    {
        
        name: {
             type: String, 
             required: true 
            }, 
        link: {
                type: String, 
                required: true 
               },
        subjectId: { type:Schema.Types.ObjectId, ref: 'Subject', required: true },            
        createdBy:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
       
},{timestamps:false})
//model
export const Link= model('Link',linkSchema)