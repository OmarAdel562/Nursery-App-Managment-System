import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addAssigmentlVal = joi.object({
    
     name:generalFields.name.required(), 
     subjectId:generalFields.objectId, 
     classId:generalFields.objectId, 
     dueDate:generalFields.date.required()

})

export const updateAssigmentlVal = joi.object({
    assigmentId:generalFields.objectId,
    name:generalFields.name.required(),
    subjectId:generalFields.objectId,
    classId:generalFields.objectId,
    dueDate:generalFields.date.required(),
})

export const DeleteAssigmentval=joi.object({
    assigmentId:generalFields.objectId
})