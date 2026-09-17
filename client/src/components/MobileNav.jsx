import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import Avatar from './Avatar.jsx'
import { IcHome, IcHomeFill, IcCompass, IcCompassFill, IcReels, IcReelsFill, IcHeart, IcHeartFill, IcSend, IcPlusSquare } from './Icons.jsx'

export default function MobileNav() {
  const app = useApp()
  const nav = useNavigate()
  if (!app.user) return null

  return (
    <nav className="mobile-nav">
      <NavLink to="/" end className="mnav-item">{({ isActive }) => isActive ? <IcHomeFill size={26} /> : <IcHome size={26} />}</NavLink>
      <NavLink to="/explore" className="mnav-item">{({ isActive }) => isActive ? <IcCompassFill size={26} /> : <IcCompass size={26} />}</NavLink>
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
        <Link to="/" className="mtb-logo">
          <img src="/logo.png" alt="" width="26" height="26" style={{ borderRadius: 6 }} />
          <span>VibeGram</span>
        </Link>
      )}
      <div className="mtb-actions">
        <button className="icon-btn" onClick={() => nav('/notifications')} style={{ position: 'relative' }}>
          <IcHeart size={25} />
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
