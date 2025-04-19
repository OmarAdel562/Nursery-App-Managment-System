import joi from "joi";
import { generalFields } from "../../midderware/validation.js";

export const adduserVal = joi.object({
    name:generalFields.name.required(),
    email:generalFields.email.required(),
    phone:generalFields.phone.required(),
    password:generalFields.password.required(),
    cpassword:generalFields.cpassword.required(),
    DOB:generalFields.DOB.required(),
    gander:generalFields.gander.required(),
    age:generalFields.age.required(),
    role:generalFields.role.required(),
    

})

export const updateuserVal = joi.object({
    userId:generalFields.objectId,
    name:generalFields.name.required(),
    email:generalFields.email.required(),
    phone:generalFields.phone.required(),
    password:generalFields.password.required(),
    cpassword:generalFields.cpassword.required(),
    DOB:generalFields.DOB.required(),
    gander:generalFields.gander.required(),
    age:generalFields.age.required(),
    role:generalFields.role.required(),
    

})

export const Deleteuserval=joi.object({
    userId:generalFields.objectId
})

export const signinval=joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
})
