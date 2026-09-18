import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import Avatar from './Avatar.jsx'
import { IcHome, IcHomeFill, IcSearch, IcSearchFill, IcReels, IcReelsFill, IcPlusSquare, IcHeart, IcHeartFill, IcSend } from './Icons.jsx'

export default function MobileNav() {
  const app = useApp()
  const nav = useNavigate()
  if (!app.user) return null

  return (
    <nav className="mobile-nav">
      <NavLink to="/" end className="mnav-item">{({ isActive }) => isActive ? <IcHomeFill size={26} /> : <IcHome size={26} />}</NavLink>
      <NavLink to="/explore" className="mnav-item">{({ isActive }) => isActive ? <IcSearchFill size={25} /> : <IcSearch size={25} />}</NavLink>
      <button className="mnav-item" onClick={() => app.openCreate('post')}><IcPlusSquare size={26} /></button>
      <NavLink to="/reels" className="mnav-item">{({ isActive }) => isActive ? <IcReelsFill size={26} /> : <IcReels size={26} />}</NavLink>
      <button className="mnav-item mnav-profile" onClick={() => nav('/' + app.user.username)}>
        <Avatar user={app.user} size={27} />
      </button>
    </nav>
  )
}

export function MobileTopBar({ title }) {
  const app = useApp()
  const nav = useNavigate()
  if (!app.user) return null
  return (
    <header className="mobile-topbar">
      {title ? <strong className="mtb-title">{title}</strong> : (
        <div to="/" className="mtb-logo">
          <img src="/logo.png" alt="VibeGram" width="30" height="30" style={{ borderRadius: 8, flexShrink: 0 }} />
          <span>VibeGram</span>
        </div>
      )}
      <div className="mtb-actions">
        <button className="icon-btn" onClick={() => nav('/notifications')} style={{ position: 'relative' }}>
          <IcHeartSlot />
          {!!app.unreadNotifs && <span className="nav-badge topbar">{app.unreadNotifs > 9 ? '9+' : app.unreadNotifs}</span>}
        </button>
        <button className="icon-btn" onClick={() => nav('/messages')} style={{ position: 'relative' }}>
          <IcSend size={24} />
          {!!app.unreadDMs && <span className="nav-badge topbar">{app.unreadDMs > 9 ? '9+' : app.unreadDMs}</span>}
        </button>
      </div>
    </header>
  )
}

function IcHeartSlot() {
  return <IcHeart size={25} />
}
