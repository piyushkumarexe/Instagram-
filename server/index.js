const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getDB, save } = require('./store')

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'vibegram-dev-secret-key'
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', immutable: true }))

// ---------- helpers ----------
const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic'])
const VID_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogg'])

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg'
    cb(null, Date.now() + '-' + crypto.randomBytes(8).toString('hex') + ext)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 },
})

function publicUser(u) {
  if (!u) return null
  return { id: u.id, username: u.username, name: u.name, avatar: u.avatar || null, bio: u.bio || '' }
}
function meUser(u) {
  return { ...publicUser(u), email: u.email }
}
function timeAgoMs(ts) { return Date.now() - ts }

function isFollowing(meId, otherId) {
  return getDB().follows.some((f) => f.followerId === meId && f.followingId === otherId)
}
function userCard(u, meId) {
  return { ...publicUser(u), isFollowing: isFollowing(meId, u.id) }
}
function commentJSON(c) {
  const db = getDB()
  return { id: c.id, text: c.text, createdAt: c.createdAt, user: publicUser(db.users.find((u) => u.id === c.userId)) }
}
function postJSON(p, me) {
  const db = getDB()
  const liked = me ? p.likes.includes(me.id) : false
  const saved = me ? (me.saved || []).includes(p.id) : false
  const comments = p.comments.map(commentJSON)
  return {
    id: p.id,
    type: p.type || 'post',
    caption: p.caption || '',
    media: p.media,
    mediaType: p.mediaType,
    createdAt: p.createdAt,
    user: publicUser(db.users.find((u) => u.id === p.userId)),
    likes: p.likes.length,
    likedByMe: liked,
    savedByMe: saved,
    comments,
    commentsCount: comments.length,
  }
}
function auth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = getDB().users.find((u) => u.id === payload.uid)
    if (!user) return res.status(401).json({ error: 'Not authenticated' })
    req.user = user
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
}
function sign(user) {
  return jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '30d' })
}
function notify(recipientId, actorId, type, postId) {
  if (recipientId === actorId) return
  const db = getDB()
  db.notifications.push({
    id: crypto.randomUUID(),
    userId: recipientId,
    actorId,
    type, // 'like' | 'comment' | 'follow'
    postId: postId || null,
    read: false,
    createdAt: Date.now(),
  })
  save()
}

// ---------- auth ----------
app.post('/api/auth/signup', (req, res) => {
  const { username, name, email, password } = req.body || {}
  const db = getDB()
  const uname = String(username || '').trim().toLowerCase()
  if (!/^[a-z0-9._]{3,24}$/.test(uname)) return res.status(400).json({ error: 'Username must be 3-24 chars (letters, numbers, . _)' })
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email' })
  if (!password || String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  if (db.users.some((u) => u.username === uname)) return res.status(400).json({ error: 'That username is already taken' })
  if (db.users.some((u) => u.email === String(email).toLowerCase())) return res.status(400).json({ error: 'An account with that email already exists' })
  const user = {
    id: crypto.randomUUID(),
    username: uname,
    name: String(name || uname).trim().slice(0, 40),
    email: String(email).toLowerCase(),
    passwordHash: bcrypt.hashSync(String(password), 10),
    bio: '',
    avatar: null,
    saved: [],
    viewedStories: [],
    createdAt: Date.now(),
  }
  db.users.push(user)
  save()
  res.json({ token: sign(user), user: meUser(user) })
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {}
  const db = getDB()
  const q = String(username || '').trim().toLowerCase()
  const user = db.users.find((u) => u.username === q || u.email === q)
  if (!user || !bcrypt.compareSync(String(password || ''), user.passwordHash)) {
    return res.status(400).json({ error: 'Sorry, your credentials were incorrect. Please double-check and try again.' })
  }
  res.json({ token: sign(user), user: meUser(user) })
})

app.get('/api/me', auth, (req, res) => res.json({ user: meUser(req.user) }))

app.put('/api/me', auth, upload.single('avatar'), (req, res) => {
  const u = req.user
  if (req.file) {
    const ext = path.extname(req.file.filename).toLowerCase()
    if (!IMG_EXT.has(ext)) return res.status(400).json({ error: 'Avatar must be an image' })
    u.avatar = '/uploads/' + req.file.filename
  }
  if (typeof req.body.name === 'string') u.name = req.body.name.trim().slice(0, 40) || u.name
  if (typeof req.body.bio === 'string') u.bio = req.body.bio.slice(0, 160)
  save()
  res.json({ user: meUser(u) })
})

// ---------- users ----------
app.get('/api/users/suggestions', auth, (req, res) => {
  const db = getDB()
  const suggestions = db.users
    .filter((u) => u.id !== req.user.id && !isFollowing(req.user.id, u.id))
    .slice(0, 5)
    .map((u) => userCard(u, req.user.id))
  res.json({ users: suggestions })
})

app.get('/api/users/search', auth, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase()
  if (!q) return res.json({ users: [] })
  const db = getDB()
  const users = db.users
    .filter((u) => u.username.includes(q) || (u.name || '').toLowerCase().includes(q))
    .slice(0, 12)
    .map((u) => userCard(u, req.user.id))
  res.json({ users })
})

