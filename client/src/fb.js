// VibeGram data layer — Firebase Auth + Firestore + Storage.
// Designed to avoid ALL composite indexes (client-side sorting/filtering,
// denormalized counts) so it works on any Firebase project out of the box.
import {
  signInWithPopup, getRedirectResult,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithCredential,
  signOut as fbSignOut, onAuthStateChanged, updateProfile,
} from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import {
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
  collection, query, where, orderBy, limit, startAfter,
  onSnapshot, increment, arrayUnion, arrayRemove, serverTimestamp,
  writeBatch, runTransaction, deleteField,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage, googleProvider } from './firebase.js'
import { isNative } from './native.js'

// ---------------------------------------------------------------- helpers
export function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return s + 's'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h'
  const d = Math.floor(h / 24)
  if (d < 7) return d + 'd'
  const w = Math.floor(d / 7)
  if (w < 52) return w + 'w'
  return Math.floor(w / 52) + 'y'
}

export function formatCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e5) return Math.round(n / 1e3) + 'k'
  return (n || 0).toLocaleString('en-US')
}

const userCache = new Map()
export async function cachedUser(uid) {
  if (!uid) return null
  if (userCache.has(uid)) return userCache.get(uid)
  const snap = await getDoc(doc(db, 'users', uid))
  const u = snap.exists() ? { id: snap.id, ...snap.data() } : null
  if (u) userCache.set(uid, u)
  return u
}

function tsToMs(v, fallback = Date.now()) {
  if (!v) return fallback
  if (typeof v === 'number') return v
  if (v.toMillis) return v.toMillis()
  if (v.seconds) return v.seconds * 1000
  return fallback
}

// ---------------------------------------------------------------- following set (cached)
export const myFollowing = new Set()

export async function loadFollowing(meId) {
  myFollowing.clear()
  if (!meId) return
  const qy = query(collection(db, 'follows'), where('followerId', '==', meId), limit(500))
  const snap = await getDocs(qy)
  snap.forEach((d) => myFollowing.add(d.data().followingId))
}

// ---------------------------------------------------------------- auth
export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb)
}
export async function finishRedirect() {
  try { await getRedirectResult(auth) } catch (e) { console.warn(e) }
}
export async function authGoogle() {
  // Native (APK/IPA): use the device's native Google account picker — no browser.
  if (isNative()) {
    try {
      const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
      const result = await FirebaseAuthentication.signInWithGoogle()
      const idToken = result?.credential?.idToken
      if (!idToken) throw new Error('No Google idToken returned')
      const credential = GoogleAuthProvider.credential(idToken)
      await signInWithCredential(auth, credential)
      return
    } catch (e) {
      const msg = String(e?.message || e)
      if (/DEVELOPER_ERROR|10:|ApiException/i.test(msg)) {
        throw new Error(
          'SHA-1 fingerprint not registered yet. Fix (2 min): Firebase Console → Project settings → Your apps → Android app (com.vibegram.app) → Add fingerprint → paste the SHA-1 from the release notes / chat. Then reinstall this APK.'
        )
      }
      throw e
    }
  }
  // Web: secure popup
  return signInWithPopup(auth, googleProvider)
}
export async function authEmailPass(email, password) {
  return signInWithEmailAndPassword(auth, String(email).trim(), password)
}
export async function registerEmailPass(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, String(email).trim(), password)
  try { await updateProfile(cred.user, { displayName: name || '' }) } catch (e) {}
  return cred
}
export async function signOutNow() {
  myFollowing.clear()
  userCache.clear()
  await fbSignOut(auth)
  try { localStorage.removeItem('vg_profile') } catch (e) {}
}

// ---------------------------------------------------------------- users / profiles
// verified creator accounts (seed bots) — badge inko IG jaisa blue tick
export const VERIFIED_IDS = new Set(['bot-aarav', 'bot-priya', 'bot-rohan', 'bot-ishani', 'bot-karan'])

export function profileOut(id, d) {
  return { id, username: d.username, name: d.name || d.username, email: d.email || '', bio: d.bio || '', avatar: d.avatar || null, followersCount: d.followersCount || 0, followingCount: d.followingCount || 0, postsCount: d.postsCount || 0, createdAt: tsToMs(d.createdAt), lastActive: tsToMs(d.lastActive), isPrivate: !!d.isPrivate, verified: !!d.verified || VERIFIED_IDS.has(id), pronouns: d.pronouns || '', links: d.links || '', gender: d.gender || '' }
}

// one-time: bots ko verified mark karo (profile/search/connections badges)
export async function ensureBotsVerified() {
  try {
    if (localStorage.getItem('vg_verified_patch')) return
    await Promise.all([...VERIFIED_IDS].map((id) => setDoc(doc(db, 'users', id), { verified: true }, { merge: true })))
    localStorage.setItem('vg_verified_patch', '1')
  } catch {}
}

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? profileOut(snap.id, snap.data()) : null
}

export async function getUserByUsername(username) {
  const uname = String(username || '').toLowerCase()
  const unameSnap = await getDoc(doc(db, 'usernames', uname))
  if (!unameSnap.exists()) return null
  return getUser(unameSnap.data().uid)
}

function genUsername(seed) {
  const base = String(seed || 'user').toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 15) || 'user'
  return base + Math.floor(100 + Math.random() * 900)
}

