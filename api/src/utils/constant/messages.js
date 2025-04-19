
const generateMessage = (entity) =>({

    alreadyExist:`${entity} already exist`,
    notFound:`${entity} not found `,
    fileToCreate:`fail to create ${entity}`,
    fileToUpdate:`fail to update ${entity}`,
    fileToDelete:`fail to delete ${entity}`,
    createsuccessfully:`${entity} created successfully`,
    updatesuccessfully:`${entity} updated successfully`,
    deletesuccessfully:`${entity} deleted successfully`
})
export const message = {
    attendance: generateMessage('attendance'),
    parent: generateMessage('parent'),
    teacher: generateMessage('teacher'),
    subject: generateMessage('subject'),
    user:{...generateMessage('user'),verified:"user verified successfully",invalidCreadentials:"invalid Creadentials",notauthorized:"user not authorized to access this api "},
    flie:{required:'file is required'},
    student: generateMessage("student"),
    class: generateMessage("class"),
    assigment:generateMessage('assigment'),
    material:generateMessage('material'),
    quiz:generateMessage('quiz'),
    grade:generateMessage('grade'),
    schedule:generateMessage('schedule'),
    attendance:generateMessage('attendance'),
    link:generateMessage('link'),
    report:generateMessage('report'),
    notification:generateMessage('notification'),
    appointment:generateMessage('appointment'),
    question:{...generateMessage('question'),notenough:"The number of questions is not enough",must:"The number of questions must be greater than 0."}
    

}