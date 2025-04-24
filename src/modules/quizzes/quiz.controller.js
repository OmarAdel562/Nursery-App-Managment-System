import { AppErorr } from "../../utils/AppError.js"
import { message } from "../../utils/constant/messages.js"
import { Subject } from "../../../db/models/Subject.model.js"
import { Quiz } from "../../../db/models/Quiz.model.js"
import { Question } from "../../../db/models/Question.model.js"
import { QuizAttempts } from "../../../db/models/QuizAttempts.model.js"
import { Class } from "../../../db/models/Class.model.js"
import { Student } from "../../../db/models/Student.model.js"


//-------------------------- quiz----------------------
//--------------------------1-add quiz------------------------
export const addQuiz=async(req,res,next) =>{
    let {  title, subjectId, numQuestions, duration ,classId} = req.body;
    //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
     //   ckeck classexistance
    const classExist = await Class.findById(classId);
    if (!classExist) {
        return next(new AppErorr(message.class.notFound, 404));
    }
     //check titleexistance
     const titleExist=await Quiz.findOne({title})
     if(titleExist){
        return next( new AppErorr(message.quiz.alreadyExist,409))
     }
    if (numQuestions <= 0) {
        return next( new AppErorr(message.question.must,400))
    }
        const totalQuestions = await Question.countDocuments();

    if (totalQuestions < numQuestions) {
        return next(new AppErorr(message.question.notenough, 404));
    }
    
    const questions = await Question.aggregate([ 
        { $sample: { size: numQuestions } } 
    ])
    // if (questions.length ==! numQuestions) {
    //     return next( new AppErorr(message.question.notenough,400))
    // }
     //prepare data
    const newQuiz = new Quiz({
        title,
        subjectId,
        classId,
        questions:questions.map(q => q._id), 
        duration,  
        createdBy:req.authUser._id
    });
     //add to db
      const createdQuiz= await newQuiz.save();
        if(!createdQuiz){
            return next( new AppErorr(message.quiz.fileToCreate,500))
         }
         
      const students = await Student.find({ classId }).select("userId")
       const studentIds = students.map(student => student.userId);

      await Student.updateMany({ _id: { $in: studentIds } }, { $push: { quizzes: newQuiz._id } })
      //send response
         return res.status(201).json({
          message:message.quiz.createsuccessfully,
            success:true,
            data:createdQuiz})
}
//---------------2-update quiz---------------
export const updateQuiz= async (req,res,next) => {
        //get data from req
        let {title, subjectId, numQuestions, duration ,classId}=req.body
        const { quizId } =req.params
        
    
        //check existance
        const quizExist= await Quiz.findById(quizId)
        if(!quizExist){
            return next( new AppErorr(message.quiz.notFound,404))
        }
         //   ckeck classexistance
    const classExist = await Class.findById(classId);
    if (!classExist) {
        return next(new AppErorr(message.class.notFound, 404));
    }
        //check nameexistance
        const titleExist= await Quiz.findOne({title,_id:{$ne:quizId }})
        if(titleExist){
            return next( new AppErorr(message.quiz.alreadyExist,404))
        }
        //check existance
     const subjectExist=await Subject.findById(subjectId)
     if(!subjectExist){
        return next( new AppErorr(message.subject.notFound,404))
     }
        // prepare data
        if(title){[
            
            quizExist.title=title,
            quizExist.numQuestions=numQuestions,
            quizExist.duration=duration, 
            quizExist.subjectId=subjectId,
            quizExist.classId=classId,
        ]}
    
        //update  to db
        const updatequiz= await quizExist.save()
        if(!updatequiz){
            return next( new AppErorr(message.quiz.fileToUpdate,500))
        }
        //send response
        return res.status(200).json({
            message:message.quiz.updatesuccessfully,
            success:true,
            data:updatequiz
        })
}
//---------------------3-getall quiz----------------------------      
export const getallQuiz= async (req,res,next) => {
    //get data from req
    const quiz=await Quiz.find().select('-createdBy -createdAt -updatedAt -__v')   
    res.status(200).json({message:"get successfully",success:true,data:quiz})      
}
//---------------4-get specific quiz-------------------------
export const getspecificQuiz= async (req,res,next) => {
    //get data from req
    const { quizId } =req.params
    const quiz=await Quiz.findById(quizId).select('-createdBy -createdAt -updatedAt -__v')   
    quiz?
    res.status(200).json( {message:"get successfully",success:true,data:quiz})
        : next (new AppErorr(message.quiz.notFound,404))
}
//-------------5-delete quiz-------------------------------------
export const DeleteQuiz= async (req,res,next) => {
    //get data from req
    const { quizId } =req.params
        const quiz = await Quiz.findByIdAndDelete(quizId);
        if (!quiz) {
          return next(new AppErorr(message.quiz.notFound, 404));
        }
       //send response
       return res.status(200).json({
        message:message.quiz.deletesuccessfully,
        success:true,
        data:{}
    })
}
//-----------------------6-get subject quiz-------------
export const getQuizBySubject = async (req, res) => {
          const { subjectId } = req.params; 
          const subjectExist=await Subject.findById(subjectId)
       if(!subjectExist){
          return res.status(404).json({ message:message.subject.notFound,success:false,data:{}  });
       }
          const quizzes = await Quiz.find({ subjectId }).select('-createdBy -createdAt -updatedAt -__v')   
          if (quizzes.length === 0) {
              return res.status(404).json({ message:message.quiz.notFound,success:false,data:{}  });
          }
          res.status(200).json({message:"get successfully",success:true,data:quizzes})
} 
// -----------------------7- start quiz--------------
export const startQuiz = async (req, res, next) => {
    const { studentId, quizId } = req.body;
    // checkexistance
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
        return next(new AppErorr(message.quiz.notFound, 404));
    }
    //  
    const newAttempt = new QuizAttempts({
        studentId,
        quizId,
        startedAt: new Date()
    });
     await newAttempt.save();
    res.status(200).json({ message: "quiz is starte  ", data:{attemptId: newAttempt._id} });
}
//----------8-end quiz-------------------------
export const EndQuiz = async (req, res, next) => {
    const { quizId } = req.params
    const { answers } = req.body
    const studentId = req.authUser._id
  
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return next(new AppErorr(message.question.notFound, 404));
    }
    let score = 0;
    for (const question of quiz.questions) {
      const answer = answers.find(ans => ans.questionId === question._id.toString());
      if (answer && answer.selectedOption === question.correctAnswer) {
        score++;
      }
    }
    const attempt = await QuizAttempts.create({
      studentId,
      quizId,
      score
    });
    res.status(201).json({
      message: "Quiz submitted successfully",
      success: true,
      data: {
        score,
        total: quiz.questions.length
      }
    })
}