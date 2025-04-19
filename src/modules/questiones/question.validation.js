import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addQuestionVal = joi.object({
    
    question:generalFields.question.required(),
    options:generalFields.options.required(),
    correctAnswer:generalFields.correctAnswer.required(), 
     subjectId:generalFields.objectId, 
})
export const updateQuestionVal = joi.object({
    questionId:generalFields.objectId,
    question:generalFields.question.required(),
    options:generalFields.options.required(),
    correctAnswer:generalFields.correctAnswer.required(), 
     subjectId:generalFields.objectId, 
})
export const DeleteQuestionval=joi.object({
    questionId:generalFields.objectId
})