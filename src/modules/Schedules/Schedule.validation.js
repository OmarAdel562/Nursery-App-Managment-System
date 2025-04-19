import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addScheduleVal = joi.object({
    
    userId:generalFields.objectId.required(), 

})

export const updateScheduleVal = joi.object({
    scheduleId:generalFields.objectId,
    userId:generalFields.objectId.required(), 
    
    

})

export const DeleteScheduleval=joi.object({
    scheduleId:generalFields.objectId
})