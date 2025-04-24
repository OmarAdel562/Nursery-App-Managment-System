import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { upload, markAttendance, leaveAttendance } from "./attendance.controller.js";

const attendanceRouter = Router()

// ------------------ Routes for Attendance ------------------

//------1- Mark Attendance (with file upload)
attendanceRouter.post( "/createattendance", upload.single("uploadedImage"),asyncHandler(markAttendance))

//----2- Leave Attendance (with file upload)
attendanceRouter.post( "/leaveattendance",upload.single("uploadedImage"), asyncHandler(leaveAttendance))

export default attendanceRouter