export async function claimUsername(uid, email, wanted, displayName) {
  const clean = String(wanted || '').toLowerCase()
  if (!/^[a-z0-9._]{3,24}$/.test(clean)) throw new Error('Username must be 3-24 chars (letters, numbers, . _)')
  await runTransaction(db, async (tx) => {
    const unameDoc = await tx.get(doc(db, 'usernames', clean))
    if (unameDoc.exists()) throw new Error('That username is already taken')
    const uDoc = await tx.get(doc(db, 'users', uid))
    if (uDoc.exists() && uDoc.data().username) {
      // already has a username — swap if changed
      const old = uDoc.data().username
      if (old !== clean) {
        const oldDoc = await tx.get(doc(db, 'usernames', old))
        if (oldDoc.exists()) tx.delete(doc(db, 'usernames', old))
        tx.set(doc(db, 'usernames', clean), { uid })
        tx.update(doc(db, 'users', uid), { username: clean })
      }
      return
    }
    tx.set(doc(db, 'usernames', clean), { uid })
    tx.set(doc(db, 'users', uid), {
      username: clean,
      name: String(displayName || clean).slice(0, 40),
      email: email || '',
      bio: '',
      avatar: null,
      saved: [],
      viewedStories: [],
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: serverTimestamp(),
    }, { merge: true })
  })
  await onboardNewUser(uid)
  return getUser(uid)
}

// auto-follow the demo bots + welcome DM so new accounts feel alive
const BOTS = ['bot-aarav', 'bot-priya', 'bot-rohan', 'bot-ishani', 'bot-karan']
async function onboardNewUser(uid) {
  try {
    const batch = writeBatch(db)
    for (const bot of BOTS) {
      if (bot === uid) continue
      batch.set(doc(db, 'follows', `${uid}_${bot}`), { followerId: uid, followingId: bot, createdAt: serverTimestamp() })
      batch.update(doc(db, 'users', uid), { followingCount: increment(1) })
      batch.update(doc(db, 'users', bot), { followersCount: increment(1) })
    }
    await batch.commit()
    await loadFollowing(uid)
    const aarav = await cachedUser('bot-aarav')
    if (aarav) {
      await sendMessage('bot-aarav', uid, 'Welcome to VibeGram! 🎉 Exploring the app? Try sharing your first post — tap the + button!')
      await addNotification(uid, 'bot-priya', 'follow', null, null)
    }
  } catch (e) {
    console.warn('onboard partial failure', e)
  }
}

// every critical action gets a deadline — UI kabhi 'Saving…' pe stuck nahi
export function withTimeout(p, ms = 8000, label = 'Network') {
  return Promise.race([
    Promise.resolve(p),
    new Promise((_, rej) => setTimeout(() => rej(new Error(label + ' is taking too long — check your internet and try again')), ms)),
  ])
}

// image ko canvas se downscale karke dataURL banao (Firestore-safe, Storage ki zaroorat nahi)
async function fileToDataUrl(file, max = 256, q = 0.85) {
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * scale)
    c.height = Math.round(bmp.height * scale)
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height)
    return c.toDataURL('image/jpeg', q)
  } catch {
    // fallback: FileReader + Image
    const url = URL.createObjectURL(file)
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image()
        i.onload = () => res(i)
        i.onerror = () => rej(new Error('Image decode failed'))
        i.src = url
      })
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale)
      c.height = Math.round(img.height * scale)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      return c.toDataURL('image/jpeg', q)
    } finally { URL.revokeObjectURL(url) }
  }
}

export async function updateMe(uid, { name, bio, avatarFile, username, pronouns, links, gender }) {
  const patch = {}
  if (typeof name === 'string' && name.trim()) patch.name = name.trim().slice(0, 40)
  if (typeof bio === 'string') patch.bio = bio.slice(0, 160)
  if (typeof pronouns === 'string') patch.pronouns = pronouns.trim().slice(0, 20)
  if (typeof links === 'string') patch.links = links.trim().slice(0, 100)
  if (typeof gender === 'string') patch.gender = gender.slice(0, 20)
  if (avatarFile) {
    if (!avatarFile.type.startsWith('image/')) throw new Error('Avatar must be an image')
    // Firestore-direct avatar (downscaled dataURL) — upload fail ho hi nahi sakta
    patch.avatar = await withTimeout(fileToDataUrl(avatarFile), 15000, 'Photo process')
  }
  if (typeof username === 'string' && username.trim()) {
    const newU = username.trim().toLowerCase()
    if (!/^[a-z0-9._]{3,30}$/.test(newU)) throw new Error('Username 3-30 chars, only a-z 0-9 . _')
    const cur = await getDoc(doc(db, 'users', uid)).catch(() => null)
    const oldU = cur && cur.exists() ? cur.data().username : null
    if (newU !== oldU) {
      const taken = await getDoc(doc(db, 'usernames', newU))
      if (taken.exists()) throw new Error('Username already taken')
      await withTimeout(setDoc(doc(db, 'usernames', newU), { uid }), 8000, 'Username save')
      if (oldU) await deleteDoc(doc(db, 'usernames', oldU)).catch(() => {})
      patch.username = newU
    }
  }
  await withTimeout(updateDoc(doc(db, 'users', uid), patch), 10000, 'Profile save')
  return patch // local merge — koi extra read nahi (stuck-proof)
}

// ---------------------------------------------------------------- follow
// ---------- follow requests (private accounts) ----------
export async function setPrivate(uid, val) {
  await updateDoc(doc(db, 'users', uid), { isPrivate: !!val })
}

export async function requestFollow(meId, target) {
  await setDoc(doc(db, 'requests', `${meId}__${target.id}`), {
    fromId: meId, toId: target.id, createdAt: serverTimestamp(),
  })
  await addNotification(target.id, meId, 'follow_request', null, null)
}

export async function cancelRequest(meId, targetId) {
  await deleteDoc(doc(db, 'requests', `${meId}__${targetId}`)).catch(() => {})
}

export async function amRequesting(meId, targetId) {
  const r = await getDoc(doc(db, 'requests', `${meId}__${targetId}`)).catch(() => null)
  return !!(r && r.exists())
}

export async function listRequests(meId) {
  const snap = await getDocs(query(collection(db, 'requests'), where('toId', '==', meId), limit(30)))
  const out = []
  for (const d of snap.docs) {
    const u = await cachedUser(d.data().fromId)
    if (u) out.push({ reqId: d.id, user: u })
  }
  return out
}

