import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addLinkVal = joi.object({
    
     name:generalFields.name.required(), 
     subjectId:generalFields.objectId.required(), 
     link:generalFields.name.required(),
})

export const updateLinklVal = joi.object({
    linkId:generalFields.objectId,
    name:generalFields.name.optional(),
    link:generalFields.name.optional(),
    subjectId:generalFields.objectId.optional(),
})

export const DeleteLinkval=joi.object({
    linkId:generalFields.objectId
})