import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
 import { isAuthorized } from "../../midderware/authorization.js";
 import { isAuthenticated } from "../../midderware/authentication.js";
 import { roles } from "../../utils/constant/enum.js";
import { addQuizVal, DeleteQuizval, startQuizval, updateQuizVal } from "./quiz.validation.js";
import { addQuiz, DeleteQuiz, EndQuiz, getallQuiz, getQuizBySubject, getspecificQuiz, startQuiz, updateQuiz } from "./quiz.controller.js";




const quizrouter=Router()

//----------------1-quiz-----------------
//1- add quiz
quizrouter.post('/addquiz',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(addQuizVal),asyncHandler(addQuiz))
//2-update quiz
quizrouter.put('/:quizId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(updateQuizVal),asyncHandler(updateQuiz))
//3-get all quiz 
quizrouter.get('/',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getallQuiz))
//4-get specific quiz
quizrouter.get('/:quizId',isAuthenticated(),isAuthorized([roles.TEACHER,roles.STUDENT]), asyncHandler(getspecificQuiz))
//5-delete specific quiz
quizrouter.delete('/:quizId',isAuthenticated(),isAuthorized([roles.TEACHER]),isValid(DeleteQuizval), asyncHandler(DeleteQuiz))
//6- getquizBySubject
quizrouter.get('/subject/:subjectId',asyncHandler(getQuizBySubject))
//7- startquiz
quizrouter.post('/startquiz',isAuthenticated(),isAuthorized([roles.STUDENT]),isValid(startQuizval),asyncHandler(startQuiz))
//8- ebdquiz
quizrouter.post('/endquiz/:quizId',isAuthenticated(),isAuthorized([roles.STUDENT]),asyncHandler(EndQuiz))


export default quizrouter