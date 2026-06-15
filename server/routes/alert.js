// ML COMPONENT: LLM
const express = require('express')
const Groq = require('groq-sdk')

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const GROQ_MODEL = 'llama-3.1-8b-instant'

function buildFallback(objectClass, direction, proximity) {
  const label = objectClass.charAt(0).toUpperCase() + objectClass.slice(1)
  if (proximity === 'immediate') {
    const phrase = { ahead: 'right in front of you', left: 'right beside you on the left', right: 'right beside you on the right' }[direction] ?? direction
    return `${label} ${phrase}!`
  }
  if (proximity === 'close') {
    const phrase = { ahead: 'close ahead', left: 'close on your left', right: 'close on your right' }[direction] ?? direction
    return `${label} ${phrase}`
  }
  const phrase = { left: 'on your left', right: 'on your right', ahead: 'ahead of you' }[direction] ?? direction
  return `${label} ${phrase}`
}

router.post('/', async (req, res) => {
  const { class: objectClass, direction, proximity, confidence } = req.body
  const fallback = buildFallback(objectClass, direction, proximity)

  if (!objectClass || !direction) {
    return res.status(400).json({ error: 'class and direction are required' })
  }

  try {
    const proximityContext = proximity === 'immediate'
      ? 'The object is very close — within arm\'s reach. This is urgent.'
      : proximity === 'close'
      ? 'The object is a few steps away.'
      : 'The object is at a distance.'

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You generate spoken safety alerts for a blind person navigating with their phone camera.
Rules:
- Output ONLY the alert text, nothing else, no quotes
- Maximum 8 words
- Lead with the object, follow with direction and urgency
- For immediate proximity, convey urgency: "Chair right in front of you!", "Person right beside you!"
- For close proximity: "Chair close ahead", "Person close on your left"
- For approaching: "Chair ahead of you", "Person on your right"`
        },
        {
          role: 'user',
          content: `Object: ${objectClass}, Direction: ${direction}, Confidence: ${confidence}%. ${proximityContext}`
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
