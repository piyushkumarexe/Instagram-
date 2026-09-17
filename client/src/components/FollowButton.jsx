import React, { useState } from 'react'
import { useApp } from '../store.jsx'
import { setFollow } from '../fb.js'

export default function FollowButton({ user, onChange, size = 'md', full = false }) {
  const app = useApp()
  const [busy, setBusy] = useState(false)
  if (!user || !user.id || user.id === app.user?.id) return null

  async function toggle() {
    if (busy) return
    setBusy(true)
    try {
      const nowFollowing = await setFollow(app.user.id, user, !user.isFollowing)
      onChange && onChange({ ...user, isFollowing: nowFollowing })
      app.toast(nowFollowing ? `Following ${user.username}` : `Unfollowed ${user.username}`)
    } catch (e) {
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
