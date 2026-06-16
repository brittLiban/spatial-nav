// Mock groq-sdk so the route never makes a real network call.
jest.mock('groq-sdk', () => {
  const create = jest.fn()
  const Groq = jest.fn().mockImplementation(() => ({
    chat: { completions: { create } },
  }))
  // Expose the inner mock so tests can program its behavior.
  Groq.__create = create
  return Groq
})

const request = require('supertest')
const Groq = require('groq-sdk')
const app = require('../../index')

const create = Groq.__create

describe('POST /alert', () => {
  beforeEach(() => {
    create.mockReset()
  })

  it('returns 400 when class is missing', async () => {
    const res = await request(app).post('/alert').send({ direction: 'ahead' })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/class and direction/i)
  })

  it('returns 400 when direction is missing', async () => {
    const res = await request(app).post('/alert').send({ class: 'person' })

    expect(res.status).toBe(400)
  })

  it('returns the Groq-generated alert text on success', async () => {
    create.mockResolvedValue({
      choices: [{ message: { content: 'Person right in front of you!' } }],
    })

    const res = await request(app)
      .post('/alert')
      .send({ class: 'person', direction: 'ahead', proximity: 'immediate', confidence: 92 })

    expect(res.status).toBe(200)
    expect(res.body.alertText).toBe('Person right in front of you!')
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('falls back to a templated alert when Groq throws', async () => {
    create.mockRejectedValue(new Error('groq unavailable'))

    const res = await request(app)
      .post('/alert')
      .send({ class: 'chair', direction: 'left', proximity: 'close' })

    expect(res.status).toBe(200)
    expect(res.body.alertText).toBe('Chair close on your left')
  })
})
