import { memo, useCallback, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types'
import { Icon } from '../components/Icon'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useDispatch } from '../store/AppContext'
import { useToast } from '../components/Toast'
import { FILTERS, prepareImage } from '../lib/image'
import type { FilterName } from '../lib/image'

export interface CreatePostProps {
  you: User
}

function CreatePostInner({ you }: CreatePostProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterName>('none')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)

  const ingest = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      if (!file.type.startsWith('image/')) {
        toast('Only images can be posted here')
        return
      }
      setBusy(true)
      try {
        const prepared = await prepareImage(file)
        setDataUrl(prepared.dataUrl)
        toast(`Resized to ${prepared.width}×${prepared.height}`)
      } catch {
        toast('That image could not be read')
      } finally {
        setBusy(false)
      }
    },
    [toast],
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    void ingest(e.dataTransfer.files?.[0])
  }

  const publish = () => {
    if (!dataUrl) return
    const id = `up${Date.now()}`
    dispatch({
      type: 'createPost',
      post: { id, dataUrl, caption, location: location.trim() || undefined, filter, createdAt: Date.now() },
    })
    toast('Your post is live')
    navigate(`/${you.username}`)
  }

  return (
    <div className="content" style={{ maxWidth: 640 }}>
      <div className="section-head">
        <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
          <Icon name="chevronLeft" size={22} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600 }}>New post</span>
        <button type="button" className="link-blue" onClick={publish} disabled={!dataUrl}>
          Share
        </button>
      </div>

      {!dataUrl ? (
        <div
          className={`create__drop ${dragOver ? 'is-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <Icon name="image" size={52} />
          <div>
            <div className="bold" style={{ fontSize: 18, color: 'var(--text)' }}>
              Drag photos here
            </div>
            <div className="muted small">{busy ? 'Preparing your photo…' : 'or click to pick from this device'}</div>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => inputRef.current?.click()}>
            Select from device
          </button>
        </div>
      ) : (
        <div className="create">
          <div className="create__stage">
            <img src={dataUrl} alt="Your upload preview" className={filter === 'none' ? '' : `f-${filter}`} />
          </div>

          <div className="filters no-scrollbar">
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f}
                className={`filter-item ${filter === f ? 'is-on' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                <span className="filter-item__thumb">
                  <img src={dataUrl} alt="" className={f === 'none' ? '' : `f-${f}`} loading="lazy" />
                </span>
                {f}
              </button>
            ))}
          </div>

          <div className="pad stack">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <StaticAvatar src={you.avatar} alt={you.username} size={32} />
              <textarea
                className="field"
                style={{ height: 84, padding: 10, resize: 'vertical' }}
                placeholder="Write a caption… #hashtags and @mentions work"
                value={caption}
                maxLength={2200}
                onChange={(e) => setCaption(e.target.value)}
                aria-label="Caption"
              />
            </div>
            <div className="row">
              <Icon name="location" size={18} />
              <input
                className="field"
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              />
            </div>
            <div className="row row--between">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setDataUrl(null)
                  setFilter('none')
                }}
              >
                Start over
              </button>
              <button type="button" className="btn btn--primary" onClick={publish}>
                Share post
              </button>
            </div>
            <p className="tiny muted">
              Uploads are resized to 1080px in your browser before being saved, so the demo stays snappy and your
              storage quota is respected.
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void ingest(e.target.files?.[0])}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

const CreatePost = memo(CreatePostInner)
export default CreatePost
