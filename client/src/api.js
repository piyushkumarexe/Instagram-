const TOKEN_KEY = 'vg_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

// ---- native (APK) support -------------------------------------------------
// Inside the Android app the SPA is bundled, so it needs the address of the
// machine running the VibeGram server. A default can be baked at build time
// via VITE_DEFAULT_SERVER, and the user can override it on the login screen.
export function isNative() {
  return typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.()
}

export const DEFAULT_SERVER = String(import.meta.env?.VITE_DEFAULT_SERVER || '').trim()

export function serverBase() {
  if (!isNative()) return ''
  const stored = String(localStorage.getItem('vg_server') || '').trim()
  return (stored || DEFAULT_SERVER).replace(/\/+$/, '')
}

export function setServerBase(url) {
  const v = String(url || '').trim()
  if (v) localStorage.setItem('vg_server', v)
  else localStorage.removeItem('vg_server')
}

// Prefix relative /uploads media URLs with the configured server
function prefixMedia(data) {
  const base = serverBase()
  if (!base) return data
  const walk = (v) => {
    if (typeof v === 'string') return v.startsWith('/uploads') ? base + v : v
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') {
      const o = {}
      for (const k of Object.keys(v)) o[k] = walk(v[k])
      return o
    }
    return v
  }
  return walk(data)
}


export async function api(path, { method = 'GET', body, formData } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = 'Bearer ' + token
  let payload
  if (formData) payload = formData
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(serverBase() + '/api' + path, { method, headers, body: payload })
  let data = null
  try {
    data = await res.json()
  } catch (e) {
    data = {}
  }
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth')) {
      setToken(null)
      localStorage.removeItem('vg_user')
      window.location.href = '/accounts/login'
    }
    throw new Error(data.error || 'Something went wrong')
  }
  return prefixMedia(data)
}

export function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return s + 's'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h'
  const d = Math.floor(h / 24)
  if (d < 7) return d + 'd'
  const w = Math.floor(d / 7)
  if (w < 52) return w + 'w'
  return Math.floor(w / 52) + 'y'
}

export function formatCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e5) return Math.round(n / 1e3) + 'k'
  return n.toLocaleString('en-US')
}

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
