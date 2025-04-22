import { Notification } from "../../../db/models/Notification.model.js"
import { io } from "../../../index.js"
import { Parent } from "../../../db/models/Parent.model.js"
import { Student } from "../../../db/models/Student.model.js"



//-------------------------- Notification----------------------
//-------------------------------------------------------------
// دالة لإرسال إشعار تلقائي للطلاب وأولياء الأمور عند إضافة 
export const CreateNotification = async (req, res) => {
  const { title, message, classId, subjectId, type } = req.body;
  const studentsInClassAndSubject = await Student.find({ classId, subjectes: subjectId });
  for (const student of studentsInClassAndSubject) {
    const parent = await Parent.findOne({ studentId: student._id })
    const newNotification = new Notification({
      title,
      message,
      receiverStudent: student._id,
      receiverParent: parent?._id,
      type
    })
    await newNotification.save();
    io.emit(`student-${student._id}`, { title, message, type });
    if (parent?._id) {
      io.emit(`parent-${parent._id}`, { title, message, type });
    }
  }
  return res.status(201).json({  message: "Notification sent successfully to all students and parents" ,success:true,data:newNotification});
}

