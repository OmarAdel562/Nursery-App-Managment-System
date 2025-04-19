import { model, Schema } from "mongoose";

//schema
const quizattemptsSchema= new Schema(
    {
        studentId: { type:Schema.Types.ObjectId,ref:"User",  required:true },
        quizId: {  type:Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, default: 0 }, 
       
},{timestamps:true})
//model
export const QuizAttempts= model('QuizAttempts',quizattemptsSchema)