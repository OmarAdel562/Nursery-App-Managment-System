import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const addchatVal = joi.object({
    message:generalFields.message.required(),
})