app.get('/api/users/:username', auth, (req, res) => {
  const db = getDB()
  const u = db.users.find((x) => x.username === req.params.username.toLowerCase())
  if (!u) return res.status(404).json({ error: 'User not found' })
  const posts = db.posts.filter((p) => p.userId === u.id)
  res.json({
    user: {
      ...publicUser(u),
      followersCount: db.follows.filter((f) => f.followingId === u.id).length,
      followingCount: db.follows.filter((f) => f.followerId === u.id).length,
      postsCount: posts.filter((p) => (p.type || 'post') === 'post').length,
      isFollowing: isFollowing(req.user.id, u.id),
      isMe: u.id === req.user.id,
    },
  })
})

app.get('/api/users/:username/posts', auth, (req, res) => {
  const db = getDB()
  const u = db.users.find((x) => x.username === req.params.username.toLowerCase())
  if (!u) return res.status(404).json({ error: 'User not found' })
  const type = req.query.type === 'reel' ? 'reel' : 'post'
  const posts = db.posts
    .filter((p) => p.userId === u.id && (p.type || 'post') === type)
    .sort((a, b) => b.createdAt - a.createdAt)
  res.json({ posts: posts.map((p) => postJSON(p, req.user)) })
})

app.get('/api/me/saved', auth, (req, res) => {
  const db = getDB()
  const savedIds = req.user.saved || []
  const posts = db.posts.filter((p) => savedIds.includes(p.id)).sort((a, b) => b.createdAt - a.createdAt)
  res.json({ posts: posts.map((p) => postJSON(p, req.user)) })
})

app.get('/api/users/:username/followers', auth, (req, res) => {
  const db = getDB()
  const u = db.users.find((x) => x.username === req.params.username.toLowerCase())
  if (!u) return res.status(404).json({ error: 'User not found' })
  const users = db.follows.filter((f) => f.followingId === u.id).map((f) => db.users.find((x) => x.id === f.followerId)).filter(Boolean).map((x) => userCard(x, req.user.id))
  res.json({ users })
})
app.get('/api/users/:username/following', auth, (req, res) => {
  const db = getDB()
  const u = db.users.find((x) => x.username === req.params.username.toLowerCase())
  if (!u) return res.status(404).json({ error: 'User not found' })
  const users = db.follows.filter((f) => f.followerId === u.id).map((f) => db.users.find((x) => x.id === f.followingId)).filter(Boolean).map((x) => userCard(x, req.user.id))
  res.json({ users })
})

app.post('/api/users/:username/follow', auth, (req, res) => {
  const db = getDB()
  const u = db.users.find((x) => x.username === req.params.username.toLowerCase())
  if (!u) return res.status(404).json({ error: 'User not found' })
  if (u.id === req.user.id) return res.status(400).json({ error: "You can't follow yourself" })
  if (!db.follows.some((f) => f.followerId === req.user.id && f.followingId === u.id)) {
    db.follows.push({ followerId: req.user.id, followingId: u.id, createdAt: Date.now() })
    notify(u.id, req.user.id, 'follow', null)
    save()
  }
  res.json({
    following: true,
    followersCount: db.follows.filter((f) => f.followingId === u.id).length,
  })
})

