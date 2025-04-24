import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addLinkVal = joi.object({
    
     name:generalFields.name.required(), 
     subjectId:generalFields.objectId, 
     link:generalFields.name.required(),
})

export const updateLinklVal = joi.object({
    linkId:generalFields.objectId,
    name:generalFields.name,
    link:generalFields.name,
    subjectId:generalFields.objectId,
})

export const DeleteLinkval=joi.object({
    linkId:generalFields.objectId
})