export async function acceptRequest(me, requesterUser) {
  await deleteDoc(doc(db, 'requests', `${requesterUser.id}__${me.id}`)).catch(() => {})
  const key = `${requesterUser.id}_${me.id}`
  await setDoc(doc(db, 'follows', key), { followerId: requesterUser.id, followingId: me.id, createdAt: serverTimestamp() })
  await updateDoc(doc(db, 'users', requesterUser.id), { followingCount: increment(1) })
  await updateDoc(doc(db, 'users', me.id), { followersCount: increment(1) })
  myFollowing.add(requesterUser.id)
  await addNotification(me.id, requesterUser.id, 'follow', null, null)
  await addNotification(requesterUser.id, me.id, 'follow_accept', null, null)
}

export async function deleteRequest(reqId) {
  await deleteDoc(doc(db, 'requests', reqId))
}

export async function setFollow(meId, target, wantFollow) {
  const key = `${meId}_${target.id}`
  if (wantFollow) {
    if (target.isPrivate) {
      await requestFollow(meId, target)
      return 'requested'
    }
    await setDoc(doc(db, 'follows', key), { followerId: meId, followingId: target.id, createdAt: serverTimestamp() })
    await updateDoc(doc(db, 'users', meId), { followingCount: increment(1) })
    await updateDoc(doc(db, 'users', target.id), { followersCount: increment(1) })
    myFollowing.add(target.id)
    await addNotification(target.id, meId, 'follow', null, null)
  } else {
    await cancelRequest(meId, target.id)
    await deleteDoc(doc(db, 'follows', key))
    await updateDoc(doc(db, 'users', meId), { followingCount: increment(-1) })
    await updateDoc(doc(db, 'users', target.id), { followersCount: increment(-1) })
    myFollowing.delete(target.id)
  }
  return wantFollow
}

export async function listUserConnections(username, kind) {
  const u = await getUserByUsername(username)
  if (!u) throw new Error('User not found')
  const field = kind === 'followers' ? 'followingId' : 'followerId'
  const qy = query(collection(db, 'follows'), where(field, '==', u.id), limit(100))
  const snap = await getDocs(qy)
  const ids = snap.docs.map((d) => (kind === 'followers' ? d.data().followerId : d.data().followingId)).filter((x) => x !== u.id)
  const out = []
  for (const id of ids.slice(0, 30)) {
    const cu = await cachedUser(id)
    if (cu) out.push({ ...cu, isFollowing: myFollowing.has(id) })
  }
  return out
}

export async function suggestions(meId) {
  const snap = await getDocs(query(collection(db, 'users'), limit(25)))
  const out = []
  snap.forEach((d) => {
    if (d.id === meId || myFollowing.has(d.id)) return
    out.push({ ...profileOut(d.id, d.data()), isFollowing: false })
  })
  return out.slice(0, 5)
}

export async function searchUsers(q) {
  const clean = String(q || '').trim().toLowerCase().replace(/^@/, '')
  if (!clean) return []
  const out = []
  const seen = new Set()
  const push = (u) => { if (u && !seen.has(u.id)) { seen.add(u.id); out.push({ ...u, isFollowing: myFollowing.has(u.id) }) } }

  // Layer 1: exact username (get — hamesha allowed)
  try {
    const exact = await getDoc(doc(db, 'usernames', clean))
    if (exact.exists()) push(await cachedUser(exact.data().uid))
  } catch (e) { console.warn('search exact', e) }

  // Layer 2: usernames index prefix query
  try {
    const qy = query(collection(db, 'usernames'), orderBy('__name__'), startAt(clean), endAt(clean + '\uf8ff'), limit(12))
    const snap = await getDocs(qy)
    for (const d of snap.docs) push(await cachedUser(d.data().uid))
  } catch (e) { console.warn('search prefix', e) }

  // Layer 3: users collection prefix (name/username partial)
  try {
    const uq = query(collection(db, 'users'), orderBy('username'), startAt(clean), endAt(clean + '\uf8ff'), limit(12))
    const usnap = await getDocs(uq)
    for (const d of usnap.docs) push(profileOut(d.id, d.data()))
  } catch (e) { console.warn('search users', e) }

  return out
}

// ---------------------------------------------------------------- posts
function postOut(d) {
  const data = d.data()
  return {
    id: d.id,
    caption: data.caption || '',
    media: data.media,
    mediaType: data.mediaType || 'image',
    type: data.type || 'post',
    createdAt: tsToMs(data.createdAt),
    user: { id: data.userId, username: data.username, name: data.name, avatar: data.avatar, verified: !!data.userVerified || VERIFIED_IDS.has(data.userId) },
    likes: data.likesCount || 0,
    likedByMe: (data.likes || []).includes(auth.currentUser?.uid),
    savedByMe: (data.savedBy || []).includes(auth.currentUser?.uid),
    comments: [],
    commentsCount: data.commentsCount || 0,
  }
}

export async function getPostPage({ cursor, count = 6 } = {}) {
  let qy = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(count))
  if (cursor) qy = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(cursor), limit(count))
  const snap = await getDocs(qy)
  const me = auth.currentUser?.uid
  const posts = snap.docs.map(postOut).filter((p) => p.user.id !== me || p.type !== 'reel')
  // attach last 2 comments per post for the card preview
  for (const p of posts) {
    try {
      const cs = await getDocs(query(collection(db, 'posts', p.id, 'comments'), orderBy('createdAt', 'desc'), limit(2)))
      p.comments = cs.docs.reverse().map(commentOut)
    } catch (e) { p.comments = [] }
  }
  return { posts, cursor: snap.docs.length ? snap.docs[snap.docs.length - 1] : null }
}