app.delete('/api/users/:username/follow', auth, (req, res) => {
  const db = getDB()
  const u = db.users.find((x) => x.username === req.params.username.toLowerCase())
  if (!u) return res.status(404).json({ error: 'User not found' })
  db.follows = db.follows.filter((f) => !(f.followerId === req.user.id && f.followingId === u.id))
  save()
  res.json({ following: false, followersCount: db.follows.filter((f) => f.followingId === u.id).length })
})

// ---------- feed / explore ----------
app.get('/api/feed', auth, (req, res) => {
  const db = getDB()
  const followingIds = db.follows.filter((f) => f.followerId === req.user.id).map((f) => f.followingId)
  const visibleIds = new Set([...followingIds, req.user.id])
  const before = Number(req.query.before) || Date.now() + 1e12
  const LIMIT = 5
  const posts = db.posts
    .filter((p) => visibleIds.has(p.userId) && p.createdAt < before)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, LIMIT)
  const nextBefore = posts.length === LIMIT ? posts[posts.length - 1].createdAt : null
  res.json({ posts: posts.map((p) => postJSON(p, req.user)), nextBefore })
})

app.get('/api/explore', auth, (req, res) => {
  const db = getDB()
  const followingIds = new Set(db.follows.filter((f) => f.followerId === req.user.id).map((f) => f.followingId))
  let posts = db.posts.filter((p) => p.userId !== req.user.id && !followingIds.has(p.userId) && (p.type || 'post') === 'post')
  if (posts.length < 12) {
    posts = db.posts.filter((p) => p.userId !== req.user.id && (p.type || 'post') === 'post')
  }
  posts.sort((a, b) => b.likes.length * 1e13 + b.createdAt - (a.likes.length * 1e13 + a.createdAt))
  res.json({ posts: posts.slice(0, 30).map((p) => postJSON(p, req.user)) })
})

// ---------- posts ----------
app.get('/api/posts/:id', auth, (req, res) => {
  const db = getDB()
  const p = db.posts.find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Post not found' })
  res.json({ post: postJSON(p, req.user) })
})

app.post('/api/posts', auth, upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please choose a photo or video' })
  const ext = path.extname(req.file.filename).toLowerCase()
  const mediaType = VID_EXT.has(ext) ? 'video' : IMG_EXT.has(ext) ? 'image' : null
  if (!mediaType) {
    fs.unlinkSync(req.file.path)
    return res.status(400).json({ error: 'Unsupported file type' })
  }
  const type = req.body.type === 'reel' ? 'reel' : 'post'
  const db = getDB()
  const post = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    media: '/uploads/' + req.file.filename,
    mediaType,
    caption: String(req.body.caption || '').slice(0, 2200),
    type,
    likes: [],
    comments: [],
    createdAt: Date.now(),
  }
  db.posts.push(post)
  save()
  res.json({ post: postJSON(post, req.user) })
})

app.delete('/api/posts/:id', auth, (req, res) => {
  const db = getDB()
  const p = db.posts.find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Post not found' })
  if (p.userId !== req.user.id) return res.status(403).json({ error: 'You can only delete your own posts' })
  db.posts = db.posts.filter((x) => x.id !== p.id)
  db.notifications = db.notifications.filter((n) => n.postId !== p.id)
  for (const u of db.users) u.saved = (u.saved || []).filter((id) => id !== p.id)
  try { fs.unlinkSync(path.join(UPLOAD_DIR, path.basename(p.media))) } catch (e) {}
  save()
  res.json({ ok: true })
})

app.post('/api/posts/:id/like', auth, (req, res) => {
  const db = getDB()
  const p = db.posts.find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Post not found' })
  const i = p.likes.indexOf(req.user.id)
  let liked
  if (i === -1) {
    p.likes.push(req.user.id)
    liked = true
    notify(p.userId, req.user.id, 'like', p.id)
  } else {
    p.likes.splice(i, 1)
    liked = false
  }
  save()
  res.json({ liked, likes: p.likes.length })
})

