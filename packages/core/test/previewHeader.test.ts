import { describe, it, expect } from 'vitest'
import { buildPreviewHeader } from '../server/previewHeader'

describe('buildPreviewHeader', () => {
  it('should return undefined without a client context', () => {
    expect(buildPreviewHeader()).toBeUndefined()
  })

  it('should return undefined when preview mode is not requested', () => {
    expect(buildPreviewHeader({ previewId: '123' })).toBeUndefined()
    expect(buildPreviewHeader({ preview: 'false', previewId: '123' })).toBeUndefined()
  })

  it('should return undefined when there is no preview id', () => {
    expect(buildPreviewHeader({ preview: 'true' })).toBeUndefined()
  })

  it('should build the header from the preview id alone', () => {
    expect(buildPreviewHeader({ preview: 'true', previewId: '123' })).toBe('database_id=123')
  })

  it('should include the featured image database id', () => {
    expect(buildPreviewHeader({ preview: 'true', previewId: '123', previewThumbnailId: '456' }))
      .toBe('database_id=123, featured_image_database_id=456')
  })

  it('should include the nonce as a quoted structured-field string', () => {
    expect(buildPreviewHeader({
      preview: 'true',
      previewId: '123',
      previewThumbnailId: '456',
      previewNonce: '45d5b05f1b'
    })).toBe('database_id=123, featured_image_database_id=456, nonce="45d5b05f1b"')
  })

  it('should reject non-numeric, negative and zero preview ids', () => {
    expect(buildPreviewHeader({ preview: 'true', previewId: 'abc' })).toBeUndefined()
    expect(buildPreviewHeader({ preview: 'true', previewId: '-1' })).toBeUndefined()
    expect(buildPreviewHeader({ preview: 'true', previewId: '0' })).toBeUndefined()
  })

  it('should drop an invalid thumbnail id but keep the preview', () => {
    expect(buildPreviewHeader({ preview: 'true', previewId: '123', previewThumbnailId: 'abc' }))
      .toBe('database_id=123')
  })

  it('should drop a nonce containing characters that would need escaping', () => {
    expect(buildPreviewHeader({ preview: 'true', previewId: '123', previewNonce: 'abc"; drop' }))
      .toBe('database_id=123')
  })
})
