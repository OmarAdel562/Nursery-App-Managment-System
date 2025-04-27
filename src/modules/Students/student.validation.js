import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addStudentVal = joi.object({
    
    userId:generalFields.objectId,
    classId:generalFields.objectId,
    subjectes:joi.array().items(joi.string().hex().length(24)).required()
})

export const updateStudentlVal = joi.object({
    studentId:generalFields.objectId,
    userId:generalFields.objectId.optional(),
    classId:generalFields.objectId.optional(),
    subjectes:joi.array().items(joi.string().hex().length(24)).optional()
})

export const Deletestudentval=joi.object({
    studentId:generalFields.objectId
})