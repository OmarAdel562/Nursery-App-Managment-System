import { model, Schema } from "mongoose";

//schema
const gradeSchema= new Schema(
    {
        
        studentId:{ 
            type: Schema.Types.ObjectId,
            ref:"Student",
            required:true 
         },
         subjectId:{ 
            type: Schema.Types.ObjectId,
            ref:"Subject",
            required:true 
         },
        quizId:{ 
                type: Schema.Types.ObjectId,
                ref:"Quiz",
                required:false 
             }, 
         assigmentId:{ 
            type: Schema.Types.ObjectId,
            ref:"Assigment",
            required:false 
         }, 
         score:{type:Number,required:true},
         max_score:{type:Number,required:true},

        createdBy:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
       
},{timestamps:true})
//model
export const Grade= model('Grade',gradeSchema)