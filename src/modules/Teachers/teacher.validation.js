import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addTeacherVal = joi.object({
    
    userId:generalFields.objectId,
    classId:generalFields.objectId,
    subjectes:joi.array().items(joi.string().hex().length(24)).required()
})

export const updateTeacherlVal = joi.object({
    teacherId:generalFields.objectId,
    userId:generalFields.objectId.optional(),
    classId:generalFields.objectId.optional(),
    subjectes:joi.array().items(joi.string().hex().length(24)).optional()
})

export const DeleteTeacherval=joi.object({
    teacherId:generalFields.objectId
})