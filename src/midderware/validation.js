//import modules
import joi from "joi";
import  { AppError}  from "../utils/AppError.js";
import { attendancestatus, roles } from "../utils/constant/enum.js";

const parseArray=(value,helper) =>{
    let data= value
    let schema = joi.array().items(joi.string())
    const {error} = schema.validate(data)
    if(error){
        return helper(error.details)
    }
    return true
}
export const generalFields = {
    name: joi.string(),
    title:joi.string(),
    description:joi.string().max(2000),
    objectId:joi.string().hex().length(24),
    age:joi.number(),
    subjects:joi.custom(parseArray),
    status:joi.string().valid(...Object.values(attendancestatus)),
    role:joi.string().valid(...Object.values(roles)),
    email: joi.string().email(),
    phone: joi.string().pattern(new  RegExp(/^01[0-2,5]{1}[0-9]{8}$/)),
    password:joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cpassword: joi .string().valid(joi.ref('password')),
    DOB:joi.string(),
    gander: joi.string(),
    date: joi.string(),
    score:joi.number(),
    max_score:joi.number(),
    link: joi.string().max(200),
    lesson: joi.string(),
    message: joi.string().max(2000),
    questions: joi.string(),
    question: joi.string().max(50),
    options: joi.string(),
    correctAnswer:joi.string(),
    report: joi.string().max(3000),
    duration:joi.number(),
    numQuestions:joi.number(),
    grades:joi.string()

}
export const isValid = (schema) =>{
    return( req, res, next ) => {
        let data={...req.body,...req.params,...req.query}
        const {error} = schema.validate(data, {abortEarly:false})
        if(error){
             const errArr=[]
             error.details.forEach((err)=>{errArr.push(err.message) })
            return next(new AppError (errArr,400))
        }
        next ()
    }
}