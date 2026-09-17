import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../store.jsx'
import { FILTERS, bakeFilter } from '../api.js'
import { createPost, addStory } from '../fb.js'
import { IcX, IcImage } from './Icons.jsx'

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

  useEffect(() => {
    if (mode) { setFile(null); setPreviewUrl(null); setStep(1); setFilterIdx(0); setCaption('') }
  }, [mode])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !busy) app.closeCreate() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy])

  if (!mode) return null

  const isVideo = file?.type.startsWith('video/')
  const filter = FILTERS[filterIdx]

  function pickFile(f) {
    if (!f) return
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) return app.toast('Please choose an image or video')
    if (f.size > 40 * 1024 * 1024) return app.toast('File too large (max 40MB)')
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setStep(2)
  }

  async function share() {
    setBusy(true)
    try {
      let out = file
      if (!isVideo && filter.css !== 'none') out = await bakeFilter(file, filter.css)
      if (mode === 'story') {
        await addStory(app.user, out)
        window.dispatchEvent(new Event('vg:refresh-stories'))
        app.toast('Added to your story ✨')
      } else {
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

  const title = mode === 'story' ? 'Add to story' : mode === 'reel' ? 'Create new reel' : 'Create new post'

  return (
    <div className="modal-backdrop dark" onClick={() => !busy && app.closeCreate()}>
      <button className="modal-close" onClick={() => !busy && app.closeCreate()}><IcX size={28} /></button>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <header className="create-head">
          {step === 2 && mode !== 'story' && (
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
            <div className="create-preview">
              {isVideo ? (
                <video src={previewUrl} autoPlay muted loop playsInline />
              ) : (
                <img src={previewUrl} alt="preview" style={{ filter: mode === 'story' ? 'none' : filter.css }} />
              )}
            </div>
            {mode !== 'story' && (
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
            {mode === 'story' && (
              <div className="create-side story-side">
                <p className="muted">Your story will disappear after 24 hours.</p>
                <p className="muted">Tip: photos work best for stories 😉</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