app.post('/api/posts/:id/save', auth, (req, res) => {
  const db = getDB()
  const p = db.posts.find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Post not found' })
  const saved = req.user.saved || []
  const i = saved.indexOf(p.id)
  if (i === -1) saved.push(p.id)
  else saved.splice(i, 1)
  req.user.saved = saved
  save()
  res.json({ saved: i === -1 })
})

app.post('/api/posts/:id/comments', auth, (req, res) => {
  const db = getDB()
  const p = db.posts.find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Post not found' })
  const text = String((req.body || {}).text || '').trim().slice(0, 1000)
  if (!text) return res.status(400).json({ error: 'Comment cannot be empty' })
  const c = { id: crypto.randomUUID(), userId: req.user.id, text, createdAt: Date.now() }
  p.comments.push(c)
  notify(p.userId, req.user.id, 'comment', p.id)
  save()
  res.json({ comment: commentJSON(c), commentsCount: p.comments.length })
})

app.delete('/api/posts/:id/comments/:cid', auth, (req, res) => {
  const db = getDB()
  const p = db.posts.find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Post not found' })
  const c = p.comments.find((x) => x.id === req.params.cid)
  if (!c) return res.status(404).json({ error: 'Comment not found' })
  if (c.userId !== req.user.id && p.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' })
  p.comments = p.comments.filter((x) => x.id !== c.id)
  save()
  res.json({ ok: true, commentsCount: p.comments.length })
})

// ---------- stories ----------
const STORY_TTL = 24 * 60 * 60 * 1000
function liveStories() {
  const cutoff = Date.now() - STORY_TTL
  const db = getDB()
  return db.stories.filter((s) => s.createdAt > cutoff)
}

app.get('/api/stories', auth, (req, res) => {
  const db = getDB()
  const live = liveStories().sort((a, b) => a.createdAt - b.createdAt)
  const byUser = new Map()
  for (const s of live) {
    if (!byUser.has(s.userId)) byUser.set(s.userId, [])
    byUser.get(s.userId).push(s)
  }
  const viewed = new Set(req.user.viewedStories || [])
  const groups = []
  for (const [userId, stories] of byUser) {
    const u = db.users.find((x) => x.id === userId)
    if (!u) continue
    if (u.id === req.user.id && groups.some((g) => g.user.id === u.id)) continue
    groups.push({
      user: publicUser(u),
      stories: stories.map((s) => ({ id: s.id, media: s.media, mediaType: s.mediaType, createdAt: s.createdAt })),
      allViewed: stories.every((s) => viewed.has(s.id)),
    })
  }
  // my story first, then unviewed, then viewed
  groups.sort((a, b) => {
    if (a.user.id === req.user.id) return -1
    if (b.user.id === req.user.id) return 1
    if (a.allViewed !== b.allViewed) return a.allViewed ? 1 : -1
    return 0
  })
  res.json({ groups })
})

app.post('/api/stories', auth, upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please choose a photo or video' })
  const ext = path.extname(req.file.filename).toLowerCase()
  const mediaType = VID_EXT.has(ext) ? 'video' : IMG_EXT.has(ext) ? 'image' : null
  if (!mediaType) return res.status(400).json({ error: 'Unsupported file type' })
  const db = getDB()
  db.stories.push({ id: crypto.randomUUID(), userId: req.user.id, media: '/uploads/' + req.file.filename, mediaType, createdAt: Date.now() })
  save()
  res.json({ ok: true })
})

app.post('/api/stories/:id/seen', auth, (req, res) => {
  const u = req.user
  u.viewedStories = u.viewedStories || []
  if (!u.viewedStories.includes(req.params.id)) u.viewedStories.push(req.params.id)
  save()
  res.json({ ok: true })
})

