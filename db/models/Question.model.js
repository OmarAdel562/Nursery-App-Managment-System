import { model, Schema } from "mongoose";

//schema
const questionSchema= new Schema(
    {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true,select:false },
        subjectId: { type:Schema.Types.ObjectId,ref:"Subject", required:true },
        createdBy:{
          type:Schema.Types.ObjectId,
          ref:"Teacher",
          required:true
      }  
       
},{timestamps:false})
//model
export const Question= model('Question',questionSchema)