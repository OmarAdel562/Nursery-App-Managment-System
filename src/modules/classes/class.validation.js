import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addclassVal = joi.object({
    name:generalFields.name.required(),
    // teacherId:generalFields.objectId.required(),
    // studentId:generalFields.objectId.required(), 

})

export const updateclassVal = joi.object({
    classId:generalFields.objectId,
    name:generalFields.name.required(),
    // teacherId:generalFields.objectId.required(),
    // studentId:generalFields.objectId.required(), 
    
    

})

export const Deleteclassval=joi.object({
    classId:generalFields.objectId
})