import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addMaterialVal = joi.object({
    
     name:generalFields.name.required(), 
     subjectId:generalFields.objectId, 
     classId:generalFields.objectId,
})
export const updateMaterialVal = joi.object({
    materialId:generalFields.objectId,
    name:generalFields.name.optional(),
    subjectId:generalFields.objectId.optional(),
    classId:generalFields.objectId.optional(),
})
export const DeleteMaterialval=joi.object({
    materialId:generalFields.objectId
})