// ---------- messages ----------
function threadJSON(me, other) {
  const db = getDB()
  const msgs = db.messages.filter((m) => (m.from === me.id && m.to === other.id) || (m.from === other.id && m.to === me.id)).sort((a, b) => a.createdAt - b.createdAt)
  const last = msgs[msgs.length - 1] || null
  const unread = msgs.filter((m) => m.to === me.id && !m.read).length
  return {
    user: publicUser(other),
    last: last ? { id: last.id, text: last.text, createdAt: last.createdAt, fromMe: last.from === me.id, read: last.read } : null,
    unread,
  }
}

app.get('/api/messages', auth, (req, res) => {
  const db = getDB()
  const partnerIds = new Set()
  for (const m of db.messages) {
    if (m.from === req.user.id) partnerIds.add(m.to)
    if (m.to === req.user.id) partnerIds.add(m.from)
  }
  const threads = [...partnerIds].map((id) => db.users.find((u) => u.id === id)).filter(Boolean).map((u) => threadJSON(req.user, u)).sort((a, b) => (b.last?.createdAt || 0) - (a.last?.createdAt || 0))
  res.json({ threads })
})

app.get('/api/messages/:username', auth, (req, res) => {
  const db = getDB()
  const other = db.users.find((u) => u.username === req.params.username.toLowerCase())
  if (!other) return res.status(404).json({ error: 'User not found' })
  const msgs = db.messages
    .filter((m) => (m.from === req.user.id && m.to === other.id) || (m.from === other.id && m.to === req.user.id))
    .sort((a, b) => a.createdAt - b.createdAt)
  let changed = false
  for (const m of msgs) {
    if (m.to === req.user.id && !m.read) { m.read = true; changed = true }
  }
  if (changed) save()
  res.json({
    user: publicUser(other),
    messages: msgs.map((m) => ({ id: m.id, text: m.text, createdAt: m.createdAt, fromMe: m.from === req.user.id, read: m.read })),
  })
})

app.post('/api/messages', auth, (req, res) => {
  const db = getDB()
  const { to, text } = req.body || {}
  const other = db.users.find((u) => u.username === String(to || '').toLowerCase())
  if (!other) return res.status(404).json({ error: 'User not found' })
  const t = String(text || '').trim().slice(0, 2000)
  if (!t) return res.status(400).json({ error: 'Message cannot be empty' })
  const m = { id: crypto.randomUUID(), from: req.user.id, to: other.id, text: t, createdAt: Date.now(), read: false }
  db.messages.push(m)
  save()
  res.json({ message: { id: m.id, text: m.text, createdAt: m.createdAt, fromMe: true, read: m.read } })
})

// ---------- notifications ----------
app.get('/api/notifications', auth, (req, res) => {
  const db = getDB()
  const list = db.notifications
    .filter((n) => n.userId === req.user.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 60)
    .map((n) => {
      const actor = db.users.find((u) => u.id === n.actorId)
      const post = n.postId ? db.posts.find((p) => p.id === n.postId) : null
      return {
        id: n.id,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
        actor: publicUser(actor),
        postThumb: post ? post.media : null,
        postId: post ? post.id : null,
        postType: post ? post.type : null,
      }
    })
  const unread = db.notifications.filter((n) => n.userId === req.user.id && !n.read).length
  res.json({ notifications: list, unread })
})

app.post('/api/notifications/read', auth, (req, res) => {
  const db = getDB()
  let changed = false
  for (const n of db.notifications) {
    if (n.userId === req.user.id && !n.read) { n.read = true; changed = true }
  }
  if (changed) save()
  res.json({ ok: true })
})

// ---------- search ----------
app.get('/api/search', auth, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase()
  if (!q) return res.json({ users: [], posts: [] })
  const db = getDB()
  const users = db.users
    .filter((u) => u.username.includes(q) || (u.name || '').toLowerCase().includes(q))
    .slice(0, 8)
    .map((u) => userCard(u, req.user.id))
  const posts = db.posts
    .filter((p) => (p.caption || '').toLowerCase().includes(q) && (p.type || 'post') === 'post')
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 12)
    .map((p) => postJSON(p, req.user))
  res.json({ users, posts })
})

// error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, '0.0.0.0', () => console.log(`VibeGram API listening on http://0.0.0.0:${PORT}`))
