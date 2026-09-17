import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { updateMe } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import { IcBack } from '../components/Icons.jsx'

export default function EditProfile() {
  const app = useApp()
  const nav = useNavigate()
  const [name, setName] = useState(app.user.name || '')
  const [bio, setBio] = useState(app.user.bio || '')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  async function save(avatarFile) {
    setBusy(true)
    try {
      const u = await updateMe(app.user.id, { name, bio, avatarFile })
      app.setUser((prev) => ({ ...prev, ...u }))
      app.toast(avatarFile ? 'Profile photo updated ✨' : 'Profile updated ✅')
      if (!avatarFile) nav('/' + u.username)
      window.dispatchEvent(new Event('vg:refresh-stories'))
    } catch (e) {
      app.toast(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="edit-page">
      <header className="edit-head">
        <button className="icon-btn" onClick={() => nav(-1)}><IcBack size={24} /></button>
        <strong>Edit profile</strong>
        <button className="blue-link" style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => save()} disabled={busy}>
          {busy ? '…' : 'Done'}
        </button>
      </header>

      <div className="edit-card card">
        <div className="edit-avatar-row">
          <Avatar user={app.user} size={64} />
          <div>
            <strong>{app.user.username}</strong>
            <button className="blue-link" style={{ display: 'block', border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }} onClick={() => fileRef.current?.click()}>
              Change profile photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files[0] && save(e.target.files[0])}
            />
          </div>
        </div>

        <label className="edit-label">Name</label>
        <input className="edit-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />

        <label className="edit-label">Bio</label>
        <textarea className="edit-input" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} rows={3} placeholder="Tell people about yourself…" />
        <div className="caption-count">{bio.length}/160</div>

        <label className="edit-label">Email</label>
        <input className="edit-input" value={app.user.email || ''} disabled />

        <button className="btn btn-blue w-full" style={{ marginTop: 18 }} onClick={() => save()} disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
