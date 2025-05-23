import axios from 'axios'

export const sendToAIChatbot = async (req, res, next) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ status: 'error', message: 'Message is required' })
  }
//api done
  const response = await axios.post('http://92.112.192.9:5001/chat', { message })
  return res.status(200).json({
    message:"message get successfully",
    status: 'success',
    reply: response.data.response,
  })
}