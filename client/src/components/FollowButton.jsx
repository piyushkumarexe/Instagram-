import React, { useState } from 'react'
import { api } from '../api.js'
import { useApp } from '../store.jsx'

export default function FollowButton({ user, onChange, size = 'md', full = false }) {
  const app = useApp()
  const [busy, setBusy] = useState(false)
  if (!user || user.isMe) return null

  async function toggle() {
    if (busy) return
    setBusy(true)
    try {
      const method = user.isFollowing ? 'DELETE' : 'POST'
      const r = await api(`/users/${user.username}/follow`, { method })
      onChange && onChange({ ...user, isFollowing: r.following, followersCount: r.followersCount })
      app.toast(r.following ? `Following ${user.username}` : `Unfollowed ${user.username}`)
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
