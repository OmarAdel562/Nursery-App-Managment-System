import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addclassVal = joi.object({
    name:generalFields.name.required(),
     

})

export const updateclassVal = joi.object({
    classId:generalFields.objectId,
    name:generalFields.name, 
})

export const Deleteclassval=joi.object({
    classId:generalFields.objectId
})