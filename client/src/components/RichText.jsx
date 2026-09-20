import React from 'react'
import { Link } from 'react-router-dom'

// URL + #hashtag ko clickable banata hai (bio, captions, comments)
const RE = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(?:com|in|org|net|io|dev|app|co)(?:\/[^\s]*)?|#[a-zA-Z0-9_]+)/g

export default function RichText({ text, onNav, className }) {
  const parts = String(text || '').split(RE).filter(Boolean)
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('#')) {
          return <Link key={i} className="tag-link" to={`/explore?q=${encodeURIComponent(p)}`} onClick={onNav}>{p}</Link>
        }
        if (/^https?:\/\//.test(p) || /^www\./.test(p) || /^[a-z0-9-]+\./.test(p)) {
          const href = p.startsWith('http') ? p : 'https://' + p
          return <a key={i} className="bio-link" href={href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{p}</a>
        }
        return <React.Fragment key={i}>{p}</React.Fragment>
      })}
    </span>
  )
}
