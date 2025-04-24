import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addGradeVal = joi.object({ 
     studentId:generalFields.objectId,
     subjectId:generalFields.objectId,
     quizId:generalFields.objectId,
     assigmentId:generalFields.objectId, 
     score:generalFields.score.required(),
     max_score:generalFields.max_score.required() 
})
export const updateGradelVal = joi.object({
    gradeId:generalFields.objectId,
    studentId:generalFields.objectId,
     subjectId:generalFields.objectId,
     quizId:generalFields.objectId,
     assigmentId:generalFields.objectId, 
     score:generalFields.score,
     max_score:generalFields.max_score,
})
export const DeleteGradeval=joi.object({
    gradeId:generalFields.objectId
})