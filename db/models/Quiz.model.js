import { model, Schema } from "mongoose";

//schema
const quizSchema= new Schema(
    {
      title: { type: String, required: true },
      subjectId: { type:Schema.Types.ObjectId, ref:"Subject", required:true },
      classId:{ type:Schema.Types.ObjectId, ref:"Class", required:true },
      questions: [{type:Schema.Types.ObjectId, ref:"Question", required:true}],
      duration: { type: Number, required: true },  
      createdAt: { type: Date, default: Date.now },
        createdBy:{
          type:Schema.Types.ObjectId,
          ref:"User",
          required:true
      }  
       
},{timestamps:false})
//model
export const Quiz= model('Quiz',quizSchema)