export async function getFeed({ cursor, count = 6 } = {}) {
  const me = auth.currentUser?.uid
  await loadFollowing(me)
  let qy = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(40))
  if (cursor) qy = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(cursor), limit(40))
  const snap = await getDocs(qy)
  const posts = snap.docs.map(postOut).filter((p) => myFollowing.has(p.user.id) || p.user.id === me)
  // speed: no per-post comment queries here — PostModal loads full comments on demand
  return { posts, cursor: snap.docs.length ? snap.docs[snap.docs.length - 1] : null }
}

export async function getUserPosts(username, type = 'post') {
  const u = await getUserByUsername(username)
  if (!u) throw new Error('User not found')
  const qy = query(collection(db, 'posts'), where('userId', '==', u.id), limit(100))
  const snap = await getDocs(qy)
  return snap.docs.map(postOut)
    .filter((p) => (p.type || 'post') === type)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function getSaved(meId) {
  const snap = await getDoc(doc(db, 'users', meId))
  const saved = snap.exists() ? snap.data().saved || [] : []
  const out = []
  for (const id of saved.slice(0, 30)) {
    const p = await getPost(id)
    if (p) out.push(p)
  }
  return out
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, 'posts', id))
  return snap.exists() ? postOut(snap) : null
}

function randName() { return Date.now() + '-' + Math.random().toString(36).slice(2, 10) }

export async function createPost(me, file, caption, type = 'post') {
  if (!file) throw new Error('Please choose a photo or video')
  if (file.size > 40 * 1024 * 1024) throw new Error('File too large (max 40MB)')
  const mediaType = file.type.startsWith('video/') ? 'video' : 'image'
  const ext = (file.name || 'x.jpg').split('.').pop().toLowerCase().slice(0, 5) || (mediaType === 'video' ? 'mp4' : 'jpg')
  const path = `uploads/${me.id}/${randName()}.${ext}`
  const r = ref(storage, path)
  await uploadBytes(r, file, { contentType: file.type || 'application/octet-stream' })
  const media = await getDownloadURL(r)
  const refDoc = await addDoc(collection(db, 'posts'), {
    userId: me.id, username: me.username, name: me.name || me.username, avatar: me.avatar || null,
    media, mediaType, caption: String(caption || '').slice(0, 2200), type,
    likes: [], likesCount: 0, commentsCount: 0, savedBy: [],
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'users', me.id), { postsCount: increment(1) })
  return getPost(refDoc.id)
}

export async function deletePost(meId, post) {
  const batch = writeBatch(db)
  batch.delete(doc(db, 'posts', post.id))
  const cs = await getDocs(query(collection(db, 'posts', post.id, 'comments'), limit(50)))
  cs.forEach((d) => batch.delete(d.ref))
  const ns = await getDocs(query(collection(db, 'notifications'), where('postId', '==', post.id), limit(50)))
  ns.forEach((d) => batch.delete(d.ref))
  await batch.commit()
  await updateDoc(doc(db, 'users', meId), { postsCount: increment(-1) })
  // stored file cleanup is optional; Firebase Storage files can be purged from console
}

export async function toggleLike(post, meId) {
  const refDoc = doc(db, 'posts', post.id)
  const liked = !post.likedByMe
  await runTransaction(db, async (tx) => {
    const d = await tx.get(refDoc)
    if (!d.exists()) return
    const likes = d.data().likes || []
    const has = likes.includes(meId)
    tx.update(refDoc, {
      likes: liked ? arrayUnion(meId) : arrayRemove(meId),
      likesCount: increment(liked ? (has ? 0 : 1) : has ? -1 : 0),
    })
  })
  if (liked) await addNotification(post.user.id, meId, 'like', post.id, post.media)
  return liked
}

export async function toggleSave(meId, post) {
  const refDoc = doc(db, 'users', meId)
  const next = !post.savedByMe
  await updateDoc(refDoc, { saved: next ? arrayUnion(post.id) : arrayRemove(post.id) })
  if (next) await updateDoc(doc(db, 'posts', post.id), { savedBy: arrayUnion(meId) }).catch(() => {})
  return next
}

function commentOut(d) {
  const data = d.data()
  return { id: d.id, text: data.text, createdAt: tsToMs(data.createdAt), user: { id: data.userId, username: data.username, avatar: data.avatar || null, verified: VERIFIED_IDS.has(data.userId) }, likesCount: data.likesCount || 0, likes: data.likes || [], parentId: data.parentId || null, parentUsername: data.parentUsername || null }
}

export async function getComments(postId) {
  const cs = await getDocs(query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(100)))
  return cs.docs.map(commentOut)
}

export async function addComment(me, post, text, parent = null) {
  const clean = String(text || '').trim().slice(0, 1000)
  if (!clean) throw new Error('Comment cannot be empty')
  const cRef = await addDoc(collection(db, 'posts', post.id, 'comments'), {
    userId: me.id, username: me.username, avatar: me.avatar || null,
    text: clean, createdAt: serverTimestamp(),
    parentId: parent ? parent.id : null, parentUsername: parent ? parent.user.username : null,
    likes: [], likesCount: 0,
  })
  await updateDoc(doc(db, 'posts', post.id), { commentsCount: increment(1) })
  await addNotification(post.user.id, me.id, 'comment', post.id, post.media)
  return { id: cRef.id, text: clean, createdAt: Date.now(), user: { id: me.id, username: me.username, avatar: me.avatar || null }, likesCount: 0, likes: [me.id], parentId: parent ? parent.id : null, parentUsername: parent ? parent.user.username : null }
}

// caption edit (owner only)
export async function updateCaption(uid, post, caption) {
  if (post.user.id !== uid) throw new Error('Not allowed')
  const clean = String(caption || '').trim().slice(0, 2200)
  await updateDoc(doc(db, 'posts', post.id), { caption: clean })
  return clean
}

