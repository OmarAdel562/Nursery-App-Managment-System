import { Router } from "express";
import { asyncHandler } from "../../utils/AppErrorr.js";
import { isAuthenticated } from "../../midderware/authentication.js";
import { isAuthorized } from "../../midderware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { upload, markAttendance, leaveAttendance } from "./attendance.controller.js";

const attendanceRouter = Router();

// ------------------ Routes for Attendance ------------------

// 1- Mark Attendance (with file upload)
attendanceRouter.post(
    "/createattendance",
    isAuthenticated, // Ensure the user is authenticated
    isAuthorized(roles.STUDENT), // Ensure the user has the correct role
    upload.single("uploadedImage"), // Use multer to handle single file upload
    asyncHandler(markAttendance) // Call the controller function
);

// 2- Leave Attendance (with file upload)
attendanceRouter.post(
    "/leaveattendance",
    isAuthenticated, // Ensure the user is authenticated
    isAuthorized(roles.STUDENT), // Ensure the user has the correct role
    upload.single("uploadedImage"), // Use multer to handle single file upload
    asyncHandler(leaveAttendance) // Call the controller function
);

export default attendanceRouter;