import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLongPressZoom } from './useLongPressZoom'

type Hook = ReturnType<typeof useLongPressZoom<HTMLDivElement>>

/** jsdom has no layout engine — give the avatar a real box so the FLIP maths runs. */
function stubBox() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 100,
    y: 200,
    width: 80,
    height: 80,
    top: 200,
    left: 100,
    right: 180,
    bottom: 280,
    toJSON: () => ({}),
  } as DOMRect)
  Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
}

const makeEl = () => {
  const el = document.createElement('div')
  el.setPointerCapture = vi.fn()
  el.releasePointerCapture = vi.fn()
  return el
}

const pointerEvent = (el: HTMLElement, extra: Record<string, unknown> = {}) =>
  ({
    pointerId: 1,
    clientX: 140,
    clientY: 240,
    pointerType: 'touch',
    currentTarget: el,
    preventDefault: () => {},
    ...extra,
  }) as never

/** renderHook does not attach listeners, so the hook's handlers are called directly */
function setup(options: Parameters<typeof useLongPressZoom<HTMLDivElement>>[0] = {}) {
  const hook = renderHook(() => useLongPressZoom<HTMLDivElement>(options))
  const el = makeEl()
  act(() => {
    hook.result.current.bind.ref.current = el
  })
  const api = {
    down: (extra?: Record<string, unknown>) => act(() => hook.result.current.bind.onPointerDown(pointerEvent(el, extra))),
    move: (extra?: Record<string, unknown>) => act(() => hook.result.current.bind.onPointerMove(pointerEvent(el, extra))),
    up: (extra?: Record<string, unknown>) => act(() => hook.result.current.bind.onPointerUp(pointerEvent(el, extra))),
    cancel: () => act(() => hook.result.current.bind.onPointerCancel()),
    wheel: (deltaY: number) =>
      act(() => hook.result.current.bind.onWheel({ deltaY, preventDefault: () => {} } as never)),
    key: (key: string) => act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key }))),
    tick: (ms: number) => act(() => vi.advanceTimersByTime(ms)),
    result: hook.result as { current: Hook },
  }
  return api
}

describe('useLongPressZoom', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubBox()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('stays idle until the hold threshold passes, then zooms', () => {
    const onOpen = vi.fn()
    const h = setup({ holdMs: 300, onOpen })

    expect(h.result.current.phase).toBe('idle')
    h.down()
    expect(h.result.current.phase).toBe('pressing')
    h.tick(299)
    expect(h.result.current.phase).toBe('pressing')
    h.tick(2)
    expect(h.result.current.phase).toBe('zoomed')
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('computes a preview box that recentres the avatar and scales it up', () => {
    const h = setup({ holdMs: 100, maxSize: 0.62, anchorY: 0.42 })
    h.down()
    h.tick(120)

    const geo = h.result.current.geometry
    expect(geo).not.toBeNull()
    // box = min(1000, 800) * 0.62 = 496 → 496 / 80 = 6.2x
    expect(geo?.fitScale).toBeCloseTo(6.2, 5)
    // recentres the avatar centre (140,240) onto (500, 800*0.42 = 336)
    expect(geo?.tx).toBeCloseTo(360, 5)
    expect(geo?.ty).toBeCloseTo(96, 5)
  })

  it('a quick tap opens the preview by default (Instagram web behaviour)', () => {
    const h = setup({ holdMs: 300 })
    h.down()
    h.up()
    expect(h.result.current.phase).toBe('zoomed')
  })

  it('a quick tap can be handed to onTap instead, so stories still open on tap', () => {
    const onTap = vi.fn()
    const h = setup({ holdMs: 300, openOnTap: false, onTap })
    h.down()
    h.up()
    expect(onTap).toHaveBeenCalledTimes(1)
    expect(h.result.current.phase).toBe('idle')
  })

  it('abandons the zoom when the finger drifts like a scroll', () => {
    const onOpen = vi.fn()
    const h = setup({ holdMs: 300, onOpen })
    h.down()
    h.move({ clientY: 280 })
    expect(h.result.current.phase).toBe('idle')
    h.tick(400)
    expect(h.result.current.phase).toBe('idle')
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('releasing the finger sends the photo back and cleans up', () => {
    const onClose = vi.fn()
    const h = setup({ holdMs: 100, onClose })
    h.down()
    h.tick(120)
    expect(h.result.current.phase).toBe('zoomed')

    h.up()
    expect(h.result.current.phase).toBe('closing')
    expect(onClose).toHaveBeenCalledTimes(1)

    h.tick(260)
    expect(h.result.current.phase).toBe('idle')
    expect(h.result.current.geometry).toBeNull()
  })

  it('Escape dismisses an open preview', () => {
    const h = setup({ holdMs: 100 })
    h.down()
    h.tick(120)
    expect(h.result.current.phase).toBe('zoomed')
    h.key('Escape')
    expect(h.result.current.phase).toBe('closing')
  })

  it('cancelling the pointer never leaves a stuck overlay', () => {
    const h = setup({ holdMs: 100 })
    h.down()
    h.tick(120)
    expect(h.result.current.phase).toBe('zoomed')
    h.cancel()
    expect(h.result.current.phase).toBe('closing')
    h.tick(300)
    expect(h.result.current.phase).toBe('idle')
  })

  it('panning while zoomed moves the photo, and the wheel zooms it', () => {
    const h = setup({ holdMs: 100, maxZoom: 3 })
    h.down()
    h.tick(120)

    h.move({ clientX: 190, clientY: 260 })
    expect(h.result.current.offset).toEqual({ x: 50, y: 20 })
    expect(h.result.current.dragging).toBe(true)

    h.wheel(-100)
    expect(h.result.current.zoom).toBeCloseTo(1.18, 5)

    // clamped at maxZoom
    for (let i = 0; i < 40; i++) h.wheel(-100)
    expect(h.result.current.zoom).toBe(3)
  })

  it('keyboard Enter opens the preview for keyboard users', () => {
    const h = setup({ holdMs: 300 })
    act(() => {
      h.result.current.bind.onKeyDown({ key: 'Enter', preventDefault: () => {} } as never)
    })
    expect(h.result.current.phase).toBe('zoomed')
  })
})
