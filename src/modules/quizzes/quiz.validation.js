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
    title:generalFields.name.optional(),
    duration:generalFields.duration.optional(),
    subjectId:generalFields.objectId.optional(),
    classId:generalFields.objectId.optional(),
    numQuestions:generalFields.numQuestions.optional()
})

export const DeleteQuizval=joi.object({
    quizId:generalFields.objectId
})

export const startQuizval=joi.object({
    quizId:generalFields.objectId,
    studentId:generalFields.objectId
})
