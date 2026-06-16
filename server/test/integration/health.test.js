const request = require('supertest')
const app = require('../../index')

describe('GET /health', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('reports detectService "ok" when the Python health check resolves ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })

    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', detectService: 'ok' })
  })

  it('reports detectService "down" when the Python service is unreachable', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'))

    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body.detectService).toBe('down')
  })
})
