import { memo } from 'react'
import type { ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import type { IconName } from './Icon'
import { Icon } from './Icon'
import { Avatar } from './Avatar'
import type { User } from '../types'
import { useAppState, useDispatch } from '../store/AppContext'

interface NavItem {
  to: string
  label: string
  icon: IconName
  filledIcon?: IconName
  badge?: number
  end?: boolean
}

export interface ShellProps {
  you: User
  unreadMessages: number
  unreadNotifications: number
  children: ReactNode
  onOpenMenu: () => void
}

export const Shell = memo(function Shell({
  you,
  unreadMessages,
  unreadNotifications,
  children,
  onOpenMenu,
}: ShellProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const state = useAppState()
  const dispatch = useDispatch()

  const isProfileActive = pathname === `/${you.username}`

  const items: NavItem[] = [
    { to: '/', label: 'Home', icon: 'home', end: true },
    { to: '/search', label: 'Search', icon: 'search' },
    { to: '/explore', label: 'Explore', icon: 'explore' },
    { to: '/reels', label: 'Reels', icon: 'reels' },
    { to: '/direct', label: 'Messages', icon: 'message', badge: unreadMessages },
    { to: '/notifications', label: 'Notifications', icon: 'heart', badge: unreadNotifications },
    { to: '/create', label: 'Create', icon: 'plusSquare' },
  ]

  const themeIcon: IconName = state.theme === 'light' ? 'moon' : 'sun'
  const nextTheme = state.theme === 'light' ? 'dark' : 'light'

  return (
    <>
      <nav className="sidebar" aria-label="Primary">
        <div className="sidebar__logo">
          <span className="app-logo" aria-hidden="true">
            ◍
          </span>
          <span className="nav-item__label app-logo" style={{ fontSize: 24 }}>
            Pixogram
          </span>
        </div>

        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
          >
            <Icon name={item.icon} size={24} />
            <span className="nav-item__label">{item.label}</span>
            {item.badge ? <span className="nav-item__badge">{item.badge > 99 ? '99+' : item.badge}</span> : null}
          </NavLink>
        ))}

        <NavLink
          to={`/${you.username}`}
          className={({ isActive }) => `nav-item ${isActive || isProfileActive ? 'is-active' : ''}`}
        >
          <Avatar user={you} size={24} />
          <span className="nav-item__label">Profile</span>
        </NavLink>

        <div className="sidebar__spacer" />

        <button
          type="button"
          className="nav-item"
          onClick={() => dispatch({ type: 'setTheme', theme: nextTheme })}
          aria-label={`Switch to ${nextTheme} mode`}
        >
          <Icon name={themeIcon} size={24} />
          <span className="nav-item__label">{state.theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>
        <button type="button" className="nav-item" onClick={onOpenMenu}>
          <Icon name="more" size={24} />
          <span className="nav-item__label">More</span>
        </button>
      </nav>

      <div className="app__body">
      <header className="topbar">
        <button type="button" onClick={() => navigate('/')} aria-label="Pixogram home">
          <span className="app-logo">Pixogram</span>
        </button>
        <div className="row">
          <NavLink to="/notifications" className="icon-btn" aria-label="Notifications">
            <Icon name="heart" size={24} />
            {unreadNotifications ? <span className="icon-btn__dot" /> : null}
          </NavLink>
          <NavLink to="/direct" className="icon-btn" aria-label="Messages">
            <Icon name="message" size={24} />
            {unreadMessages ? <span className="icon-btn__dot" /> : null}
          </NavLink>
        </div>
      </header>

      <main className="main">{children}</main>

      <nav className="bottomnav" aria-label="Primary mobile">
        <BottomLink to="/" icon="home" label="Home" end />
        <BottomLink to="/search" icon="search" label="Search" />
        <BottomLink to="/create" icon="plusSquare" label="Create" />
        <BottomLink to="/reels" icon="reels" label="Reels" />
        <BottomLink to={`/${you.username}`} label="Profile" avatar={you} />
      </nav>
      </div>
    </>
  )
})

function BottomLink({
  to,
  icon,
  label,
  avatar,
  end,
}: {
  to: string
  icon?: IconName
  label: string
  avatar?: User
  end?: boolean
}) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `bottomnav__btn ${isActive ? 'is-active' : ''}`} aria-label={label}>
      {avatar ? (
        <Avatar user={avatar} size={26} />
      ) : (
        <Icon name={icon as IconName} size={25} filled={label === 'Reels'} />
      )}
    </NavLink>
  )
}
