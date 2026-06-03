const express = require('express')
const Groq = require('groq-sdk')

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  const { object, position } = req.body
  const fallback = `there is a ${object} on the ${position}`

  if (!object || !position) {
    return res.status(400).json({ error: 'object and position are required' })
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a navigation assistant for a visually impaired person. Give a short, clear, natural safety alert. Max 10 words. No punctuation.'
        },
        {
          role: 'user',
          content: `there is a ${object} on the ${position}`
        }
      ],
      max_tokens: 30
    })
    const alert = response.choices[0].message.content.trim()
    res.json({ alert })
  } catch (err) {
    console.error('Groq error:', err.message)
    res.json({ alert: fallback })
  }
})

module.exports = router
