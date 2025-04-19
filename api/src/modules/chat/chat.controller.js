import axios from 'axios'

export const sendToAIChatbot = async (req, res, next) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ status: 'error', message: 'Message is required' })
  }

  const response = await axios.post('http://localhost:5000/chat', { message })

  return res.status(200).json({
    status: 'success',
    reply: response.data.response,
  })
}