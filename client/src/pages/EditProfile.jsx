import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { updateMe, withTimeout } from '../fb.js'
import { IcBack, IcX } from '../components/Icons.jsx'

// IG-style Edit Profile — floating labels, avatar+ring, pronouns/links/gender
export default function EditProfile() {
  const app = useApp()
  const nav = useNavigate()
  const [name, setName] = useState(app.user.name || '')
  const [username, setUsername] = useState(app.user.username || '')
  const [pronouns, setPronouns] = useState(app.user.pronouns || '')
  const [bio, setBio] = useState(app.user.bio || '')
  const [links, setLinks] = useState(app.user.links || '')
  const [gender, setGender] = useState(app.user.gender || '')
  const [anthem, setAnthem] = useState(app.user.anthem || '')
  const [anthemArtist, setAnthemArtist] = useState(app.user.anthemArtist || '')
  const [anthemUrl, setAnthemUrl] = useState(app.user.anthemUrl || '')
  const [songOpen, setSongOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  function pickPhoto(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setAvatarFile(f)
    setAvatarPreview(URL.createObjectURL(f))
    e.target.value = ''
  }

  async function save() {
    if (busy) return
    setBusy(true)
    // optimistic local merge
    app.setUser((prev) => ({
      ...prev,
      name: name.trim() || prev.name,
      bio,
      anthem, anthemArtist, anthemUrl,
      pronouns,
      links,
      gender,
      ...(avatarPreview ? { avatar: avatarPreview } : {}),
      ...(!username.trim() || username.trim().toLowerCase() === prev.username ? {} : { username: username.trim().toLowerCase() }),
    }))
    try {
      const u = await withTimeout(updateMe(app.user.id, {
        name, bio, pronouns, links, gender, anthem, anthemArtist, anthemUrl, username, avatarFile,
      }), 15000, 'Profile save')
      app.setUser((prev) => ({ ...prev, ...u }))
      app.toast('Profile updated ✅')
      window.dispatchEvent(new Event('vg:refresh-stories'))
      nav(u.username && u.username !== app.user.username ? '/' + u.username : -1)
    } catch (err) {
      app.toast(err.message)
      app.refreshUser()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="eig-page">
      <header className="eig-head">
        <button className="icon-btn" onClick={() => nav(-1)}><IcBack size={24} /></button>
        <strong>Edit profile</strong>
        <button className="eig-done" onClick={save} disabled={busy}>{busy ? '…' : '✓'}</button>
      </header>

      <div className="eig-avwrap">
        <div className="eig-avring">
          <img className="eig-avatar" src={avatarPreview || app.user.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(app.user.username)}`} alt="avatar" />
        </div>
        <button className="eig-photo-link" onClick={() => fileRef.current && fileRef.current.click()}>
          Edit picture or avatar
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={pickPhoto} />
      </div>

      <div className="eig-fields">
        <label className="eig-field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Name" />
        </label>

        <label className="eig-field">
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))} maxLength={30} placeholder="username" autoCapitalize="none" />
        </label>

        <label className="eig-field">
          <span>Pronouns</span>
          <input value={pronouns} onChange={(e) => setPronouns(e.target.value)} maxLength={20} placeholder="Pronouns" />
        </label>

        <label className="eig-field eig-area">
          <span>Bio</span>
          <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 160))} placeholder="Tell people about yourself…" rows={3} />
          <em className="eig-count">{bio.length}/160</em>
        </label>

        <button className="eig-field eig-music" onClick={() => setSongOpen(true)}>
          <span>Music</span>
          <span className="eig-music-val">{anthem ? `🎵 ${anthem}${anthemArtist ? ' — ' + anthemArtist : ''}` : 'Add music to profile'}</span>
          {anthemUrl && <em className="eig-clear" onClick={(ev) => { ev.stopPropagation(); setAnthem(''); setAnthemArtist(''); setAnthemUrl('') }}>✕</em>}
        </button>

        <label className="eig-field">
          <span>Links</span>
          <input value={links} onChange={(e) => setLinks(e.target.value)} maxLength={100} placeholder="yourwebsite.com" autoCapitalize="none" inputMode="url" />
        </label>

        <label className="eig-field eig-select">
          <span>Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Not set</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Custom">Custom</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
      </div>

      <div className="eig-sec">
        <button className="eig-row" onClick={() => nav('/settings')}>
          <div>
            <strong>Account privacy</strong>
            <span className="muted">{app.user.isPrivate ? 'Private 🔒' : 'Public 🌍'} — tap to change</span>
          </div>
          <span className="muted" style={{ fontSize: 20 }}>›</span>
        </button>
        <button className="eig-row" onClick={() => app.toast('Professional tools coming soon 🚧')}>
          <div>
            <strong className="eig-blue">Switch to professional account</strong>
          </div>
          <span className="muted" style={{ fontSize: 20 }}>›</span>
        </button>
        <div className="eig-row static">
          <div>
            <strong>Personal information</strong>
            <span className="muted">{app.user.email || '—'}</span>
          </div>
        </div>
      </div>

      <button className="eig-save-big" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
      {songOpen && <SongPicker current={anthem} onPick={(s) => { setAnthem(s.title); setAnthemArtist(s.artist); setAnthemUrl(s.url); setSongOpen(false) }} onClose={() => setSongOpen(false)} />}
      <div style={{ height: 40 }} />
    </div>
  )
}


// iTunes Search (JSONP — no CORS issues) + 30s preview player
function jsonp(url) {
  return new Promise((res, rej) => {
    const cb = 'itjp' + Math.random().toString(36).slice(2)
    const sc = document.createElement('script')
    const timer = setTimeout(() => { cleanup(); rej(new Error('Search timed out')) }, 9000)
    function cleanup() { clearTimeout(timer); try { delete window[cb] } catch {} ; sc.remove() }
    window[cb] = (data) => { cleanup(); res(data) }
    sc.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + cb
    sc.onerror = () => { cleanup(); rej(new Error('Music search failed')) }
    document.head.appendChild(sc)
  })
}

let previewAudio = null
function stopPreview() { if (previewAudio) { previewAudio.pause(); previewAudio = null } }

function SongPicker({ current, onPick, onClose }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const [playingId, setPlayingId] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => () => stopPreview(), [])

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    setBusy(true)
    const t = setTimeout(async () => {
      try {
        const data = await jsonp(`https://itunes.apple.com/search?term=${encodeURIComponent(q.trim())}&media=music&entity=song&limit=25`)
        setResults((data.results || []).filter((r) => r.previewUrl))
        setErr((data.results || []).length ? '' : 'No songs found')
      } catch (e) {
        setErr('Music search unavailable — try again')
      } finally { setBusy(false) }
    }, 400)
    return () => clearTimeout(t)
  }, [q])

  function play(r) {
    stopPreview()
    if (playingId === r.trackId) { setPlayingId(null); return }
    previewAudio = new Audio(r.previewUrl)
    previewAudio.play().catch(() => {})
    setPlayingId(r.trackId)
  }

  function use(r) {
    stopPreview()
    onPick({ title: r.trackName.slice(0, 80), artist: (r.artistName || '').slice(0, 60), url: r.previewUrl })
  }

  return (
    <div className="modal-backdrop" onClick={() => { stopPreview(); onClose() }}>
      <div className="ulist-modal song-picker" onClick={(e) => e.stopPropagation()}>
        <header className="ulist-head">
          <button className="icon-btn" onClick={() => { stopPreview(); onClose() }}><IcX size={20} /></button>
          <strong>Find a song</strong>
          <span style={{ width: 40 }} />
        </header>
        <div className="ulist-search"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Song, artist…" autoFocus /></div>
        <div className="ulist-body">
          {busy && <div className="modal-loading">Searching…</div>}
          {err && !busy && <div className="pm-empty"><p style={{ margin: 0 }}>{err}</p></div>}
          {!q && !busy && <div className="pm-empty"><p style={{ margin: 0 }}>Search millions of songs — 30s preview plays right here.</p></div>}
          {results.map((r) => (
            <div className="rail-row" key={r.trackId}>
              <img className="song-art" src={r.artworkUrl100} alt="" loading="lazy" />
              <div className="rail-row-meta">
                <span className="username">{r.trackName}</span>
                <span className="muted">{r.artistName}</span>
              </div>
              <button className={'icon-btn' + (playingId === r.trackId ? ' playing' : '')} onClick={() => play(r)}>
                {playingId === r.trackId ? '⏸' : '▶'}
              </button>
              <button className="btn btn-blue btn-sm" onClick={() => use(r)}>Use</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
