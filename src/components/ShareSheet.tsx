import { memo, useMemo, useState } from 'react'
import type { User } from '../types'
import { Modal } from './Modal'
import { StaticAvatar } from './ZoomablePhoto'
import { Icon } from './Icon'
import { useToast } from './Toast'

export interface ShareSheetProps {
  open: boolean
  onClose: () => void
  users: User[]
  /** what is being shared — a post id, or null for the share-generic case */
  targetId?: string | null
  link: string
}

/** Instagram's share sheet: quick send to recent people + copy link. */
export const ShareSheet = memo(function ShareSheet({ open, onClose, users, targetId, link }: ShareSheetProps) {
  const [query, setQuery] = useState('')
  const toast = useToast()

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const people = users.filter((u) => !u.isYou)
    return q ? people.filter((u) => u.username.includes(q) || u.name.toLowerCase().includes(q)) : people
  }, [query, users])

  return (
    <Modal open={open} onClose={onClose} title="Share">
      <div className="pad" style={{ paddingBottom: 0 }}>
        <input
          className="field"
          placeholder="Search people"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search people to share with"
        />
      </div>
      <div className="modal__body" style={{ maxHeight: '46dvh' }}>
        {list.slice(0, 12).map((u) => (
          <button
            type="button"
            className="modal__row"
            key={u.id}
            onClick={() => {
              toast(`Sent to ${u.username}`)
              onClose()
            }}
          >
            <StaticAvatar src={u.avatar} alt={u.username} size={40} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="bold truncate" style={{ display: 'block' }}>
                {u.name}
              </span>
              <span className="muted small truncate" style={{ display: 'block' }}>
                @{u.username}
              </span>
            </span>
            <span className="link-blue small">Send</span>
          </button>
        ))}
      </div>
      <div className="divider" />
      <button
        type="button"
        className="modal__row"
        onClick={() => {
          const url = `${window.location.origin}${link}`
          navigator.clipboard?.writeText(url).catch(() => {})
          toast(targetId ? 'Link copied to clipboard' : 'Link copied')
          onClose()
        }}
      >
        <Icon name="share" size={20} />
        <span>Copy link</span>
      </button>
    </Modal>
  )
})
