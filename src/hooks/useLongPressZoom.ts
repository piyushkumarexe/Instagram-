import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'

export type ZoomPhase = 'idle' | 'pressing' | 'zoomed' | 'closing'

export interface ZoomGeometry {
  /** origin rect of the small avatar — the FLIP start/end box */
  left: number
  top: number
  width: number
  height: number
  /** scale that takes the origin box to its large centred size */
  fitScale: number
  /** translation that recentres the origin box on the preview anchor */
  tx: number
  ty: number
  radius: number
}

export interface LongPressZoomOptions {
  /** ms the pointer must stay down before the preview pops */
  holdMs?: number
  /** fraction of the smaller viewport side the preview occupies */
  maxSize?: number
  /** vertical anchor of the preview (0.5 = dead centre) */
  anchorY?: number
  maxZoom?: number
  minZoom?: number
  /** a short tap also opens the preview, like Instagram on web */
  openOnTap?: boolean
  /** fired on a short tap (used where a tap should open something else, e.g. a story) */
  onTap?: () => void
  onOpen?: () => void
  onClose?: () => void
}

interface Point {
  x: number
  y: number
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Instagram-style "hold the profile photo to zoom it" interaction.
 *
 * Press and hold an avatar: after `holdMs` the photo springs out of its circle into a
 * large centred preview over a scrim. Keep holding to drag it around, pinch (or scroll)
 * to zoom further; releasing — or pressing Escape — sends it flying back into the circle.
 *
 * Only `transform`/`opacity` change, so the whole thing stays on the compositor: no
 * layout, no repaint of the feed behind it, which is what keeps it smooth on a phone.
 */
export function useLongPressZoom<T extends HTMLElement = HTMLElement>({
  holdMs = 300,
  maxSize = 0.62,
  anchorY = 0.42,
  maxZoom = 3,
  minZoom = 1,
  openOnTap = true,
  onTap,
  onOpen,
  onClose,
}: LongPressZoomOptions = {}) {
  const targetRef = useRef<T | null>(null)
  const [phase, setPhase] = useState<ZoomPhase>('idle')
  const [geometry, setGeometry] = useState<ZoomGeometry | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const pointers = useRef(new Map<number, Point>())
  const holdTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const startPos = useRef<Point>({ x: 0, y: 0 })
  const panStart = useRef<Point>({ x: 0, y: 0 })
  const panOrigin = useRef<Point>({ x: 0, y: 0 })
  const pinchBase = useRef({ distance: 0, zoom: 1 })
  const cb = useRef({ onOpen, onClose, onTap })
  cb.current = { onOpen, onClose, onTap }

  const clearTimers = useCallback(() => {
    window.clearTimeout(holdTimer.current)
    window.clearTimeout(closeTimer.current)
    holdTimer.current = undefined
    closeTimer.current = undefined
  }, [])

  const computeGeometry = useCallback(
    (el: HTMLElement): ZoomGeometry | null => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return null
      const vw = window.innerWidth
      const vh = window.innerHeight
      const box = Math.min(vw, vh) * maxSize
      return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        fitScale: Math.min(box / r.width, box / r.height),
        tx: vw / 2 - (r.left + r.width / 2),
        ty: vh * anchorY - (r.top + r.height / 2),
        radius: Math.min(r.width, r.height) / 2,
      }
    },
    [anchorY, maxSize],
  )

  const open = useCallback(
    (el?: HTMLElement | null) => {
      const node = el ?? targetRef.current
      if (!node) return
      const geo = computeGeometry(node)
      if (!geo) return
      window.clearTimeout(closeTimer.current)
      setGeometry(geo)
      setZoom(1)
      setOffset({ x: 0, y: 0 })
      setDragging(false)
      setPhase('zoomed')
      cb.current.onOpen?.()
    },
    [computeGeometry],
  )

  const close = useCallback(() => {
    setPhase((p) => {
      if (p !== 'zoomed') return p
      cb.current.onClose?.()
      setZoom(1)
      setOffset({ x: 0, y: 0 })
      setDragging(false)
      return 'closing'
    })
  }, [])

  // when the return flight finishes, drop the overlay from the tree entirely
  useEffect(() => {
    if (phase !== 'closing') return
    closeTimer.current = window.setTimeout(() => {
      setPhase('idle')
      setGeometry(null)
    }, 240)
    return () => window.clearTimeout(closeTimer.current)
  }, [phase])

  useEffect(() => clearTimers, [clearTimers])

  const cancelHold = useCallback(() => {
    window.clearTimeout(holdTimer.current)
    holdTimer.current = undefined
    setPhase((p) => (p === 'pressing' ? 'idle' : p))
  }, [])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (phase === 'zoomed' || phase === 'closing') return
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      startPos.current = { x: e.clientX, y: e.clientY }
      panStart.current = { x: e.clientX, y: e.clientY }
      panOrigin.current = { x: 0, y: 0 }
      // keep the gesture ours: no native image drag, no iOS callout, no scroll steal
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } catch {
        /* some engines reject capture for synthetic pointers — the gesture still works */
      }
      setPhase('pressing')
      window.clearTimeout(holdTimer.current)
      holdTimer.current = window.setTimeout(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate && e.pointerType === 'touch') navigator.vibrate(8)
        open(e.currentTarget as HTMLElement)
      }, holdMs)
    },
    [holdMs, open, phase],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const prev = pointers.current.get(e.pointerId)
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (phase === 'pressing') {
        // drifted like a scroll → give up so the feed keeps scrolling
        if (Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y) > 12) cancelHold()
        return
      }

      if (phase !== 'zoomed' || !prev) return

      if (pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()]
        const distance = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinchBase.current.distance === 0) {
          pinchBase.current = { distance, zoom }
          return
        }
        setZoom(clamp(pinchBase.current.zoom * (distance / (pinchBase.current.distance || 1)), minZoom, maxZoom))
        return
      }

      if (!dragging) setDragging(true)
      setOffset({
        x: panOrigin.current.x + (e.clientX - panStart.current.x),
        y: panOrigin.current.y + (e.clientY - panStart.current.y),
      })
    },
    [cancelHold, dragging, maxZoom, minZoom, phase, zoom],
  )

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      pointers.current.delete(e.pointerId)
      if (pointers.current.size < 2) pinchBase.current = { distance: 0, zoom: 1 }

      if (phase === 'pressing') {
        cancelHold()
        // a quick tap opens the preview on web; callers can opt out and handle it
        if (openOnTap) open(e.currentTarget as HTMLElement)
        else cb.current.onTap?.()
        return
      }
      // lifting the finger releases the zoom, exactly like Instagram
      if (phase === 'zoomed' && pointers.current.size === 0) close()
    },
    [cancelHold, close, open, openOnTap, phase],
  )

  const onPointerCancel = useCallback(() => {
    pointers.current.clear()
    cancelHold()
    if (phase === 'zoomed') close()
  }, [cancelHold, close, phase])

  const onWheel = useCallback(
    (e: ReactWheelEvent) => {
      if (phase !== 'zoomed') return
      e.preventDefault()
      setZoom((z) => clamp(z - Math.sign(e.deltaY) * 0.18, minZoom, maxZoom))
    },
    [maxZoom, minZoom, phase],
  )

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (openOnTap) open()
        else cb.current.onTap?.()
      }
    },
    [open, openOnTap],
  )

  const onContextMenu = useCallback((e: ReactMouseEvent) => e.preventDefault(), [])

  // Escape or a scroll behind the overlay dismisses the preview
  useEffect(() => {
    if (phase !== 'zoomed') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    const onScroll = () => close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [close, phase])

  const bind = useMemo(
    () => ({
      ref: targetRef,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onWheel,
      onKeyDown,
      onContextMenu,
      draggable: false,
      tabIndex: 0,
      role: 'button' as const,
      'aria-label': 'Profile photo — hold to zoom',
    }),
    [onContextMenu, onKeyDown, onPointerCancel, onPointerDown, onPointerMove, onPointerUp, onWheel],
  )

  return {
    phase,
    geometry,
    zoom,
    offset,
    dragging,
    holdMs,
    isOpen: phase === 'zoomed' || phase === 'closing',
    isPressing: phase === 'pressing',
    targetRef,
    bind,
    open,
    close,
  }
}
