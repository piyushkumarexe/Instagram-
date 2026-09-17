// Seeds demo content into Firestore (bots, posts, stories, chats).
// Safe to re-run: skips existing docs. Run: node server/seed-firebase.mjs --force to reset demo content.
import { initializeApp } from 'firebase/app'
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs,
  serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB77ActmJWWWF35TrRdxvfxMjUYXMflwCc',
  authDomain: 'vibegram-ff651.firebaseapp.com',
  projectId: 'vibegram-ff651',
  storageBucket: 'vibegram-ff651.firebasestorage.app',
  messagingSenderId: '861201865526',
  appId: '1:861201865526:web:aadefda27aefc429d6f197',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const RAW = 'https://raw.githubusercontent.com/piyushkumarexe/Instagram-/arena/01a0afc6-instagram/seeds'
const force = process.argv.includes('--force')
const HOUR = 3600 * 1000
const ago = (h) => Timestamp.fromMillis(Date.now() - h * HOUR)

const BOTS = {
  'bot-aarav': { username: 'aarav_sharma', name: 'Aarav Sharma', avatar: `${RAW}/avatars/aarav.jpg`, bio: 'Travel photographer 📸 | Chasing light & mountains | India 🇮🇳' },
  'bot-priya': { username: 'priya.verma', name: 'Priya Verma', avatar: `${RAW}/avatars/priya.jpg`, bio: 'Foodie for life 🍜 | Recipe experiments | DM for collabs' },
  'bot-rohan': { username: 'rohan_mehta', name: 'Rohan Mehta', avatar: `${RAW}/avatars/rohan.jpg`, bio: 'Fitness coach 💪 | No shortcuts, just reps | Online coaching' },
  'bot-ishani': { username: 'ishani_captures', name: 'Ishani Rao', avatar: `${RAW}/avatars/ishani.jpg`, bio: 'Wildlife & nature 🐆 | Conservation first | NatGeo wannabe' },
  'bot-karan': { username: 'karan.art', name: 'Karan Malhotra', avatar: `${RAW}/avatars/karan.jpg`, bio: 'Digital artist 🎨 | Neon dreams | Commissions open' },
}

const FOLLOWS = [
  ['bot-aarav', 'bot-priya'], ['bot-aarav', 'bot-ishani'], ['bot-priya', 'bot-aarav'],
  ['bot-priya', 'bot-karan'], ['bot-rohan', 'bot-aarav'], ['bot-ishani', 'bot-aarav'],
  ['bot-ishani', 'bot-karan'], ['bot-karan', 'bot-priya'], ['bot-karan', 'bot-ishani'],
  ['bot-rohan', 'bot-priya'],
]

// [author, image, caption, hoursAgo, likers[], comments[[bot, text, hrsAgo]]]
const POSTS = [
  ['bot-aarav', 'posts/trek.jpg', 'Chasing sunrises above the clouds 🏔️✨ 12km trek, 100% worth it. #mountains #sunrise #trek #incredibleindia', 5, ['bot-priya', 'bot-ishani', 'bot-rohan', 'bot-karan'], [['bot-priya', 'This looks unreal 😍', 4], ['bot-ishani', 'Take me next time! 🙌', 3]]],
  ['bot-aarav', 'posts/trek2.jpg', 'Sea of clouds from the summit. Sometimes you have to climb a little higher for a better view ☁️ #wanderlust', 30, ['bot-karan'], [['bot-karan', 'Wallpaper material! 📸', 28]]],
  ['bot-priya', 'posts/chaat.jpg', 'Street food crawl tonight 🌶️ pani puri > everything, fight me 😤 #chaat #streetfood #foodie', 8, ['bot-aarav', 'bot-karan', 'bot-rohan'], [['bot-aarav', 'Extra sev please 😋', 7], ['bot-karan', 'Art, honestly 🎨', 5]]],
  ['bot-priya', 'posts/chaat2.jpg', 'Craving this again already… who is coming? 🙋‍♀️ #foodstagram', 2, ['bot-ishani'], [['bot-ishani', 'Me! Pickup at 7?', 1]]],
  ['bot-ishani', 'posts/palace.jpg', 'Heritage in every window. Jaipur, you beauty 🕌✨ #jaipur #hawamahal #architecture', 50, ['bot-aarav', 'bot-priya', 'bot-karan', 'bot-rohan'], [['bot-aarav', 'The symmetry! 🤩', 48]]],
  ['bot-ishani', 'posts/trek3.jpg', 'Into the wild we go 🌄 patience, silence, and then — magic. #nature #wildlife', 12, ['bot-karan'], [['bot-karan', 'Those colours though 🧡', 11]]],
  ['bot-karan', 'posts/palace2.jpg', 'Colour study on heritage architecture 🎨 swipe-worthy gradients everywhere. #digitalart #aesthetic', 20, ['bot-priya'], [['bot-priya', 'This palette 😍😍', 18]]],
  ['bot-karan', 'posts/palace3.jpg', 'Neon dreams loading… new series dropping soon ⚡ #neon #artoftheday', 4, ['bot-aarav', 'bot-ishani'], []],
]

const REELS = [
  ['bot-aarav', 'posts/trek3.jpg', 'POV: you picked the harder trail 🥾 #reels #trek #mountains', 6],
  ['bot-priya', 'posts/chaat2.jpg', 'ASMR but make it chaat 🌶️😋 #reels #foodie', 3],
]

