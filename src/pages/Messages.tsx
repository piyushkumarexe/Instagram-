import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Thread, User } from '../types'
import { Icon } from '../components/Icon'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useDispatch } from '../store/AppContext'
import { timeAgo } from '../data/seed'
import { useMediaQuery } from '../hooks'

export interface MessagesProps {
  threads: Thread[]
  byId: Map<string, User>
  you: User
}

const CANNED = [
  'Haha exactly 👌',
  'Bhej deta hoon abhi',
  'Okay see you there!',
  'That looks great 🔥',
  'Let me check and get back',
]

function MessagesInner({ threads, byId, you }: MessagesProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(threads[0]?.id ?? null)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const endRef = useRef<HTMLDivElement | null>(null)
  const replyTimer = useRef<number | undefined>(undefined)

  const active = useMemo(() => threads.find((t) => t.id === activeId) ?? null, [threads, activeId])

  useEffect(() => {
    if (active && active.unread) dispatch({ type: 'markThreadRead', threadId: active.id })
  }, [active, dispatch])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [active?.messages.length, typing])

  useEffect(() => () => window.clearTimeout(replyTimer.current), [])

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || !active) return
      dispatch({ type: 'sendMessage', threadId: active.id, text: text.trim() })
      setDraft('')
      setTyping(true)
      window.clearTimeout(replyTimer.current)
      replyTimer.current = window.setTimeout(() => {
        setTyping(false)
        dispatch({
          type: 'sendMessage',
          threadId: active.id,
          text: CANNED[Math.floor(Math.random() * CANNED.length)],
        })
      }, 1400)
    },
    [active, dispatch],
  )

  const visible = filter === 'unread' ? threads.filter((t) => t.unread > 0) : threads
  const isNarrow = !useMediaQuery('(min-width: 768px)')

  return (
    <div className="dm" style={{ position: 'relative' }}>
      <div className="dm__list" style={isNarrow && active ? { display: 'none' } : undefined}>
        <div className="row row--between pad" style={{ paddingBottom: 4 }}>
          <div className="row">
            <span className="bold" style={{ fontSize: 16 }}>
              {you.username}
            </span>
            <Icon name="chevronDown" size={14} />
          </div>
          <button type="button" className="icon-btn" aria-label="New message">
            <Icon name="edit" size={22} />
          </button>
        </div>
        <div className="search-tabs">
          <button type="button" className={`chip ${filter === 'all' ? 'is-on' : ''}`} onClick={() => setFilter('all')}>
            Primary
          </button>
          <button type="button" className={`chip ${filter === 'unread' ? 'is-on' : ''}`} onClick={() => setFilter('unread')}>
            Unread
          </button>
        </div>

        {visible.map((t) => {
          const u = byId.get(t.userId)
          if (!u) return null
          const last = t.messages[t.messages.length - 1]
          return (
            <button
              type="button"
              key={t.id}
              className={`dm__row ${t.id === activeId ? 'is-on' : ''} ${t.unread ? 'is-unread' : ''}`}
              onClick={() => setActiveId(t.id)}
            >
              <StaticAvatar src={u.avatar} alt={u.username} size={54} ring={u.online ? 'none' : 'none'} />
              <span className="dm__row-main">
                <span className="truncate" style={{ display: 'block', fontWeight: t.unread ? 600 : 400 }}>
                  {u.name}
                </span>
                <span className="dm__row-sub">
                  <span className="truncate">{last ? `${last.fromMe ? 'You: ' : ''}${last.text}` : 'Say hello'}</span>
                  <span className="muted tiny">{last ? `· ${timeAgo(last.createdAt)}` : ''}</span>
                </span>
              </span>
              {t.unread ? <span className="dm__pill">{t.unread}</span> : null}
            </button>
          )
        })}
        {visible.length === 0 ? <div className="empty">No unread messages</div> : null}
      </div>

      <div className={`dm__chat ${active && isNarrow ? 'is-open' : ''}`}>
        {active ? (
          <>
            <div className="dm__head">
              {isNarrow ? (
                <button type="button" className="icon-btn" onClick={() => setActiveId(null)} aria-label="Back to inbox">
                  <Icon name="chevronLeft" size={22} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  const u = byId.get(active.userId)
                  if (u) navigate(`/${u.username}`)
                }}
                aria-label="Open profile"
              >
                <StaticAvatar src={byId.get(active.userId)?.avatar ?? ''} alt="" size={36} />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bold truncate">{byId.get(active.userId)?.name}</div>
                <div className="tiny muted">{byId.get(active.userId)?.online ? 'Active now' : 'Active recently'}</div>
              </div>
              <button type="button" className="icon-btn" aria-label="Video call">
                <Icon name="camera" size={22} />
              </button>
              <button type="button" className="icon-btn" aria-label="Info">
                <Icon name="info" size={22} />
              </button>
            </div>

            <div className="dm__thread">
              {active.messages.map((msg) => (
                <div className={`bubble ${msg.fromMe ? 'bubble--me' : 'bubble--them'} ${msg.text === '❤️' ? 'bubble--heart' : ''}`} key={msg.id}>
                  {msg.text}
                </div>
              ))}
              {typing ? (
                <div className="bubble bubble--them typing" aria-label="Typing">
                  <i />
                  <i />
                  <i />
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <form
              className="dm__composer"
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
            >
              <button type="button" className="icon-btn" aria-label="Send like" onClick={() => send('❤️')}>
                <Icon name="heart" size={24} />
              </button>
              <input
                className="dm__input"
                placeholder="Message…"
                value={draft}
                aria-label="Message"
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="button" className="icon-btn" aria-label="Emoji">
                <Icon name="smile" size={22} />
              </button>
              <button type="button" className="icon-btn" aria-label="Send photo">
                <Icon name="image" size={22} />
              </button>
              <button type="submit" className="link-blue" disabled={!draft.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="empty" style={{ flex: 1 }}>
            <Icon name="message" size={44} />
            <div>
              <div className="bold" style={{ color: 'var(--text)' }}>
                Your messages
              </div>
              Pick a conversation to start chatting.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Messages = memo(MessagesInner)
export default Messages
