import React from 'react'
import { gradientFor } from '../api.js'

export default function Avatar({ user, size = 32, ring = false, seen = false, onClick, className = '', plusBadge = false }) {
  const inner = (
    <div
      className={'avatar-inner ' + className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: user?.avatar ? '#fff' : gradientFor(user?.username),
        flexShrink: 0,
      }}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user?.username}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          draggable="false"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: size * 0.42,
            userSelect: 'none',
          }}
        >
          {(user?.name || user?.username || '?').slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  )
  if (!ring) {
    return (
      <div className={'avatar-wrap ' + className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', position: 'relative', display: 'inline-block', width: size, height: size }}>
        {inner}
        {plusBadge && (
          <span className="avatar-plus-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </span>
        )}
      </div>
    )
  }
  const pad = size >= 80 ? 4 : size >= 50 ? 3 : 2
  return (
    <div
      className={'avatar-ring ' + (seen ? 'seen' : '') + ' ' + className}
      onClick={onClick}
      style={{ padding: pad, borderRadius: '50%', cursor: onClick ? 'pointer' : 'default', position: 'relative', display: 'inline-block' }}
    >
      <div style={{ border: '2px solid #fff', borderRadius: '50%', display: 'block', lineHeight: 0 }}>{inner}</div>
      {plusBadge && (
        <span className="avatar-plus-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      )}
    </div>
  )
}
