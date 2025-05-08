import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { upload, markAttendance, leaveAttendance } from "./attendance.controller.js";

const attendanceRouter = Router();

// ------------------ Routes for Attendance ------------------

// 1- Mark Attendance (with file upload)
attendanceRouter.post(
    "/createattendance",
    upload.single("uploadedImage"), // Use multer to handle single file upload
    asyncHandler(markAttendance) // Call the controller function
);

// 2- Leave Attendance (with file upload)
attendanceRouter.post(
    "/leaveattendance",
    upload.single("uploadedImage"), // Use multer to handle single file upload
    asyncHandler(leaveAttendance) // Call the controller function
);

export default attendanceRouter;