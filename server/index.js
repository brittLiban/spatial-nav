require('dotenv').config()
const express = require('express')
const cors = require('cors')
const alertRoute = require('./routes/alert')
const detectRoute = require('./routes/detect')

const app = express()
const PORT = process.env.PORT || 3001
const PYTHON_DETECT_URL = process.env.PYTHON_DETECT_URL || 'http://127.0.0.1:3002'

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/health', async (req, res) => {
  const status = { status: 'ok', detectService: 'down' }

  try {
    const response = await fetch(`${PYTHON_DETECT_URL}/health`)
    if (response.ok) {
      status.detectService = 'ok'
    }
  } catch {
    // Python YOLO service not running
  }

  res.json(status)
})

app.use('/alert', alertRoute)
app.use('/detect', detectRoute)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Expecting YOLO service at ${PYTHON_DETECT_URL}`)
  })
}

module.exports = app
