import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ZoomablePhoto } from './ZoomablePhoto'

function stubBox() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 16,
    y: 120,
    width: 77,
    height: 77,
    top: 120,
    left: 16,
    right: 93,
    bottom: 197,
    toJSON: () => ({}),
  } as DOMRect)
}

const pointer = (extra: Record<string, unknown> = {}) =>
  ({ pointerId: 1, clientX: 50, clientY: 160, pointerType: 'touch', ...extra }) as never

/** advancing fake timers inside act() lets React flush the state the timer set */
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms))

const overlay = () => document.body.querySelector('.zoom-photo__overlay')
const bigImage = () => document.body.querySelector<HTMLImageElement>('.zoom-photo__big')

describe('ZoomablePhoto (hold to zoom)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubBox()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const setup = (props: Partial<Parameters<typeof ZoomablePhoto>[0]> = {}) =>
    render(
      <ZoomablePhoto src="/media/avatars/a1.webp" alt="Kavya Iyer" username="kavya.frames" size={77} holdMs={200} {...props} />,
    )

  it('renders a focusable circle with the profile photo', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /profile photo/i })
    expect(trigger).toBeInTheDocument()
    expect(screen.getByAltText('Kavya Iyer')).toBeInTheDocument()
  })

  it('opens the enlarged preview after holding, and shows who it is', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /profile photo/i })

    fireEvent.pointerDown(trigger, pointer())
    expect(overlay()).toBeNull()

    fireEvent.pointerUp(trigger, pointer())
    // released before the hold finished → a tap still opens the preview
    expect(overlay()).not.toBeNull()
    expect(bigImage()?.getAttribute('src')).toBe('/media/avatars/a1.webp')
    expect(screen.getByText('@kavya.frames')).toBeInTheDocument()
  })

  it('a real press-and-hold zooms it without lifting the finger', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /profile photo/i })
    fireEvent.pointerDown(trigger, pointer())
    expect(trigger.className).toContain('is-pressing')

    tick(210)
    expect(overlay()).not.toBeNull()
    expect(overlay()?.getAttribute('data-phase')).toBe('zoomed')
  })

  it('releasing sends it back and unmounts the overlay', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /profile photo/i })
    fireEvent.pointerDown(trigger, pointer())
    tick(210)
    expect(overlay()).not.toBeNull()

    fireEvent.pointerUp(trigger, pointer())
    expect(overlay()?.getAttribute('data-phase')).toBe('closing')

    tick(260)
    expect(overlay()).toBeNull()
  })

  it('drifting like a scroll cancels the zoom', () => {
    setup()
    const trigger = screen.getByRole('button', { name: /profile photo/i })
    fireEvent.pointerDown(trigger, pointer())
    fireEvent.pointerMove(trigger, pointer({ clientY: 220 }))
    tick(260)
    expect(overlay()).toBeNull()
  })

  it('hands a tap to onTap when openOnTap is off — that is how story avatars open', () => {
    const onTap = vi.fn()
    setup({ openOnTap: false, onTap })
    const trigger = screen.getByRole('button', { name: /profile photo/i })
    fireEvent.pointerDown(trigger, pointer())
    fireEvent.pointerUp(trigger, pointer())
    expect(onTap).toHaveBeenCalledTimes(1)
    expect(overlay()).toBeNull()
  })
})
