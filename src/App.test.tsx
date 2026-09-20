import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

/**
 * Whole-app smoke test: mounts the real tree (providers, router, lazy feed) in jsdom so a
 * crash anywhere in the shell, feed or story rail surfaces here rather than in a browser.
 */
describe('Pixogram app', () => {
  it('boots, renders the feed and lets you like a post', async () => {
    render(<App />)

    // the lazy Feed chunk resolves asynchronously, so wait for the first post card
    const likes = await screen.findAllByLabelText('Like')
    expect(likes.length).toBeGreaterThan(3)
    const first = likes[0]
    expect(first).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(first)
    await waitFor(() => expect(screen.getAllByLabelText('Unlike')[0]).toHaveAttribute('aria-pressed', 'true'))
  })

  it('renders the story trays and hold-to-zoom profile photos', async () => {
    render(<App />)
    await screen.findAllByLabelText('Like')

    expect(screen.getByRole('list', { name: 'Stories' })).toBeInTheDocument()
    // every story tray avatar — and the post author avatars — are hold-to-zoomable
    expect(screen.getAllByRole('button', { name: /profile photo/i }).length).toBeGreaterThan(4)
  })

  it('saves a post and persists the choice to local storage', async () => {
    render(<App />)
    const feed = await screen.findByRole('main')
    const firstPost = within(feed).getAllByRole('article')[0]

    fireEvent.click(within(firstPost).getByLabelText('Save'))
    expect(within(firstPost).getByLabelText('Remove from saved')).toBeInTheDocument()

    // persistence is debounced 350ms, so give the timer time to fire
    await waitFor(() => expect(localStorage.getItem('pixogram.state.v1')).toContain('"saved":["p1"'), {
      timeout: 2000,
    })
  })
})
