// ML COMPONENT: LLM
const express = require('express')
const Groq = require('groq-sdk')

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const GROQ_MODEL = 'llama-3.1-8b-instant'

function buildFallback(objectClass, direction) {
  const label = objectClass.charAt(0).toUpperCase() + objectClass.slice(1)
  const directionPhrase = {
    left: 'on your left',
    right: 'on your right',
    ahead: 'ahead of you',
  }[direction] ?? direction
  return `${label} ${directionPhrase}`
}

router.post('/', async (req, res) => {
  const { class: objectClass, direction, confidence } = req.body
  const fallback = buildFallback(objectClass, direction)

  if (!objectClass || !direction) {
    return res.status(400).json({ error: 'class and direction are required' })
  }

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You generate spoken safety alerts for a blind person navigating with their phone camera.
Rules:
- Output ONLY the alert text, nothing else, no quotes, no punctuation at end
- Maximum 7 words
- Use natural direction language: "on your left", "ahead of you", "on your right"
- Lead with the object, follow with direction
- Examples: "Person on your left", "Car ahead of you", "Chair on your right"`
        },
        {
          role: 'user',
          content: `Object: ${objectClass}, Direction: ${direction}, Confidence: ${confidence}%`
        }
      ],
      max_tokens: 30,
      temperature: 0.3
    })

    const alertText = completion.choices[0].message.content.trim()
    res.json({ alertText })
  } catch (err) {
    console.error('Groq error:', err.message)
    res.json({ alertText: fallback })
  }
})

module.exports = router
