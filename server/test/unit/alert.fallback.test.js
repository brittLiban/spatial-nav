const { buildFallback } = require('../../routes/alert')

describe('buildFallback', () => {
  it('uses urgent phrasing for immediate proximity', () => {
    expect(buildFallback('person', 'ahead', 'immediate')).toBe(
      'Person right in front of you!'
    )
    expect(buildFallback('car', 'left', 'immediate')).toBe(
      'Car right beside you on the left!'
    )
  })

  it('uses moderate phrasing for close proximity', () => {
    expect(buildFallback('chair', 'left', 'close')).toBe('Chair close on your left')
    expect(buildFallback('chair', 'ahead', 'close')).toBe('Chair close ahead')
  })

  it('uses standard phrasing for approaching / other proximity', () => {
    expect(buildFallback('dog', 'right', 'approaching')).toBe('Dog on your right')
    expect(buildFallback('bench', 'ahead', 'approaching')).toBe('Bench ahead of you')
  })

  it('capitalizes the object label', () => {
    expect(buildFallback('bicycle', 'right', 'approaching')).toMatch(/^Bicycle/)
  })
})
