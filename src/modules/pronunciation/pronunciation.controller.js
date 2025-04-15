import axios from 'axios'

export const analyzePronunciation = async (req, res, next) => {
  const { audio_url, word } = req.body

  if (!audio_url || !word) {
    return res.status(400).json({ status: 'error', message: 'audio_url and word are required' })
  }

  const response = await axios.post('http://localhost:5000/analyze', {
    audio_url,
    word
  })

  return res.status(200).json({
    status: 'success',
    result: response.data.result, 
  })
}
