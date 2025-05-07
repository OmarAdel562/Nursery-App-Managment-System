import axios from 'axios';

export const analyzePronunciation = async (req, res) => {
  try {
    // Get the text, language from request body
    const { word, lang } = req.body;
    
    // Check if required fields exist
    if (!req.files || !req.files.audio || !word || !lang) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields. Please provide text, language, and audio file.' 
      });
    }
    
    const audioFile = req.files.audio;
    
    // Create form data for the API call
    const formData = new FormData();
    formData.append('text', word);
    formData.append('language', lang === 'en' ? 'en' : 'ar');
    
    // Convert the uploaded file to a format suitable for axios
    const fileBuffer = audioFile.data;
    const blob = new Blob([fileBuffer], { type: audioFile.mimetype });
    formData.append('file', blob, audioFile.name);
    
    // Call the pronunciation API
    const apiUrl = 'https://92.112.192.9:5000/upload_audio'; // Replace with your actual API URL
    
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Return the API response to the client
    return res.status(200).json({
      status: response.data.status,
      target_text: response.data.target_text,
      user_text: response.data.user_text,
      accuracy: response.data.accuracy,
      feedback: response.data.feedback,
      recording_url: response.data.recording_url,
      correct_pronunciation_url: response.data.correct_pronunciation_url
    });
    
  } catch (error) {
    console.error('Error processing pronunciation analysis:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to process pronunciation analysis' 
    });
  }
};