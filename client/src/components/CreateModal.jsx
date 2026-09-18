import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../store.jsx'
import { FILTERS, bakeFilter } from '../api.js'
import { createPost, addStory } from '../fb.js'
import { IcX, IcImage } from './Icons.jsx'

const STORY_EMOJIS = ['😂', '❤️', '🔥', '😍', '🎉', '✨', '😎', '🥳', '💯', '👏', '🙏', '🌈', '☀️', '🌙', '⚡', '🎧']

export default function CreateModal() {
  const app = useApp()
  const mode = app.createMode // 'post' | 'reel' | 'story' | null
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [filterIdx, setFilterIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  // story stickers
  const [stickers, setStickers] = useState([])
  const [activeSticker, setActiveSticker] = useState(null)
  const stageRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    if (mode) { setFile(null); setPreviewUrl(null); setStep(1); setFilterIdx(0); setCaption(''); setStickers([]); setActiveSticker(null) }
  }, [mode])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !busy) app.closeCreate() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy])

  if (!mode) return null

  const isVideo = file?.type.startsWith('video/')
  const filter = FILTERS[filterIdx]
  const isStory = mode === 'story'

  function pickFile(f) {
    if (!f) return
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) return app.toast('Please choose an image or video')
    if (f.size > 40 * 1024 * 1024) return app.toast('File too large (max 40MB)')
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setStep(2)
  }

  function addEmojiSticker(ch) {
    setStickers((s) => [...s, { id: Date.now() + Math.random(), type: 'emoji', value: ch, x: 0.5, y: 0.4, size: 1 }])
  }
  function addTextSticker() {
    const t = prompt('Sticker text:', '')
    if (t && t.trim()) setStickers((s) => [...s, { id: Date.now() + Math.random(), type: 'text', value: t.trim().slice(0, 40), x: 0.5, y: 0.5, size: 1 }])
  }

  function onPointerDown(e, id) {
    e.stopPropagation()
    dragRef.current = { id, startX: e.clientX, startY: e.clientY }
    setActiveSticker(id)
    const move = (ev) => {
      const st = stageRef.current?.getBoundingClientRect()
      if (!st || !dragRef.current) return
      const dx = (ev.clientX - dragRef.current.startX) / st.width
      const dy = (ev.clientY - dragRef.current.startY) / st.height
      dragRef.current.startX = ev.clientX
      dragRef.current.startY = ev.clientY
      setStickers((list) => list.map((s) => (s.id === id ? {
        ...s,
        x: Math.min(0.97, Math.max(0.03, s.x + dx)),
        y: Math.min(0.97, Math.max(0.06, s.y + dy)),
      } : s)))
    }
    const up = () => {
      dragRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // bake stickers into the image via canvas
  async function bakeStoryStickers(fileIn) {
    if (!stickers.length || fileIn.type.startsWith('video/')) return fileIn
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(fileIn)
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
        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)
        for (const s of stickers) {
          const px = s.x * width
          const py = s.y * height
          if (s.type === 'emoji') {
            ctx.font = `${Math.round(48 * s.size)}px "Apple Color Emoji","Noto Color Emoji",sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(s.value, px, py)
          } else {
            ctx.font = `800 ${Math.round(26 * s.size)}px -apple-system,Segoe UI,Roboto,sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.lineWidth = 4
            ctx.strokeStyle = '#000'
            ctx.strokeText(s.value, px, py)
            ctx.fillStyle = '#fff'
            ctx.fillText(s.value, px, py)
          }
        }
        canvas.toBlob((blob) => resolve(new File([blob], 'story.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.92)
      }
      img.onerror = () => resolve(fileIn)
      img.src = url
    })
  }

  async function share() {
    setBusy(true)
    try {
      let out = file
      if (isStory) {
        out = await bakeStoryStickers(file)
        await addStory(app.user, out)
        window.dispatchEvent(new Event('vg:refresh-stories'))
        app.toast('Added to your story ✨')
      } else {
        if (!isVideo && filter.css !== 'none') out = await bakeFilter(file, filter.css)
        await createPost(app.user, out, caption, mode === 'reel' ? 'reel' : 'post')
        window.dispatchEvent(new Event('vg:refresh-feed'))
        app.toast(mode === 'reel' ? 'Reel shared 🎬' : 'Post shared 🎉')
      }
      app.closeCreate()
    } catch (e) {
      app.toast(e.message)
    } finally {
      setBusy(false)
    }
  }

  const title = isStory ? 'Add to story' : mode === 'reel' ? 'Create new reel' : 'Create new post'

  return (
    <div className={'modal-backdrop dark' + (isStory && step === 2 ? ' story-takeover' : '')} onClick={() => !busy && app.closeCreate()}>
      <button className="modal-close" onClick={() => !busy && app.closeCreate()}><IcX size={28} /></button>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <header className="create-head">
          {step === 2 && !isStory && (
            <button className="create-back" onClick={() => setStep(1)}>Back</button>
          )}
          <strong>{title}</strong>
          {step === 1 && <button className="create-next blue" onClick={() => inputRef.current?.click()}>Select from device</button>}
          {step === 2 && <button className="create-next blue" onClick={share} disabled={busy}>{busy ? 'Sharing…' : 'Share'}</button>}
        </header>

        {step === 1 && (
          <div
            className={'create-drop' + (dragOver ? ' over' : '')}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]) }}
            onClick={() => inputRef.current?.click()}
          >
            <IcImage size={78} sw={1} />
            <p>Drag photos and videos here</p>
            <button className="btn btn-blue" type="button">Select from device</button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              hidden
              onChange={(e) => pickFile(e.target.files[0])}
            />
          </div>
        )}

        {step === 2 && previewUrl && (
          <div className="create-edit">
            <div className={'create-preview' + (isStory ? ' story-editor' : '')}>
              {isVideo ? (
                <video src={previewUrl} autoPlay muted loop playsInline />
              ) : (
                <img src={previewUrl} alt="preview" style={{ filter: isStory ? 'none' : filter.css }} />
              )}
              {isStory && !isVideo && (
                <div className="sticker-layer" ref={stageRef}>
                  {stickers.map((s) => (
                    <div
                      key={s.id}
                      className={'sticker-item' + (s.type === 'text' ? ' text' : '')}
                      style={{ left: s.x * 100 + '%', top: s.y * 100 + '%', fontSize: s.type === 'emoji' ? 40 * s.size : undefined }}
                      onPointerDown={(e) => onPointerDown(e, s.id)}
                    >
                      {s.type === 'emoji' ? s.value : s.value}
                      {activeSticker === s.id && (
                        <button
                          className="sticker-del"
                          onPointerDown={(e) => { e.stopPropagation(); setStickers((l) => l.filter((x) => x.id !== s.id)); setActiveSticker(null) }}
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isStory && (
              <div className="create-side story-side" style={{ justifyContent: 'flex-start', padding: 0, gap: 0 }}>
                <div className="sticker-toolbar" style={{ width: '100%' }}>
                  {STORY_EMOJIS.map((e) => (
                    <button key={e} type="button" onClick={() => addEmojiSticker(e)}>{e}</button>
                  ))}
                  <button type="button" className="sticker-add-text" onClick={addTextSticker}>Aa Text</button>
                </div>
                {stickers.length > 0 && (
                  <p className="muted" style={{ padding: '8px 12px', fontSize: 12, margin: 0 }}>Drag stickers to position them — they get baked into the photo ✨</p>
                )}
              </div>
            )}
            {!isStory && (
              <div className="create-side">
                {!isVideo && (
                  <div className="filter-strip">
                    {FILTERS.map((f, i) => (
                      <button key={f.name} className={'filter-chip' + (i === filterIdx ? ' on' : '')} onClick={() => setFilterIdx(i)}>
                        <span className="filter-thumb" style={{ filter: f.css }}>
                          <img src={previewUrl} alt="" />
                        </span>
                        <span className="filter-name">{f.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  className="caption-box"
                  placeholder="Write a caption…"
                  value={caption}
                  maxLength={2200}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <div className="caption-count">{caption.length}/2,200</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