// comment like/unlike (optimistic-friendly)
export async function likeComment(postId, c, uid) {
  const liked = (c.likes || []).includes(uid)
  await updateDoc(doc(db, 'posts', postId, 'comments', c.id), {
    likes: liked ? arrayRemove(uid) : arrayUnion(uid),
    likesCount: increment(liked ? -1 : 1),
  })
  return !liked
}

export async function deleteComment(meId, post, comment) {
  const isMine = comment.user.id === meId
  const isPostOwner = post.user.id === meId
  if (!isMine && !isPostOwner) throw new Error('Not allowed')
  await deleteDoc(doc(db, 'posts', post.id, 'comments', comment.id))
  await updateDoc(doc(db, 'posts', post.id), { commentsCount: increment(-1) })
}

// ---------------------------------------------------------------- stories
export async function addStoryView(storyId, uid) {
  await updateDoc(doc(db, 'stories', storyId), { views: arrayUnion(uid) }).catch(() => {})
}

export async function getStoryViewers(storyId) {
  const snap = await getDoc(doc(db, 'stories', storyId)).catch(() => null)
  const ids = (snap && snap.exists() ? snap.data().views : []) || []
  const out = []
  for (const id of ids.slice(0, 50)) {
    const u = await cachedUser(id)
    if (u) out.push(u)
  }
  return out
}

const STORY_TTL = 24 * 60 * 60 * 1000

export async function addStory(me, file) {
  if (!file) throw new Error('Please choose a photo')
  const mediaType = file.type.startsWith('video/') ? 'video' : 'image'
  const ext = (file.name || 'x.jpg').split('.').pop().toLowerCase().slice(0, 5) || 'jpg'
  const path = `stories/${me.id}/${randName()}.${ext}`
  const r = ref(storage, path)
  await uploadBytes(r, file, { contentType: file.type || 'application/octet-stream' })
  const media = await getDownloadURL(r)
  await addDoc(collection(db, 'stories'), {
    userId: me.id, username: me.username, avatar: me.avatar || null,
    media, mediaType, createdAt: serverTimestamp(),
  })
}

export async function getStoryGroups(meId) {
  const snap = await getDocs(query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(60)))
  const now = Date.now()
  const byUser = new Map()
  snap.forEach((d) => {
    const s = d.data()
    const created = tsToMs(s.createdAt)
    if (now - created > STORY_TTL) return
    if (!byUser.has(s.userId)) byUser.set(s.userId, { user: { id: s.userId, username: s.username, avatar: s.avatar, verified: VERIFIED_IDS.has(s.userId) }, stories: [] })
    byUser.get(s.userId).stories.push({ id: d.id, media: s.media, mediaType: s.mediaType || 'image', createdAt: created })
  })
  const meSnap = await getDoc(doc(db, 'users', meId))
  const viewed = new Set(meSnap.exists() ? meSnap.data().viewedStories || [] : [])
  const groups = [...byUser.values()].map((g) => ({
    ...g,
    stories: g.stories.sort((a, b) => a.createdAt - b.createdAt),
    allViewed: g.stories.every((s) => viewed.has(s.id)),
  }))
  groups.sort((a, b) => {
    if (a.user.id === meId) return -1
    if (b.user.id === meId) return 1
    if (a.allViewed !== b.allViewed) return a.allViewed ? 1 : -1
    return 0
  })
  return groups
}

export async function markStorySeen(meId, storyId) {
  const refDoc = doc(db, 'users', meId)
  const snap = await getDoc(refDoc)
  const seen = snap.exists() ? snap.data().viewedStories || [] : []
  seen.push(storyId)
  const trimmed = seen.slice(-200)
  await updateDoc(refDoc, { viewedStories: trimmed })
}

// ---------------------------------------------------------------- messages
export function pairId(a, b) { return [a, b].sort().join('__') }

export async function sendMessage(fromId, toId, text, meta = {}) {
  const clean = String(text || '').trim().slice(0, 2000)
  if (!clean) throw new Error('Message cannot be empty')
  const pid = pairId(fromId, toId)
  const mRef = await addDoc(collection(db, 'dms', pid, 'messages'), {
    from: fromId, to: toId, text: clean, createdAt: serverTimestamp(), read: false,
    replyTo: meta.replyTo ? { text: String(meta.replyTo.text || '').slice(0, 120), from: String(meta.replyTo.from || '') } : null,
  })
  const unreadField = fromId === pairId(fromId, toId).split('__')[0] ? 'unreadA' : 'unreadB'
  const myUnreadField = fromId === pid.split('__')[0] ? 'unreadA' : 'unreadB'
  const otherUnreadField = myUnreadField === 'unreadA' ? 'unreadB' : 'unreadA'
  await setDoc(doc(db, 'dms', pid), {
    uids: pid.split('__'), lastText: clean, lastAt: serverTimestamp(), lastFrom: fromId,
    [otherUnreadField]: increment(1),
  }, { merge: true })
  return { id: mRef.id, text: clean, createdAt: Date.now(), fromMe: true, read: false, replyTo: meta.replyTo || null }
}

export function subscribeThread(pid, cb) {
  const qy = query(collection(db, 'dms', pid, 'messages'), orderBy('createdAt', 'asc'), limit(200))
  return onSnapshot(qy, (snap) => {
    const me = auth.currentUser?.uid
    const msgs = snap.docs.map((d) => {
      const v = d.data()
      return { id: d.id, text: v.text, createdAt: tsToMs(v.createdAt), fromMe: v.from === me, read: v.read || false, reaction: v.reaction || '', unsent: !!v.unsent, replyTo: v.replyTo || null }
    })
    cb(msgs)
  })
}

export async function markThreadRead(pid, meId) {
  const field = pid.split('__')[0] === meId ? 'unreadA' : 'unreadB'
  await updateDoc(doc(db, 'dms', pid), { [field]: 0, ['readAt_' + meId]: serverTimestamp() }).catch(() => {})
}

