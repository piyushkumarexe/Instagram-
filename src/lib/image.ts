/**
 * Client-side image preparation for uploads.
 *
 * Instagram never ships your 12MB photo to the network as-is, and we cannot either:
 * uploads are stored in localStorage in this demo, so they are downscaled to 1080px and
 * re-encoded as webp (jpeg fallback) before they ever touch state.
 */
export const MAX_UPLOAD_EDGE = 1080
export const UPLOAD_QUALITY = 0.82

export interface PreparedImage {
  dataUrl: string
  width: number
  height: number
  bytes: number
}

export function prepareImage(file: Blob, maxEdge = MAX_UPLOAD_EDGE): Promise<PreparedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * scale))
        const height = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('canvas 2d context unavailable')
        ctx.drawImage(img, 0, 0, width, height)
        const type = canvas.toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(type, UPLOAD_QUALITY)
        resolve({ dataUrl, width, height, bytes: Math.round((dataUrl.length * 3) / 4) })
      } catch (err) {
        reject(err)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image'))
    }
    img.src = url
  })
}

export const FILTERS = [
  'none',
  'clarendon',
  'gingham',
  'moon',
  'lark',
  'reyes',
  'juno',
  'slumber',
  'crema',
  'ludwig',
  'aden',
  'perpetua',
  'amaro',
] as const

export type FilterName = (typeof FILTERS)[number]
