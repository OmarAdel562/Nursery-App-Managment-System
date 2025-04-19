import { AppErorr } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"
import { Subject } from "../../../db/models/Subject.model.js"
import { Question } from "../../../db/models/Question.model.js"


//-------------------------- question----------------------
//--------------------------1-add question------------------------
export const addQuestion=async(req,res,next) =>{
    //get data from req
     let {question,options,correctAnswer , subjectId}=req.body
     //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }

     const questionn= new Question({
        question,
        options,
        correctAnswer,
        subjectId,
        createdBy:req.authUser._id
     })
     //add to db
     const createdquestion=await questionn.save()
     if(!createdquestion){
        return next( new AppErorr(message.question.fileToCreate,500))
     }
     return res.status(201).json({message:message.question.createsuccessfully,
        success:true,
        data:createdquestion})

}
//---------------2-update question---------------
export const updateQuestion= async (req,res,next) => {
        //get data from req
        let {question,options,correctAnswer , subjectId }=req.body
        const { questionId } =req.params
        //check existance
        const questionExist= await Question.findById(questionId)
        if(!questionExist){
            return next( new AppErorr(message.question.notFound,404))
        }
        //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
        // prepare data
        if(question){[
            
            questionExist.question=question,
            questionExist.options=options,
            questionExist.correctAnswer=correctAnswer,
            questionExist.subjectId=subjectId, 
        ]}
        //update  to db
        const updatequestion= await questionExist.save()
        if(!updatequestion){
            return next( new AppErorr(message.question.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.question.updatesuccessfully,
            success:true,
            data:updatequestion
        })
}
//---------------------3-getall question----------------------------   
export const getallquestion= async (req,res,next) => {
    //get data from req
    const questiones=await Question.find()
    res.status(200).json({success:true,data:questiones})      
}
//---------------4-get specific question-------------------------
export const getspecificQuestion= async (req,res,next) => {
    //get data from req
    const { questionId } =req.params
    const question=await Question.findById(questionId)
    question?
    res.status(200).json({ success:true,data:question})
        : next (new AppErorr(message.question.notFound,404))
}
//-------------5-delete question-------------------------------------
export const DeleteQuestion= async (req,res,next) => {
    //get data from req
    const { questionId } =req.params
        const question = await  Question.findByIdAndDelete(questionId);
        if (!question) {
          return next(new AppErorr(message.question.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.question.deletesuccessfully,
        success:true
    })
}
//-----------------------6-get subject questiones-------------
export const getQuestionsBySubject = async (req, res) => {
        const { subjectId } = req.params; 
        const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return res.status(404).json({ success: false, message:message.subject.notFound });
     }
        const questions = await Question.find({ subjectId }).lean();
        if (questions.length === 0) {
            return res.status(404).json({ success: false, message:message.question.notFound });
        }
        res.status(200).json({success:true,data:questions})
}