// --- DM power features: reactions, unsend, typing, seen, presence ---
export async function reactToMessage(pid, msgId, emoji) {
  await updateDoc(doc(db, 'dms', pid, 'messages', msgId), { reaction: emoji || '' })
}

export async function unsendMessage(pid, msgId) {
  await updateDoc(doc(db, 'dms', pid, 'messages', msgId), { unsent: true, text: '' })
}

export async function clearChat(pid) {
  const snap = await getDocs(query(collection(db, 'dms', pid, 'messages'), limit(200)))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
  await updateDoc(doc(db, 'dms', pid), { lastText: '' }).catch(() => {})
}

export async function setTyping(pid, uid, on) {
  await updateDoc(doc(db, 'dms', pid), { ['typing_' + uid]: on ? Date.now() : 0 }).catch(() => {})
}

// live typing + seen state for a chat
export function subscribeDmState(pid, otherId, cb) {
  return onSnapshot(doc(db, 'dms', pid), (snap) => {
    if (!snap.exists()) return cb({ typing: false, otherSeenMs: 0 })
    const v = snap.data()
    cb({ typing: (v['typing_' + otherId] || 0) > Date.now() - 4500, otherSeenMs: tsToMs(v['readAt_' + otherId]) })
  })
}

export async function touchPresence(uid) {
  await updateDoc(doc(db, 'users', uid), { lastActive: serverTimestamp() }).catch(() => {})
}

// native haptic tick (no-op on web)
export async function buzz(style = 'light') {
  try {
    if (!window.Capacitor?.isNativePlatform?.()) return
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    await Haptics.impact({ style: style === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light })
  } catch {}
}

export function subscribeThreads(meId, cb) {
  const qy = query(collection(db, 'dms'), where('uids', 'array-contains', meId), limit(50))
  return onSnapshot(qy, async (snap) => {
    const out = []
    for (const d of snap.docs) {
      const v = d.data()
      const otherId = (v.uids || []).find((x) => x !== meId)
      if (!otherId) continue
      const u = await cachedUser(otherId)
      if (!u) continue
      const myField = d.id.split('__')[0] === meId ? 'unreadA' : 'unreadB'
      out.push({
        user: u,
        last: { text: v.lastText || '', createdAt: tsToMs(v.lastAt), fromMe: v.lastFrom === meId },
        unread: v.lastFrom === meId ? 0 : (v[myField] || 0),
      })
    }
    out.sort((a, b) => b.last.createdAt - a.last.createdAt)
    cb(out)
  })
}

// ---------------------------------------------------------------- notifications
async function addNotification(userId, actorId, type, postId, postThumb) {
  if (userId === actorId) return
  await addDoc(collection(db, 'notifications'), {
    userId, actorId, type, postId: postId || null, postThumb: postThumb || null,
    read: false, createdAt: serverTimestamp(),
  })
}

export function subscribeNotifications(meId, cb) {
  const qy = query(collection(db, 'notifications'), where('userId', '==', meId), limit(60))
  return onSnapshot(qy, async (snap) => {
    const out = []
    for (const d of snap.docs) {
      const v = d.data()
      const actor = await cachedUser(v.actorId)
      out.push({
        id: d.id, type: v.type, read: !!v.read, createdAt: tsToMs(v.createdAt),
        actor: actor || { id: v.actorId, username: 'user' },
        postThumb: v.postThumb || null, postId: v.postId || null,
      })
    }
    out.sort((a, b) => b.createdAt - a.createdAt)
    cb(out)
  })
}

export async function markNotificationsRead(meId) {
  const qy = query(collection(db, 'notifications'), where('userId', '==', meId), where('read', '==', false), limit(60))
  const snap = await getDocs(qy)
  const batch = writeBatch(db)
  snap.forEach((d) => batch.update(d.ref, { read: true }))
  if (!snap.empty) await batch.commit()
}

// ---------------------------------------------------------------- explore / search
export async function explore(meId) {
  const snap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(60)))
  const posts = snap.docs.map(postOut).filter((p) => p.user.id !== meId && (p.type || 'post') === 'post')
  posts.sort((a, b) => b.likes * 1e13 + b.createdAt - (a.likes * 1e13 + a.createdAt))
  return posts.slice(0, 30)
}

export async function getReels(meId) {
  const snap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(60)))
  const all = snap.docs.map(postOut).filter((p) => p.user.id !== meId)
  const reels = all.filter((p) => p.type === 'reel')
  if (reels.length >= 3) return reels.slice(0, 10)
  const posts = all.filter((p) => p.type !== 'reel').slice(0, 6)
  return [...reels, ...posts]
}

export async function searchPosts(q) {
  const clean = String(q || '').trim().toLowerCase()
  if (!clean) return []
  const snap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100)))
  return snap.docs.map(postOut).filter((p) => (p.caption || '').toLowerCase().includes(clean)).slice(0, 12)
}

export async function getLikedPosts(uid) {
  const snap = await getDocs(query(collection(db, 'posts'), where('likes', 'array-contains', uid), limit(60)))
  const out = snap.docs.map(postOut)
  out.sort((a, b) => b.createdAt - a.createdAt)
  return out
}

