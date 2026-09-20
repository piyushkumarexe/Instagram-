// Pure UI helpers (no networking — everything goes through fb.js now)
export const GRADIENTS = [
  'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#bc1888)',
  'linear-gradient(45deg,#12c2e9,#c471ed,#f64f59)',
  'linear-gradient(45deg,#11998e,#38ef7d)',
  'linear-gradient(45deg,#fc4a1a,#f7b733)',
  'linear-gradient(45deg,#4568dc,#b06ab3)',
  'linear-gradient(45deg,#ee0979,#ff6a00)',
  'linear-gradient(45deg,#00c6ff,#0072ff)',
  'linear-gradient(45deg,#f953c6,#b91d73)',
]

export function gradientFor(name) {
  let h = 0
  for (const c of String(name || 'x')) h = (h * 31 + c.charCodeAt(0)) % 997
  return GRADIENTS[h % GRADIENTS.length]
}

export const FILTERS = [
  { name: 'Normal', css: 'none' },
  { name: 'Clarendon', css: 'contrast(1.2) saturate(1.35)' },
  { name: 'Gingham', css: 'sepia(0.15) contrast(0.9) brightness(1.1)' },
  { name: 'Moon', css: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'Lark', css: 'contrast(0.9) brightness(1.12) saturate(1.15)' },
  { name: 'Reyes', css: 'sepia(0.35) contrast(0.85) brightness(1.1) saturate(0.75)' },
  { name: 'Juno', css: 'saturate(1.5) contrast(1.1) hue-rotate(-8deg)' },
  { name: 'Slumber', css: 'saturate(0.66) brightness(1.05) sepia(0.25)' },
  { name: 'Crema', css: 'sepia(0.2) contrast(1.05) saturate(0.9) hue-rotate(5deg)' },
  { name: 'Ludwig', css: 'contrast(1.05) saturate(1.2) brightness(1.05)' },
]

// Bake a CSS filter into a JPEG file via canvas (for images only)
export function bakeFilter(file, css) {
  return new Promise((resolve) => {
    if (!css || css === 'none' || file.type.startsWith('video/')) return resolve(file)
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX = 1080
      let { width, height } = img
      if (width > MAX || height > MAX) {
        const r = Math.min(MAX / width, MAX / height)
        width = Math.round(width * r)
        height = Math.round(height * r)
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.filter = css
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      canvas.toBlob(
        (blob) => resolve(new File([blob], (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })),
        'image/jpeg',
        0.92
      )
    }
    img.onerror = () => resolve(file)
    img.src = url
  })
}
