import { Router } from "express";
import { asyncHandler } from "../../utils/AppError.js";
import { isValid } from "../../midderware/validation.js";
import { isAuthorized } from "../../midderware/authorization.js";
import { isAuthenticated } from "../../midderware/authentication.js";
import { roles } from "../../utils/constant/enum.js";
import { leaveAttendance, markAttendance } from "./attendance.controller.js";

const attendanceRouter = Router();

// ------------------ Routes for Attendance ------------------

// 1- Create Attendance (Mark Attendance)
attendanceRouter.post(
    "/createattendance",
    isAuthenticated, // Ensure the user is authenticated
    isAuthorized(roles.STUDENT), // Ensure the user has the correct role
    asyncHandler(markAttendance) // Call the controller function
);

// 2- Leave Attendance
attendanceRouter.post(
    "/leaveattendance",
    isAuthenticated, // Ensure the user is authenticated
    isAuthorized(roles.STUDENT), // Ensure the user has the correct role
    asyncHandler(leaveAttendance) // Call the controller function
);

export default attendanceRouter;