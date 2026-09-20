import React, { useState, useEffect } from 'react'
import { useApp } from '../store.jsx'
import { setFollow, amRequesting, withTimeout } from '../fb.js'

export default function FollowButton({ user, size = 'sm', onChange }) {
  const app = useApp()
  const [busy, setBusy] = useState(false)
  const [requested, setRequested] = useState(false)
  const isFollowing = !!user.isFollowing

  useEffect(() => {
    if (!isFollowing && user.isPrivate && user.id !== app.user.id) {
      amRequesting(app.user.id, user.id).then(setRequested).catch(() => {})
    }
  }, [user.id])

  async function toggle() {
    if (busy) return
    setBusy(true)
    const next = !isFollowing
    if (next && user.isPrivate && !requested) {
      // private: request bhejo
      setRequested(true)
      onChange && onChange({ ...user, isFollowing: false })
    } else if (!next && requested) {
      setRequested(false)
    } else {
      onChange && onChange({ ...user, isFollowing: next })
    }
    try {
      const r = await withTimeout(setFollow(app.user.id, user, next), 8000, 'Follow')
      if (r === 'requested') {
        setRequested(true)
        onChange && onChange({ ...user, isFollowing: false })
        app.toast('Follow request sent 📨')
      } else {
        setRequested(false)
        onChange && onChange({ ...user, isFollowing: r })
        app.toast(r ? `Following ${user.username}` : `Unfollowed ${user.username}`)
      }
    } catch (e) {
      setRequested(false)
      onChange && onChange(user)
      app.toast(e.message)
    } finally {
      setBusy(false)
    }
  }

  let label = 'Follow'
  if (isFollowing) label = 'Following'
  else if (requested) label = 'Requested'

  return (
    <button
      className={'follow-btn ' + size + (isFollowing ? ' is-following' : '') + (!isFollowing && !requested ? ' is-cta' : '')}
      onClick={toggle}
      disabled={busy}
    >{label}</button>
  )
}
