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
        console.log('Validating request parameters:', { userId, file });
        if (!userId || !file) {
            console.error('Missing required fields: userId or file');
            return next(new AppError(message.student.notFound, 404));
        }

        if (!isValidObjectId(userId)) {
            console.error('Invalid user ID:', userId);
            return next(new AppError('Invalid user ID', 400));
        }

        // Step 2: Check if the student exists
        console.log('Checking if student exists in the database with userId:', userId);
        const student = await User.findOne({ _id: userId });
        if (!student) {
            console.error('Student not found with userId:', userId);
            return next(new AppError(message.student.notFound, 404));
        }

        // Step 3: Get the student's profile picture
        const studentImageUrl = student.profilePic?.secure_url;
        console.log('Student profile image URL:', studentImageUrl);
        if (!studentImageUrl) {
            console.error('Student profile picture not found for userId:', userId);
            return next(new AppError('Student profile picture not found', 404));
        }

        // Step 4: Upload the uploaded image to Cloudinary
        let uploadedImageUrl;
        try {
            console.log('Uploading image to Cloudinary...');
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
            console.log('Image uploaded to Cloudinary. URL:', uploadedImageUrl);
        } catch (cloudinaryError) {
            console.error('Cloudinary Upload Error:', cloudinaryError.message);
            return next(new AppError('Failed to upload image. Please try again later.', 500));
        }

        // Step 5: Compare images using Face++ API
        console.log('Comparing images using Face++ API...');
        let faceCompareResponse;
        try {
            faceCompareResponse = await axios.post(
                'http://api-us.faceplusplus.com/facepp/v3/compare',
                null,
                {
                    params: {
                        api_key: process.env.FACE_API_KEY,
                        api_secret: process.env.FACE_API_SECRET,
                        image_url1: studentImageUrl, // Profile picture
                        image_url2: uploadedImageUrl, // Cloudinary URL of the uploaded image
                    },
                }
            );
            console.log('Face++ API Response:', faceCompareResponse.data);
        } catch (apiError) {
            console.error('Face++ API Error:', apiError.response?.data || apiError.message);
            return next(new AppError('Failed to compare faces. Please try again later.', 500));
        }

        // Step 6: Process the response from Face++
        const { confidence, thresholds } = faceCompareResponse.data;
        const threshold = thresholds['1e-5']; // High precision threshold
        console.log('Face comparison confidence:', confidence);
        if (confidence < threshold) {
            console.error('Face does not match the profile picture. Confidence:', confidence);
            return next(new AppError('Face does not match the profile picture', 403));
        }

        // Step 7: Mark attendance as present
        console.log('Marking attendance as present for userId:', userId);
        const attendance = new Attendance({
            studentId: userId,
            date: new Date().toISOString(), // Ensure UTC format
            status: 'present',
        });

        const createdAttendance = await attendance.save();
        if (!createdAttendance) {
            console.error('Failed to create attendance record');
            return next(new AppError(message.attendance.fileToCreate, 500));
        }

        // Step 8: Send a success response
        console.log('Attendance marked successfully for userId:', userId);
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
                        image_url1: studentImageUrl, // Profile picture
                        image_url2: uploadedImageUrl, // Cloudinary URL of the uploaded image
                    },
                }
            );
        } catch (apiError) {
            console.error('Face++ API Error:', apiError.response?.data || apiError.message);
            return next(new AppError('Failed to compare faces. Please try again later.', 500));
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
            status: 'leave',
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
};