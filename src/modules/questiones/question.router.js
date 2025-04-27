import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addQuestion, DeleteQuestion, getallquestion, getQuestionsBySubject, getspecificQuestion, updateQuestion } from "./question.controller.js";
import { addQuestionVal, DeleteQuestionval, updateQuestionVal } from "./question.validation.js";



const questionrouter=Router()

//----------------1-question-----------------
//1- add question
questionrouter.post('/addquestion',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(addQuestionVal),asyncHandler(addQuestion))
//2-update question
questionrouter.put('/:questionId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(updateQuestionVal),asyncHandler(updateQuestion))
//3-get all question 
questionrouter.get('/',isAuthenticated(),isAuthorized([roles.TEACHER]), asyncHandler(getallquestion))
//4-get specific question
questionrouter.get('/:questionId',isAuthenticated(),isAuthorized([roles.TEACHER]), asyncHandler(getspecificQuestion))
//5-delete specific question
questionrouter.delete('/:questionId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(DeleteQuestionval), asyncHandler(DeleteQuestion))
//6- getQuestionsBySubject
questionrouter.get('/subject/:subjectId',asyncHandler(getQuestionsBySubject))

export default questionrouter