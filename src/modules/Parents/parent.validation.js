import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addParentVal = joi.object({
    
    userId:generalFields.objectId,
    studentId:generalFields.objectId,
    
})

export const updateParentlVal = joi.object({
    parentId:generalFields.objectId,
    userId:generalFields.objectId.optional(),
    studentId:generalFields.objectId.optional(),
})

export const DeleteParentval=joi.object({
    parentId:generalFields.objectId
})