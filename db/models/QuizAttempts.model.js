import { model, Schema } from "mongoose";

//schema
const quizattemptsSchema= new Schema(
    {
        studentId: { type:Schema.Types.ObjectId,ref:"Student",  required:true },
        quizId: {  type:Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, default: 0 }, 
        startedAt: { type: Date },
        endedAt: { type: Date }
       
},{timestamps:true})
//model
export const QuizAttempts= model('QuizAttempts',quizattemptsSchema)