import React, { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from './Avatar.jsx'
import { IcPlusSquare } from './Icons.jsx'

export default function StoryBar() {
  const app = useApp()
  const [groups, setGroups] = useState([])

  const load = useCallback(async () => {
    try {
      const r = await api('/stories')
      setGroups(r.groups)
    } catch (e) {}
  }, [])

  useEffect(() => {
    load()
    const h = () => load()
    window.addEventListener('vg:refresh-stories', h)
    return () => window.removeEventListener('vg:refresh-stories', h)
  }, [load])

  const mine = groups.find((g) => g.user.id === app.user?.id)
  const others = groups.filter((g) => g.user.id !== app.user?.id)

  return (
    <div className="story-bar">
      <div className="story-cell">
        <div className="story-avatar-wrap own" onClick={() => (mine ? app.openStories(groups, 0) : app.openCreate('story'))}>
          <Avatar user={app.user} size={62} plusBadge={!mine} />
        </div>
        <span className="story-username">Your story</span>
      </div>
      {others.map((g) => {
        const idx = groups.indexOf(g)
        return (
          <div className="story-cell" key={g.user.id} onClick={() => app.openStories(groups, idx)}>
            <div className="story-avatar-wrap">
              <Avatar user={g.user} size={62} ring seen={g.allViewed} />
            </div>
            <span className="story-username">{g.user.username}</span>
          </div>
        )
      })}
    </div>
  )
}
