import axios from 'axios';
import FormData from 'form-data';  


export const analyzePronunciation = async (req, res) => {
  try {
    // Get the text, language from request body
    const { word, lang } = req.body;

    // Check if required fields exist
    if (!req.file || !word || !lang) {  
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields. Please provide word, language, and audio file.' 
      });
    }

    const audioFile = req.file;  

    // Create form data for the API call
    const formData = new FormData();
    formData.append('text', word);
    formData.append('language', lang === 'en' ? 'en' : 'ar');

    // Convert the uploaded file to a format suitable for axios
    formData.append('file', audioFile.buffer, audioFile.originalname);

    // Call the pronunciation API
    const apiUrl = 'http://92.112.192.9:5000/upload_audio'; 

    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...formData.getHeaders() 
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
    
    // Check if the error is a response from the API
    if (error.response) {
      console.error('Error response from API:', error.response.data);
      // Return the API's error response if available
      return res.status(error.response.status).json({
        status: 'error',
        message: error.response.data.message || 'Failed to process pronunciation analysis',
        details: error.response.data // Log the error details from the API
      });
    }

    // If there's no response from the API, log the error message
    console.error('Error message:', error.message);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to process pronunciation analysis',
      details: error.message // Provide the error message in the response
    });
  }
}
