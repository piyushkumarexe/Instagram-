import { memo, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types'
import { Icon } from '../components/Icon'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useAppState, useDispatch } from '../store/AppContext'
import { STORAGE_KEY } from '../store/state'
import { useToast } from '../components/Toast'
import type { ThemeMode } from '../types'

export interface SettingsProps {
  you: User
}

const THEMES: { id: ThemeMode; label: string; hint: string }[] = [
  { id: 'system', label: 'System', hint: 'Follow your device setting' },
  { id: 'dark', label: 'Dark', hint: 'Always dark — Instagram default' },
  { id: 'light', label: 'Light', hint: 'Always light' },
]

function SettingsInner({ you }: SettingsProps) {
  const state = useAppState()
  const dispatch = useDispatch()
  const toast = useToast()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  const storageKb = useMemo(() => {
    try {
      return Math.round(((localStorage.getItem(STORAGE_KEY) ?? '').length / 1024) * 10) / 10
    } catch {
      return 0
    }
  }, [state.createdPosts.length, state.theme])

  return (
    <div className="content" style={{ maxWidth: 600 }}>
      <div className="section-head">
        <span style={{ fontSize: 16 }}>Settings</span>
      </div>

      <div className="row pad">
        <StaticAvatar src={you.avatar} alt={you.username} size={56} ring="unseen" />
        <div style={{ flex: 1 }}>
          <div className="bold">{you.username}</div>
          <div className="muted small">{you.name}</div>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate(`/${you.username}`)}>
          View profile
        </button>
      </div>

      <div className="divider" />

      <div className="pad">
        <div className="upper" style={{ marginBottom: 10 }}>
          Appearance
        </div>
        <div className="stack">
          {THEMES.map((t) => (
            <button
              type="button"
              className="modal__row"
              key={t.id}
              onClick={() => dispatch({ type: 'setTheme', theme: t.id })}
              aria-pressed={state.theme === t.id}
            >
              <Icon name={t.id === 'light' ? 'sun' : 'moon'} size={20} />
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block' }}>{t.label}</span>
                <span className="muted small">{t.hint}</span>
              </span>
              {state.theme === t.id ? <Icon name="check" size={18} className="link-blue" /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="pad">
        <div className="upper" style={{ marginBottom: 10 }}>
          Performance & accessibility
        </div>
        <button
          type="button"
          className="modal__row"
          onClick={() => dispatch({ type: 'setReducedMotion', value: !state.reducedMotion })}
          aria-pressed={state.reducedMotion}
        >
          <Icon name="pause" size={20} />
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block' }}>Reduce motion</span>
            <span className="muted small">Turns off zoom, heart and story animations</span>
          </span>
          {state.reducedMotion ? <Icon name="check" size={18} className="link-blue" /> : null}
        </button>
        <div className="modal__row" style={{ cursor: 'default' }}>
          <Icon name="archive" size={20} />
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block' }}>Local data</span>
            <span className="muted small">
              {storageKb} KB stored · {state.createdPosts.length} uploads · {state.seenStories.length} stories seen
            </span>
          </span>
        </div>
      </div>

      <div className="divider" />

      <div className="pad stack">
        <button
          type="button"
          className="btn btn--outline btn--block"
          onClick={() => {
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              /* ignore */
            }
            setConfirmReset(false)
            toast('Demo data reset')
            window.location.reload()
          }}
        >
          {confirmReset ? 'Tap again to confirm reset' : 'Reset demo data'}
        </button>
        <p className="tiny muted" style={{ textAlign: 'center' }}>
          Pixogram is a front-end demo. Everything lives in your browser — no account, no network calls.
        </p>
      </div>
    </div>
  )
}

const Settings = memo(SettingsInner)
export default Settings
