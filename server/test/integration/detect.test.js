const request = require('supertest')
const app = require('../../index')

describe('POST /detect', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when no image is provided', async () => {
    const res = await request(app).post('/detect').send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/image/i)
  })

  it('proxies the frame to the Python service and returns its detections', async () => {
    const payload = {
      width: 640,
      height: 480,
      detections: [{ class: 'person', score: 0.92, bbox: [10, 20, 100, 200] }],
    }
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => payload })

    const res = await request(app).post('/detect').send({ image: 'base64data' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(payload)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('forwards a non-ok status and body from the Python service', async () => {
    const errorBody = { detail: 'could not decode image' }
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 400, json: async () => errorBody })

    const res = await request(app).post('/detect').send({ image: 'base64data' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual(errorBody)
  })

  it('returns 503 when the Python service cannot be reached', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'))

    const res = await request(app).post('/detect').send({ image: 'base64data' })

    expect(res.status).toBe(503)
    expect(res.body.error).toMatch(/unavailable/i)
  })
})
