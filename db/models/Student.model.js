import { model, Schema } from "mongoose";

//schema
const studentSchema= new Schema(
    {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  classId: { type:  Schema.Types.ObjectId,ref:'Class', required: true }, 
  //parentId: { type:Schema.Types.ObjectId, ref: 'Parent' },
  subjectes:[{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
        
        
       
},{timestamps:true})
//model
export const Student= model('Student',studentSchema)