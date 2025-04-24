import { Attendance } from '../../../db/models/Attendance.model.js';
import { message } from '../../utils/constant/messages.js';
import axios from 'axios';
import { User } from '../../../db/models/User.model.js';
import AppError from '../../utils/AppError.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Replace with your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

// Utility to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ---------------------1-تسجيل الحضور---------------------------------
export const markAttendance = async (req, res, next) => {
    try {
        const { userId, uploadedImage } = req.body; // `uploadedImage` is the file to be uploaded

        // Step 1: Validate request parameters
        if (!userId || !uploadedImage) {
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
            const uploadResponse = await cloudinary.uploader.upload(uploadedImage, {
                folder: 'attendance_images', // Optional: Organize images in a folder
            });
            uploadedImageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        } catch (cloudinaryError) {
            console.error('Cloudinary Upload Error:', cloudinaryError.message);
            return next(new AppError('Failed to upload image. Please try again later.', 500));
        }

        // Step 5: Validate environment variables
        if (!process.env.FACE_API_KEY || !process.env.FACE_API_SECRET) {
            return next(new AppError('Face++ API credentials are missing', 500));
        }

        // Step 6: Compare images using Face++ API
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

        // Step 7: Process the response from Face++
        const { confidence, thresholds } = faceCompareResponse.data;
        const threshold = thresholds['1e-5']; // High precision threshold

        if (confidence < threshold) {
            return next(new AppError('Face does not match the profile picture', 403));
        }

        // Step 8: Mark attendance as present
        const attendance = new Attendance({
            studentId: userId,
            date: new Date().toISOString(), // Ensure UTC format
            status: 'present',
        });

        const createdAttendance = await attendance.save();
        if (!createdAttendance) {
            return next(new AppError(message.attendance.fileToCreate, 500));
        }

        // Step 9: Send a success response
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

// --------------------------2-تسجيل الانصراف---------------------------------
export const leaveAttendance = async (req, res, next) => {
    try {
        const { userId, uploadedImage } = req.body; // `uploadedImage` is the file to be uploaded

        // Step 1: Validate request parameters
        if (!userId || !uploadedImage) {
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
            const uploadResponse = await cloudinary.uploader.upload(uploadedImage, {
                folder: 'attendance_images', // Optional: Organize images in a folder
            });
            uploadedImageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        } catch (cloudinaryError) {
            console.error('Cloudinary Upload Error:', cloudinaryError.message);
            return next(new AppError('Failed to upload image. Please try again later.', 500));
        }

        // Step 5: Validate environment variables
        if (!process.env.FACE_API_KEY || !process.env.FACE_API_SECRET) {
            return next(new AppError('Face++ API credentials are missing', 500));
        }

        // Step 6: Compare images using Face++ API
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

        // Step 7: Process the response from Face++
        const { confidence, thresholds } = faceCompareResponse.data;
        const threshold = thresholds['1e-5']; // High precision threshold

        if (confidence < threshold) {
            return next(new AppError('Face does not match the profile picture', 403));
        }

        // Step 8: Mark attendance as leave
        const attendance = new Attendance({
            studentId: userId,
            date: new Date().toISOString(), // Ensure UTC format
            status: 'leave',
        });

        const createdLeave = await attendance.save();
        if (!createdLeave) {
            return next(new AppError(message.attendance.fileToCreate, 500));
        }

        // Step 9: Send a success response
        return res.status(201).json({
            message: message.attendance.createsuccessfully,
            success: true,
            data: createdLeave,
        });
    } catch (error) {
        // Error handling
        console.error('Error in leaveAttendance:', error.message);
        return next(new AppError(error.message || 'Internal server error', 500));
    }
};