const STORIES = [
  ['bot-aarav', 'posts/palace.jpg', 2],
  ['bot-priya', 'posts/chaat.jpg', 5],
  ['bot-ishani', 'posts/trek.jpg', 8],
]

const DM_PAIR = ['bot-aarav', 'bot-priya']
const DM_MSGS = [
  ['bot-aarav', 'That chaat post is making me hungry 😋', 5],
  ['bot-priya', 'Haha come over, making some fresh batch tonight! 🌶️', 4.5],
  ['bot-aarav', 'Count me in 🙌', 4],
]

async function upsertBots() {
  for (const [id, b] of Object.entries(BOTS)) {
    const refDoc = doc(db, 'users', id)
    const snap = await getDoc(refDoc)
    const unameRef = doc(db, 'usernames', b.username)
    const unameSnap = await getDoc(unameRef)
    if (!unameSnap.exists()) await setDoc(unameRef, { uid: id })
    if (!snap.exists()) {
      await setDoc(refDoc, { ...b, email: b.username.replace(/[^a-z0-9]/g, '') + '@vibegram.app', followersCount: 0, followingCount: 0, postsCount: 0, saved: [], viewedStories: [], createdAt: serverTimestamp() })
    }
  }
  console.log('bots ok')
}

async function seedFollows() {
  for (const [a, b] of FOLLOWS) {
    const refDoc = doc(db, 'follows', `${a}_${b}`)
    if ((await getDoc(refDoc)).exists()) continue
    await setDoc(refDoc, { followerId: a, followingId: b, createdAt: serverTimestamp() })
    await setDoc(doc(db, 'users', b), { followersCount: incrementSafe() }, { merge: true })
    await setDoc(doc(db, 'users', a), { followingCount: incrementSafe() }, { merge: true })
  }
  console.log('follows ok')
}
function incrementSafe() { return serverCount() }
function serverCount() { return { __ct: 1 } } // placeholder replaced below

import { increment } from 'firebase/firestore'
function incr(n) { return increment(n) }

async function seedPosts() {
  const existing = await getDocs(collection(db, 'posts'))
  if (existing.size > 0 && !force) { console.log('posts already exist, skip'); return }
  let n = 0
  for (const [author, img, caption, hrs, likers, comments] of POSTS) {
    const b = BOTS[author]
    await addDoc(collection(db, 'posts'), {
      userId: author, username: b.username, name: b.name, avatar: b.avatar,
      media: `${RAW}/${img}`, mediaType: 'image', caption, type: 'post',
      likes: likers, likesCount: likers.length, commentsCount: comments.length, savedBy: [],
      createdAt: ago(hrs),
    })
    await setDoc(doc(db, 'users', author), { postsCount: incr(1) }, { merge: true })
    n++
    for (const [who, text, ch] of comments) {
      const q = await getDocs(collection(db, 'posts'))
      // find post id by caption (simple approach on small seed set)
      let postId = null
      for (const d of q.docs) { if (d.data().caption === caption) { postId = d.id; break } }
      if (!postId) continue
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        userId: who, username: BOTS[who].username, avatar: BOTS[who].avatar,
        text, createdAt: ago(ch),
      })
    }
  }
  for (const [author, img, caption, hrs] of REELS) {
    const b = BOTS[author]
    await addDoc(collection(db, 'posts'), {
      userId: author, username: b.username, name: b.name, avatar: b.avatar,
      media: `${RAW}/${img}`, mediaType: 'image', caption, type: 'reel',
      likes: ['bot-aarav', 'bot-priya'].filter((x) => x !== author), likesCount: 2, commentsCount: 0, savedBy: [],
      createdAt: ago(hrs),
    })
    await setDoc(doc(db, 'users', author), { postsCount: incr(1) }, { merge: true })
    n++
  }
  console.log(`posts ok (${n})`)
}

async function seedStories() {
  for (const [author, img, hrs] of STORIES) {
    const b = BOTS[author]
    await addDoc(collection(db, 'stories'), {
      userId: author, username: b.username, avatar: b.avatar,
      media: `${RAW}/${img}`, mediaType: 'image', createdAt: ago(hrs),
    })
  }
  console.log('stories ok')
}

async function seedDMs() {
  const pid = [...DM_PAIR].sort().join('__')
  const dmRef = doc(db, 'dms', pid)
  if ((await getDoc(dmRef)).exists()) { console.log('dm exists, skip'); return }
  for (const [from, text, hrs] of DM_MSGS) {
    await addDoc(collection(db, 'dms', pid, 'messages'), { from, to: DM_PAIR.find((x) => x !== from), text, createdAt: ago(hrs), read: true })
  }
  await setDoc(dmRef, { uids: DM_PAIR, lastText: DM_MSGS.at(-1)[1], lastAt: ago(DM_MSGS.at(-1)[2]), lastFrom: DM_MSGS.at(-1)[0], unreadA: 0, unreadB: 0 })
  console.log('dms ok')
}

try {
  await upsertBots()
  await seedFollows()
  await seedPosts()
  await seedStories()
  await seedDMs()
  console.log('🎉 Firebase seed complete!')
} catch (e) {
  console.error('SEED FAILED:', e.message)
  if (String(e.code || '').includes('permission')) console.error('→ Firestore rules are blocking writes. Make sure the database is in TEST MODE.')
  process.exit(1)
}
