import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addsubjectVal = joi.object({
    name:generalFields.name.required(),
    description:generalFields.description.required()

})

export const updatesubjectVal = joi.object({
    subjectId:generalFields.objectId,
    name:generalFields.name.optional(),
    description:generalFields.description.optional()

    

})

export const Deletesubjectval=joi.object({
    subjectId:generalFields.objectId
})