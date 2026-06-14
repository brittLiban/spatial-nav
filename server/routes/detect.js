const express = require('express')

const router = express.Router()
const PYTHON_DETECT_URL = process.env.PYTHON_DETECT_URL || 'http://127.0.0.1:3002'

router.post('/', async (req, res) => {
  const { image } = req.body

  if (!image) {
    return res.status(400).json({ error: 'image (base64) is required' })
  }

  try {
    const response = await fetch(`${PYTHON_DETECT_URL}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (err) {
    console.error('Detection proxy error:', err.message)
    res.status(503).json({
      error: 'Detection service unavailable. Start: cd server/python && python detect_app.py',
    })
  }
})

module.exports = router
