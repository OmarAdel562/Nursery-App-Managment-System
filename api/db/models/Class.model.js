import { model, Schema } from "mongoose";

//schema
const classSchema= new Schema(
    {
        
        name: {
             type: String, 
             required: true
             }, 

        createdBy:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
       
},{timestamps:true})
//model
export const Class= model('Class',classSchema)