// ---------------------------------------------------------------- demo seed (runs from the app on first login)
const RAW = 'https://raw.githubusercontent.com/piyushkumarexe/Instagram-/arena/01a0afc6-instagram/seeds'
const SEED_BOTS = {
  'bot-aarav': { username: 'aarav_sharma', name: 'Aarav Sharma', avatar: `${RAW}/avatars/aarav.jpg`, bio: 'Travel photographer 📸 | Chasing light & mountains | India 🇮🇳' },
  'bot-priya': { username: 'priya.verma', name: 'Priya Verma', avatar: `${RAW}/avatars/priya.jpg`, bio: 'Foodie for life 🍜 | Recipe experiments | DM for collabs' },
  'bot-rohan': { username: 'rohan_mehta', name: 'Rohan Mehta', avatar: `${RAW}/avatars/rohan.jpg`, bio: 'Fitness coach 💪 | No shortcuts, just reps | Online coaching' },
  'bot-ishani': { username: 'ishani_captures', name: 'Ishani Rao', avatar: `${RAW}/avatars/ishani.jpg`, bio: 'Wildlife & nature 🐆 | Conservation first | NatGeo wannabe' },
  'bot-karan': { username: 'karan.art', name: 'Karan Malhotra', avatar: `${RAW}/avatars/karan.jpg`, bio: 'Digital artist 🎨 | Neon dreams | Commissions open' },
}
const SEED_FOLLOWS = [
  ['bot-aarav', 'bot-priya'], ['bot-aarav', 'bot-ishani'], ['bot-priya', 'bot-aarav'],
  ['bot-priya', 'bot-karan'], ['bot-rohan', 'bot-aarav'], ['bot-ishani', 'bot-aarav'],
  ['bot-ishani', 'bot-karan'], ['bot-karan', 'bot-priya'], ['bot-karan', 'bot-ishani'],
  ['bot-rohan', 'bot-priya'],
]
const SEED_POSTS = [
  ['bot-aarav', 'posts/trek.jpg', 'Chasing sunrises above the clouds 🏔️✨ 12km trek, 100% worth it. #mountains #sunrise #trek #incredibleindia', 5, ['bot-priya', 'bot-ishani', 'bot-rohan', 'bot-karan'], [['bot-priya', 'This looks unreal 😍', 4], ['bot-ishani', 'Take me next time! 🙌', 3]]],
  ['bot-aarav', 'posts/trek2.jpg', 'Sea of clouds from the summit. Sometimes you have to climb a little higher for a better view ☁️ #wanderlust', 30, ['bot-karan'], [['bot-karan', 'Wallpaper material! 📸', 28]]],
  ['bot-priya', 'posts/chaat.jpg', 'Street food crawl tonight 🌶️ pani puri > everything, fight me 😤 #chaat #streetfood #foodie', 8, ['bot-aarav', 'bot-karan', 'bot-rohan'], [['bot-aarav', 'Extra sev please 😋', 7], ['bot-karan', 'Art, honestly 🎨', 5]]],
  ['bot-priya', 'posts/chaat2.jpg', 'Craving this again already… who is coming? 🙋‍♀️ #foodstagram', 2, ['bot-ishani'], [['bot-ishani', 'Me! Pickup at 7?', 1]]],
  ['bot-ishani', 'posts/palace.jpg', 'Heritage in every window. Jaipur, you beauty 🕌✨ #jaipur #hawamahal #architecture', 50, ['bot-aarav', 'bot-priya', 'bot-karan', 'bot-rohan'], [['bot-aarav', 'The symmetry! 🤩', 48]]],
  ['bot-ishani', 'posts/trek3.jpg', 'Into the wild we go 🌄 patience, silence, and then — magic. #nature #wildlife', 12, ['bot-karan'], [['bot-karan', 'Those colours though 🧡', 11]]],
  ['bot-karan', 'posts/palace2.jpg', 'Colour study on heritage architecture 🎨 swipe-worthy gradients everywhere. #digitalart #aesthetic', 20, ['bot-priya'], [['bot-priya', 'This palette 😍😍', 18]]],
  ['bot-karan', 'posts/palace3.jpg', 'Neon dreams loading… new series dropping soon ⚡ #neon #artoftheday', 4, ['bot-aarav', 'bot-ishani'], []],
  ['bot-aarav', 'posts/trek3.jpg', 'POV: you picked the harder trail 🥾 #reels #trek #mountains', 6, ['bot-priya'], []],
  ['bot-priya', 'posts/chaat2.jpg', 'ASMR but make it chaat 🌶️😋 #reels #foodie', 3, ['bot-aarav'], []],
]

// copy a seed file into Firebase Storage so future loads hit Google's CDN
async function mirrorToStorage(name, fallbackUrl) {
  try {
    const res = await fetch(fallbackUrl)
    if (!res.ok) throw new Error(String(res.status))
    const blob = await res.blob()
    const r = ref(storage, 'seed/' + name)
    await uploadBytes(r, blob)
    return await getDownloadURL(r)
  } catch {
    return fallbackUrl
  }
}

