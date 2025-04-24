import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addQuizVal = joi.object({
    
    title:generalFields.name.required(),
    duration:generalFields.duration.required(),
    subjectId:generalFields.objectId,
    classId:generalFields.objectId,
    questions:generalFields.objectId,
    numQuestions:generalFields.numQuestions.required()
})

export const updateQuizVal = joi.object({
    quizId:generalFields.objectId,
    title:generalFields.name,
    duration:generalFields.duration,
    subjectId:generalFields.objectId,
    classId:generalFields.objectId,
    numQuestions:generalFields.numQuestions
})

export const DeleteQuizval=joi.object({
    quizId:generalFields.objectId
})

export const startQuizval=joi.object({
    quizId:generalFields.objectId,
    studentId:generalFields.objectId
})
