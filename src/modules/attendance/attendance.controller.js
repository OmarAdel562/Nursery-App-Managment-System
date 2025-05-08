import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'; // For image upload to Cloudinary
import { Attendance } from '../../../db/models/Attendance.model.js';
import { message } from '../../utils/constant/messages.js';
import axios from 'axios';
import { User } from '../../../db/models/User.model.js';
import mongoose from 'mongoose';
import { AppError } from '../../utils/AppError.js';

// Configure Multer for file upload
const storage = multer.memoryStorage(); // Store files in memory
export const upload = multer({ storage });

// Utility to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// -----------Mark Attendance Controller--------------
export const markAttendance = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const file = req.file; // Uploaded file

        // Step 1: Validate request parameters
        if (!userId || !file) {
            return next(new AppError(message.student.notFound, 404));
        }

        if (!isValidObjectId(userId)) {
            return next(new AppError('Invalid user ID', 400));
        }
        // Step 2: Check if the student exists
        const student = await User.findOne({ _id: userId });
        if (!student) {
            return next(new AppError(message.student.notFound, 404));
        }

        // Step 3: Get the student's profile picture
        const studentImageUrl = student.profilePic?.secure_url;
        if (!studentImageUrl) {
            return next(new AppError('Student profile picture not found', 404));
        }

        // Step 4: Upload the uploaded image to Cloudinary
        let uploadedImageUrl;
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'attendance_images' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(file.buffer); // send buffer to the stream
            });

            uploadedImageUrl = result.secure_url;
        } catch (cloudinaryError) {
            console.error('Cloudinary Upload Error:', cloudinaryError.message);
            return next(new AppError('Failed to upload image. Please try again later.', 500));
        }

        // Step 5: Compare images using Face++ API
     let faceCompareResponse;
try {
  faceCompareResponse = await axios.post(
    'https://api-us.faceplusplus.com/facepp/v3/compare',
    null,
    {
      params: {
        api_key: process.env.FACE_API_KEY,
        api_secret: process.env.FACE_API_SECRET,
        image_url1: studentImageUrl,
        image_url2: uploadedImageUrl,
      },
    }
  );
} catch (apiError) {
  const errorData = apiError?.response?.data;
  const apiMessage = errorData?.error_message || apiError.message || 'Unknown error';
  return next(new AppError(`Face++ API Error: ${apiMessage}`, 500));
}

        // Step 6: Process the response from Face++
        const { confidence, thresholds } = faceCompareResponse.data;
        const threshold = thresholds['1e-5']; // High precision threshold
        if (confidence < threshold) {
            return next(new AppError('Face does not match the profile picture', 403));
        }

        // Step 7: Mark attendance as present
        const attendance = new Attendance({
            studentId: userId,
            date: new Date().toISOString(), // Ensure UTC format
            status: 'present',
        });

        const createdAttendance = await attendance.save();
        if (!createdAttendance) {
            return next(new AppError(message.attendance.fileToCreate, 500));
        }

        // Step 8: Send a success response
        return res.status(201).json({
            message: message.attendance.createsuccessfully,
            success: true,
            data: createdAttendance,
        });
    } catch (error) {
        // Error handling
        console.error('Error in markAttendance:', error.message);
        return next(new AppError(error.message || 'Internal server error', 500));
    }
}
//---------------- Leave Attendance Controller-----------------------
export const leaveAttendance = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const file = req.file; // Uploaded file

        // Step 1: Validate request parameters
        if (!userId || !file) {
            console.error('Missing required fields: userId or file');
            return next(new AppError(message.student.notFound, 404));
        }

        if (!isValidObjectId(userId)) {
            console.error('Invalid user ID:', userId);
            return next(new AppError('Invalid user ID', 400));
        }

        // Step 2: Check if the student exists
        const student = await User.findOne({ _id: userId });
        if (!student) {
            return next(new AppError(message.student.notFound, 404));
        }

        // Step 3: Get the student's profile picture
        const studentImageUrl = student.profilePic?.secure_url;
        if (!studentImageUrl) {
            return next(new AppError('Student profile picture not found', 404));
        }

        // Step 4: Upload the uploaded image to Cloudinary
        let uploadedImageUrl;
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'attendance_images' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(file.buffer); // send buffer to the stream
            });

            uploadedImageUrl = result.secure_url;
        } catch (cloudinaryError) {
            console.error('Cloudinary Upload Error:', cloudinaryError.message);
            return next(new AppError('Failed to upload image. Please try again later.', 500));
        }

        // Step 5: Compare images using Face++ API
        let faceCompareResponse;
try {
  faceCompareResponse = await axios.post(
    'https://api-us.faceplusplus.com/facepp/v3/compare',
    null,
    {
      params: {
        api_key: process.env.FACE_API_KEY,
        api_secret: process.env.FACE_API_SECRET,
        image_url1: studentImageUrl,
        image_url2: uploadedImageUrl,
      },
    }
  );
} catch (apiError) {
  const errorData = apiError?.response?.data;
  const apiMessage = errorData?.error_message || apiError.message || 'Unknown error';
  return next(new AppError(`Face++ API Error: ${apiMessage}`, 500));
}

        // Step 6: Process the response from Face++
        const { confidence, thresholds } = faceCompareResponse.data;
        const threshold = thresholds['1e-5']; // High precision threshold
        if (confidence < threshold) {
            return next(new AppError('Face does not match the profile picture', 403));
        }

        // Step 7: Mark leave as present
        const attendance = new Attendance({
            studentId: userId,
            date: new Date().toISOString(), // Ensure UTC format
            status: 'leave',
        });

        const createdLeave = await attendance.save();
        if (!createdLeave) {
            return next(new AppError("Failed to create leave record", 500));
        }

        // Step 8: Send a success response
        return res.status(201).json({
            message: "Leave created successfully",
            success: true,
            data: createdLeave,
        });
    } catch (error) {
        // Error handling
        console.error('Error in markLeave:', error.message);
        return next(new AppError(error.message || 'Internal server error', 500));
    }
}