import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { searchUsers } from '../fb.js'
import Avatar from './Avatar.jsx'
import {
  IcHome, IcHomeFill, IcSearch, IcCompass, IcCompassFill, IcReels, IcReelsFill,
  IcHeart, IcHeartFill, IcSend, IcPlusSquare, IcMenu, IcLogout, IcSettings, IcX,
} from './Icons.jsx'

export default function Sidebar() {
  const app = useApp()
  const nav = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!app.user) return null
  const me = app.user

  const items = [
    { to: '/', label: 'Home', icon: IcHome, fill: IcHomeFill, end: true },
    { action: 'search', label: 'Search', icon: IcSearch },
    { to: '/explore', label: 'Explore', icon: IcCompass, fill: IcCompassFill },
    { to: '/reels', label: 'Reels', icon: IcReels, fill: IcReelsFill },
    { to: '/messages', label: 'Messages', icon: IcSend, badge: app.unreadDMs },
    { to: '/notifications', label: 'Notifications', icon: IcHeart, fill: IcHeartFill, badge: app.unreadNotifs },
    { action: 'create', label: 'Create', icon: IcPlusSquare },
    { to: '/' + me.username, label: 'Profile', avatar: true },
  ]

  function handle(item) {
    if (item.action === 'search') return app.setSearchOpen(true)
    if (item.action === 'create') return app.openCreate('post')
    nav(item.to)
  }

  return (
    <nav className="sidebar" data-open-more={moreOpen}>
      <div className="sidebar-top">
        <Link to="/" className="sidebar-logo" title="Instagram 2.0">
          <img src="/logo.png" alt="Instagram 2.0" className="sidebar-logo-img" />
          <span className="sidebar-logo-text">Instagram 2.0</span>
        </Link>
        <div className="sidebar-items">
          {items.map((item) => {
            const active = item.to ? (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== '/') : false
            const Icon = active && item.fill ? item.fill : item.icon
            return (
              <button key={item.label} className={'sidebar-item' + (active ? ' active' : '')} onClick={() => handle(item)}>
                {item.avatar ? (
                  <Avatar user={me} size={26} className="sidebar-avatar" />
                ) : (
                  <span className="sidebar-ic">
                    <Icon size={26} sw={2} />
                    {!!item.badge && <span className="nav-badge">{item.badge > 9 ? '9+' : item.badge}</span>}
                  </span>
                )}
                <span className="sidebar-label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="sidebar-bottom">
        <button className="sidebar-item" onClick={() => setMoreOpen(true)}>
          <span className="sidebar-ic"><IcMenu size={26} /></span>
          <span className="sidebar-label">More</span>
        </button>
      </div>
      {moreOpen && (
        <div className="more-menu-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="more-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setMoreOpen(false); nav('/accounts/edit') }}><IcSettings size={18} /> Settings</button>
            <button onClick={() => { setMoreOpen(false); nav('/' + me.username) }}><IcMenu size={18} /> Saved posts</button>
            <div className="more-menu-sep" />
            <button className="danger" onClick={() => { setMoreOpen(false); app.logout(); nav('/accounts/login') }}><IcLogout size={18} /> Log out</button>
          </div>
        </div>
      )}
    </nav>
  )
}

export function SearchPanel() {
  const app = useApp()
  const [q, setQ] = useState('')
  const [users, setUsers] = useState([])
  const boxRef = useRef(null)

  useEffect(() => {
    if (!q.trim()) { setUsers([]); return }
    const t = setTimeout(async () => {
      try {
        setUsers(await searchUsers(q.trim()))
      } catch (e) {}
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') app.setSearchOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!app.searchOpen) return null
  return (
    <>
      <div className="search-backdrop" onClick={() => app.setSearchOpen(false)} />
      <div className="search-panel">
        <div className="search-panel-head">
          <h3>Search</h3>
          <button className="icon-btn" onClick={() => app.setSearchOpen(false)}><IcX size={22} /></button>
        </div>
        <div className="search-input-row">
          <input
            ref={boxRef}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people"
          />
          {q && <button className="icon-btn" onClick={() => { setQ(''); boxRef.current?.focus() }}><IcX size={14} /></button>}
        </div>
        <div className="search-results">
          {!q && <div className="search-empty"><span className="big-emoji">🔍</span><p>Search for people to follow</p></div>}
          {q && !users.length && <div className="search-empty"><p>No results found</p></div>}
          {users.map((u) => (
            <Link key={u.id} to={'/' + u.username} className="search-user-row" onClick={() => app.setSearchOpen(false)}>
              <Avatar user={u} size={44} />
              <div className="search-user-meta">
                <span className="username">{u.username}</span>
                <span className="name">{u.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
