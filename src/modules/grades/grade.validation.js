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
    studentId:generalFields.objectId.optional(),
     subjectId:generalFields.objectId.optional(),
     quizId:generalFields.objectId.optional(),
     assigmentId:generalFields.objectId.optional(), 
     score:generalFields.score.optional(),
     max_score:generalFields.max_score.optional(),
})
export const DeleteGradeval=joi.object({
    gradeId:generalFields.objectId
})