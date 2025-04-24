// import axios from 'axios'
//
// export const analyzePronunciation = async (req, res, next) => {
//   const { audio_url, word } = req.body
//
//   if (!audio_url || !word) {
//     return res.status(400).json({ status: 'error', message: 'audio_url and word are required' })
//   }
//
//   const response = await axios.post('http://localhost:5000/analyze', {
//     audio_url,
//     word
//   })
//
//   return res.status(200).json({
//     status: 'success',
//     result: response.data.result,
//   })
// }
import axios from 'axios';
import cloudinary from 'cloudinary';

export const analyzePronunciation = async (req, res, next) => {
  const { word } = req.body;
  const audioFile = req.files.audio; // Assuming your audio file field is named 'audio'

  if (!audioFile || !word) {
    return res.status(400).json({ status: 'error', message: 'An audio file and a word are required' });
  }

  try {
    // Upload the audio file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
      resource_type: 'audio', // Specify that it's an audio file
    });

    const audio_url = uploadResult.secure_url;

    // Call your pronunciation analysis API
    const response = await axios.post('http://localhost:5000/analyze', {
      audio_url,
      word,
    });

    return res.status(200).json({
      status: 'success',
      result: response.data.result,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary or calling analysis API:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to process audio analysis' });
  }
};