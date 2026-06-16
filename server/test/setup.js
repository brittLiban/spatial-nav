// Ensure the alert route's Groq client can be constructed without a real key.
// (Integration tests mock groq-sdk; this just satisfies construction.)
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'test-key'
process.env.PYTHON_DETECT_URL = process.env.PYTHON_DETECT_URL || 'http://127.0.0.1:3002'
