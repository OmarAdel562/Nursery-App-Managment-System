import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addReportVal = joi.object({
    
    report:generalFields.report.required(), 
    studentId:generalFields.objectId, 
})

export const updateReportVal = joi.object({
    reportId:generalFields.objectId,
    report:generalFields.report.optional(), 
    studentId:generalFields.objectId.optional(),
    
})

export const DeleteReportVal=joi.object({
    reportId:generalFields.objectId
})