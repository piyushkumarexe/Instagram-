import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { updateMe, withTimeout } from '../fb.js'
import { IcBack } from '../components/Icons.jsx'

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
      pronouns,
      links,
      gender,
      ...(avatarPreview ? { avatar: avatarPreview } : {}),
      ...(!username.trim() || username.trim().toLowerCase() === prev.username ? {} : { username: username.trim().toLowerCase() }),
    }))
    try {
      const u = await withTimeout(updateMe(app.user.id, {
        name, bio, pronouns, links, gender, username, avatarFile,
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
        <button className="eig-row" onClick={() => app.toast('Professional tools aane wale hain 🚧')}>
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
      <div style={{ height: 40 }} />
    </div>
  )
}
