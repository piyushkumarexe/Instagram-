import React, { useState } from 'react'
import { useApp } from '../store.jsx'
import { setFollow, withTimeout } from '../fb.js'

export default function FollowButton({ user, onChange, size = 'md', full = false }) {
  const app = useApp()
  const [busy, setBusy] = useState(false)
  if (!user || !user.id || user.id === app.user?.id) return null

  async function toggle() {
    if (busy) return
    setBusy(true)
    const next = !user.isFollowing
    onChange && onChange({ ...user, isFollowing: next }) // instant UI
    try {
      await withTimeout(setFollow(app.user.id, user, next), 8000, 'Follow')
      app.toast(next ? `Following ${user.username}` : `Unfollowed ${user.username}`)
    } catch (e) {
      onChange && onChange(user) // revert
      app.toast(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      className={'btn ' + (user.isFollowing ? 'btn-grey' : 'btn-blue') + (full ? ' w-full' : '') + ' btn-' + size}
      onClick={toggle}
      disabled={busy}
    >
      {user.isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
