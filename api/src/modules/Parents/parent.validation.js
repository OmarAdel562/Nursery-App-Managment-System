import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addParentVal = joi.object({
    
    userId:generalFields.objectId,
    studentId:generalFields.objectId,
    //subjectes:joi.array().items(joi.string().hex().length(24)).required().objectId
})

export const updateParentlVal = joi.object({
    parentId:generalFields.objectId,
    userId:generalFields.objectId,
    studentId:generalFields.objectId,
})

export const DeleteParentval=joi.object({
    parentId:generalFields.objectId
})