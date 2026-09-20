import { memo, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLongPressZoom } from '../hooks/useLongPressZoom'

export interface ZoomablePhotoProps {
  src: string
  alt: string
  size: number
  username?: string
  /** gradient ring state, same as the stories bar */
  ring?: 'unseen' | 'seen' | 'none'
  holdMs?: number
  className?: string
  disabled?: boolean
  /** tap opens the preview (Instagram web). Set false + pass onTap for story avatars. */
  openOnTap?: boolean
  onTap?: () => void
}

/**
 * A circular profile photo you can hold to zoom, exactly like Instagram:
 * press-and-hold pops the photo out of its circle into a big centred preview on a
 * scrim; keep holding to drag / pinch; release sends it back into the circle.
 * A quick tap opens the same preview (that is what the web app does).
 */
export const ZoomablePhoto = memo(function ZoomablePhoto({
  src,
  alt,
  size,
  username,
  ring = 'none',
  holdMs = 300,
  className,
  disabled = false,
  openOnTap = true,
  onTap,
}: ZoomablePhotoProps) {
  const { phase, geometry, zoom, offset, dragging, isOpen, isPressing, bind, close } =
    useLongPressZoom<HTMLSpanElement>({ holdMs, openOnTap, onTap })
  const [armed, setArmed] = useState(false)
  const raf = useRef<number | undefined>(undefined)

  // FLIP: mount at the avatar's own box, then animate to the preview box next frame
  useLayoutEffect(() => {
    if (phase === 'zoomed') {
      setArmed(false)
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => setArmed(true))
      })
      return () => {
        if (raf.current) cancelAnimationFrame(raf.current)
      }
    }
    if (phase === 'closing') setArmed(false)
  }, [phase])

  // no background scroll while the preview owns the screen
  useLayoutEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const ringSize = ring === 'none' ? size : size + Math.max(4, Math.round(size * 0.09))
  const pad = ring === 'none' ? 0 : Math.max(2, Math.round(size * 0.045))

  const circle = (s: number) => (
    <span
      className={`zoom-photo__circle ${ring === 'unseen' ? 'is-unseen' : ''} ${ring === 'seen' ? 'is-seen' : ''}`}
      style={{ width: s, height: s, padding: pad }}
    >
      <span className="zoom-photo__inner" style={{ borderRadius: '50%' }}>
        <img src={src} alt={alt} width={s} height={s} draggable={false} decoding="async" />
      </span>
    </span>
  )

  const overlay =
    isOpen && geometry
      ? createPortal(
          <div className="zoom-photo__overlay" data-phase={phase} aria-hidden={phase === 'closing'}>
            <div className="zoom-photo__scrim" onPointerDown={close} />
            <img
              className="zoom-photo__big"
              src={src}
              alt={`${alt} — enlarged`}
              draggable={false}
              style={{
                left: geometry.left,
                top: geometry.top,
                width: geometry.width,
                height: geometry.height,
                transform: armed
                  ? `translate3d(${geometry.tx + offset.x}px, ${geometry.ty + offset.y}px, 0) scale(${
                      geometry.fitScale * zoom
                    })`
                  : 'translate3d(0,0,0) scale(1)',
                transition: dragging ? 'none' : undefined,
              }}
            />
            <div
              className="zoom-photo__meta"
              style={{ opacity: armed ? 1 : 0, transform: `translateY(${armed ? 0 : 8}px)` }}
            >
              {username ? <span className="zoom-photo__name">@{username}</span> : null}
              <span className="zoom-photo__hint">
                {zoom > 1.02 ? 'pinch to zoom · release to close' : 'hold to keep · pinch or scroll to zoom'}
              </span>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <span
        {...(disabled ? { 'aria-label': alt } : bind)}
        className={`zoom-photo ${isPressing ? 'is-pressing' : ''} ${className ?? ''}`}
        style={{ width: ringSize, height: ringSize }}
      >
        {circle(size)}
        {isPressing ? (
          <svg className="zoom-photo__hold" viewBox="0 0 40 40" aria-hidden="true">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              strokeWidth="2.5"
              pathLength={1}
              style={{ animationDuration: `${holdMs}ms` }}
            />
          </svg>
        ) : null}
      </span>
      {overlay}
    </>
  )
})

/** Small helper so callers can render the same circle without the interaction. */
export const StaticAvatar = memo(function StaticAvatar({
  src,
  alt,
  size,
  ring = 'none',
  className,
}: {
  src: string
  alt: string
  size: number
  ring?: 'unseen' | 'seen' | 'none'
  className?: string
}) {
  const ringSize = ring === 'none' ? size : size + Math.max(4, Math.round(size * 0.09))
  const pad = ring === 'none' ? 0 : Math.max(2, Math.round(size * 0.045))
  return (
    <span className={`zoom-photo ${className ?? ''}`} style={{ width: ringSize, height: ringSize }}>
      <span
        className={`zoom-photo__circle ${ring === 'unseen' ? 'is-unseen' : ''} ${ring === 'seen' ? 'is-seen' : ''}`}
        style={{ width: size, height: size, padding: pad }}
      >
        <span className="zoom-photo__inner" style={{ borderRadius: '50%' }}>
          <img src={src} alt={alt} width={size} height={size} draggable={false} decoding="async" />
        </span>
      </span>
    </span>
  )
})
