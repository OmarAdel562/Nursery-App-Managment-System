import { model, Schema } from "mongoose";

//schema
const reportSchema= new Schema(
    {
        
        report: {
             type: String, 
             required: true }, 
        studentId:{ 
            type: Schema.Types.ObjectId,
            ref:"Student",
            required:true 
         },

        createdBy:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
       
},{timestamps:true})
//model
export const Report= model('Report',reportSchema)