export async function seedDemoContentIfEmpty() {
  // transaction lock so only ONE client ever seeds
  const lockRef = doc(db, 'meta', 'seed')
  let claimed = false
  try {
    await runTransaction(db, async (tx) => {
      const d = await tx.get(lockRef)
      if (d.exists()) return
      claimed = true
      tx.set(lockRef, { seededAt: Date.now() })
    })
  } catch (e) { return }
  if (!claimed) return
  try {
    for (const [id, b] of Object.entries(SEED_BOTS)) {
      b = { ...b, avatar: await mirrorToStorage(`avatar-${id}.jpg`, b.avatar) }
      await setDoc(doc(db, 'users', id), {
        ...b, email: b.username.replace(/[^a-z0-9]/g, '') + '@vibegram.app',
        followersCount: 0, followingCount: 0, postsCount: 0, saved: [], viewedStories: [],
        createdAt: serverTimestamp(),
      }, { merge: true })
      await setDoc(doc(db, 'usernames', b.username), { uid: id }, { merge: true })
      userCache.set(id, { id, ...b })
    }
    const batch = writeBatch(db)
    const counts = {}
    for (const [a, b] of SEED_FOLLOWS) {
      batch.set(doc(db, 'follows', `${a}_${b}`), { followerId: a, followingId: b, createdAt: serverTimestamp() })
      counts[b] = (counts[b] || 0) + 1 // followers gained
      counts[a + ':f'] = (counts[a + ':f'] || 0) + 1 // following gained
    }
    for (const id of Object.keys(SEED_BOTS)) {
      batch.update(doc(db, 'users', id), { followersCount: increment(counts[id] || 0), followingCount: increment(counts[id + ':f'] || 0), postsCount: increment(2) })
    }
    await batch.commit()

    for (const [author, img, caption, hrs, likers, comments] of SEED_POSTS) {
      const b = SEED_BOTS[author]
      const isReel = caption.includes('#reels')
      const mediaUrl = await mirrorToStorage(img.replace(/[^a-z0-9.]/gi, '-'), `${RAW}/${img}`)
      const pRef = await addDoc(collection(db, 'posts'), {
        userId: author, username: b.username, name: b.name, avatar: b.avatar,
        media: mediaUrl, mediaType: 'image', caption, type: isReel ? 'reel' : 'post',
        likes: likers, likesCount: likers.length, commentsCount: comments.length, savedBy: [],
        createdAt: serverTimestamp(),
      })
      for (const [who, text, ch] of comments) {
        await addDoc(collection(db, 'posts', pRef.id, 'comments'), {
          userId: who, username: SEED_BOTS[who].username, avatar: SEED_BOTS[who].avatar,
          text, createdAt: new Date(Date.now() - ch * 3600 * 1000),
        })
      }
    }
    for (const [author, img, hrs] of [['bot-aarav', 'posts/palace.jpg', 2], ['bot-priya', 'posts/chaat.jpg', 5], ['bot-ishani', 'posts/trek.jpg', 8]]) {
      const b = SEED_BOTS[author]
      const sUrl = await mirrorToStorage('story-' + img.replace(/[^a-z0-9.]/gi, '-'), `${RAW}/${img}`)
      await addDoc(collection(db, 'stories'), {
        userId: author, username: b.username, avatar: b.avatar,
        media: sUrl, mediaType: 'image', createdAt: serverTimestamp(),
      })
    }
    // one example conversation between bots
    const pid = pairId('bot-aarav', 'bot-priya')
    await addDoc(collection(db, 'dms', pid, 'messages'), { from: 'bot-aarav', to: 'bot-priya', text: 'That chaat post is making me hungry 😋', createdAt: new Date(Date.now() - 5 * 3600 * 1000), read: true })
    await addDoc(collection(db, 'dms', pid, 'messages'), { from: 'bot-priya', to: 'bot-aarav', text: 'Haha come over, making a fresh batch tonight! 🌶️', createdAt: new Date(Date.now() - 4.5 * 3600 * 1000), read: true })
    await setDoc(doc(db, 'dms', pid), { uids: pid.split('__'), lastText: 'Haha come over, making a fresh batch tonight! 🌶️', lastAt: serverTimestamp(), lastFrom: 'bot-priya', unreadA: 0, unreadB: 0 }, { merge: true })
    console.log('demo content seeded ✓')
  } catch (e) {
    console.warn('seed failed (will retry next login)', e)
    // release the lock so a later session can retry
    try { await deleteDoc(lockRef) } catch (e2) {}
  }
}

export { deleteField, serverTimestamp }


// ---------------------------------------------------------------- notes (24h, like IG notes)
export async function setNote(me, text) {
  const clean = String(text || '').trim().slice(0, 60)
  const refDoc = doc(db, 'notes', me.id)
  if (!clean) {
    await deleteDoc(refDoc).catch(() => {})
    return null
  }
  await setDoc(refDoc, {
    userId: me.id, username: me.username, avatar: me.avatar || null,
    text: clean, createdAt: serverTimestamp(),
  })
  return clean
}

export function subscribeNotes(meId, cb) {
  const qy = query(collection(db, 'notes'), limit(30))
  return onSnapshot(qy, (snap) => {
    const now = Date.now()
    const out = []
    snap.forEach((d) => {
      const v = d.data()
      const created = tsToMs(v.createdAt)
      if (now - created > 24 * 3600 * 1000) return
      out.push({ id: d.id, text: v.text, username: v.username, avatar: v.avatar, createdAt: created, mine: d.id === meId })
    })
    out.sort((a, b) => (b.mine ? 1 : 0) - (a.mine ? 1 : 0) || b.createdAt - a.createdAt)
    cb(out)
  })
}

// ---------------------------------------------------------------- highlights (saved stories on profile)
export async function addStoryToHighlight(me, story) {
  const refDoc = doc(db, 'highlights', me.id)
  const snap = await getDoc(refDoc)
  if (snap.exists()) {
    await updateDoc(refDoc, {
      media: arrayUnion(story.media),
      updatedAt: serverTimestamp(),
    })
  } else {
    await setDoc(refDoc, {
      userId: me.id, username: me.username, avatar: me.avatar || null,
      title: 'Highlights', cover: story.media, media: [story.media],
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    })
  }
  return true
}

export async function getHighlight(uid) {
  const snap = await getDoc(doc(db, 'highlights', uid))
  if (!snap.exists()) return null
  const v = snap.data()
  return { title: v.title || 'Highlights', cover: v.cover, media: (v.media || []).slice(-30) }
}

// ---------------------------------------------------------------- GIFs (GIPHY public beta key, graceful fallback)
const GIPHY_KEY = 'dc6zaTOxFJmzC'
export async function searchGifs(q) {
  const ep = q.trim()
    ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q.trim())}&limit=15&rating=pg`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=15&rating=pg`
  try {
    const res = await fetch(ep)
    if (!res.ok) throw new Error('giphy ' + res.status)
    const data = await res.json()
    return (data.data || []).map((g) => g.images?.fixed_height?.url || g.images?.original?.url).filter(Boolean)
  } catch (e) {
    return []
  }
}
