// Seeds the database with demo users & content so the app feels alive.
// Run: node server/seed.js   (add --force to wipe and reseed)
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { getDB, save } = require('./store')

const SEED_DIR = path.join(__dirname, '..', 'seeds')
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const force = process.argv.includes('--force')
const db = getDB()
if (db.users.length > 0 && !force) {
  console.log('DB already seeded. Use --force to reseed.')
  process.exit(0)
}

function copySeed(rel) {
  const src = path.join(SEED_DIR, rel)
  if (!fs.existsSync(src)) return null
  const name = 'seed-' + rel.replace(/[/\\]/g, '-')
  const dest = path.join(UPLOAD_DIR, name)
  fs.copyFileSync(src, dest)
  return '/uploads/' + name
}

const HOUR = 3600 * 1000
const DAY = 24 * HOUR

// users: [username, name, avatarFile, bio]
const USERS = [
  ['demo', 'Demo User', 'avatars/demo.jpg', '✨ Just exploring VibeGram | Demo account'],
  ['aarav_sharma', 'Aarav Sharma', 'avatars/aarav.jpg', 'Travel photographer 📸 | Chasing light & mountains | India 🇮🇳'],
  ['priya.verma', 'Priya Verma', 'avatars/priya.jpg', 'Foodie for life 🍜 | Recipe experiments | DM for collabs'],
  ['rohan_mehta', 'Rohan Mehta', 'avatars/rohan.jpg', 'Fitness coach 💪 | No shortcuts, just reps | Online coaching'],
  ['ishani_captures', 'Ishani Rao', 'avatars/ishani.jpg', 'Wildlife & nature 🐆 | Conservation first | NatGeo wannabe'],
  ['karan.art', 'Karan Malhotra', 'avatars/karan.jpg', 'Digital artist 🎨 | Neon dreams | Commissions open'],
]

const users = {}
for (const [username, name, avatarFile, bio] of USERS) {
  let u = db.users.find((x) => x.username === username)
  if (!u) {
    u = {
      id: undefined,
      username, name,
      email: username.replace(/[^a-z0-9]/g, '') + '@vibegram.app',
      passwordHash: bcrypt.hashSync('demo123', 10),
      bio, avatar: null,
      saved: [], viewedStories: [],
      createdAt: Date.now() - 30 * DAY,
    }
    db.users.push(u)
  }
  u.avatar = copySeed(avatarFile)
  users[username] = u
}

// ids for newly pushed users
function idOf(u) { return u.id }
function ensureId(u) { if (!u.id) u.id = require('crypto').randomUUID(); return u.id }
for (const k of Object.keys(users)) ensureId(users[k])

if (force) {
  db.posts = []
  db.stories = []
  db.follows = []
  db.messages = []
  db.notifications = []
}

// follows
const FOLLOWS = [
  ['demo', 'aarav_sharma'], ['demo', 'priya.verma'], ['demo', 'ishani_captures'], ['demo', 'karan.art'],
  ['aarav_sharma', 'demo'], ['aarav_sharma', 'priya.verma'], ['aarav_sharma', 'ishani_captures'],
  ['priya.verma', 'demo'], ['priya.verma', 'aarav_sharma'], ['priya.verma', 'karan.art'],
  ['rohan_mehta', 'demo'], ['rohan_mehta', 'aarav_sharma'], ['rohan_mehta', 'rohan_mehta'],
  ['ishani_captures', 'demo'], ['ishani_captures', 'karan.art'], ['ishani_captures', 'aarav_sharma'],
  ['karan.art', 'ishani_captures'], ['karan.art', 'priya.verma'],
]
for (const [a, b] of FOLLOWS) {
  if (a === b) continue
  if (!db.follows.some((f) => f.followerId === users[a].id && f.followingId === users[b].id)) {
    db.follows.push({ followerId: users[a].id, followingId: users[b].id, createdAt: Date.now() - 5 * DAY })
  }
}

// posts: [author, image, caption, hoursAgo, likers[], comments[[user, text, hoursAgo]]]
const POSTS = [
  ['aarav_sharma', 'posts/trek.jpg', 'Chasing sunrises above the clouds 🏔️✨ 12km trek, 100% worth it. #mountains #sunrise #trek #incredibleindia', 5,
    ['priya.verma', 'ishani_captures', 'demo', 'rohan_mehta', 'karan.art'],
    [['priya.verma', 'This looks unreal 😍', 4], ['ishani_captures', 'Take me next time! 🙌', 3], ['demo', 'Breathtaking 🔥', 2]]],
  ['aarav_sharma', 'posts/trek2.jpg', 'Sea of clouds from the summit. Sometimes you have to climb a little higher for a better view ☁️ #wanderlust', 30,
    ['demo', 'karan.art'],
    [['demo', 'Wallpaper material! 📸', 28]]],
  ['priya.verma', 'posts/chaat.jpg', 'Street food crawl tonight 🌶️ pani puri > everything, fight me 😤 #chaat #streetfood #foodie', 8,
    ['aarav_sharma', 'demo', 'karan.art', 'rohan_mehta'],
    [['aarav_sharma', 'Extra sev please 😋', 7], ['demo', 'Now I am hungry 🤤', 6], ['karan.art', 'Art, honestly 🎨', 5]]],
  ['priya.verma', 'posts/chaat2.jpg', 'Craving this again already… who is coming? 🙋‍♀️ #foodstagram', 2,
    ['demo', 'ishani_captures'],
    [['ishani_captures', 'Me! Pickup at 7?', 1]]],
  ['ishani_captures', 'posts/palace.jpg', 'Heritage in every window. Jaipur, you beauty 🕌✨ #jaipur #hawamahal #architecture', 50,
    ['demo', 'aarav_sharma', 'priya.verma', 'karan.art', 'rohan_mehta'],
    [['aarav_sharma', 'The symmetry! 🤩', 48], ['demo', 'Adding to my travel list 📌', 47]]],
  ['ishani_captures', 'posts/trek3.jpg', 'Into the wild we go 🌄 patience, silence, and then — magic. #nature #wildlife', 12,
    ['karan.art', 'demo'],
    [['karan.art', 'Those colours though 🧡', 11]]],
  ['karan.art', 'posts/palace2.jpg', 'Colour study on heritage architecture 🎨 swipe-worthy gradients everywhere. #digitalart #aesthetic', 20,
    ['priya.verma', 'demo'],
    [['priya.verma', 'This palette 😍😍', 18]]],
  ['karan.art', 'posts/palace3.jpg', 'Neon dreams loading… new series dropping soon ⚡ #neon #artoftheday', 4,
    ['demo', 'ishani_captures', 'aarav_sharma'],
    [['demo', 'Can not wait 🔥', 3]]],
  ['demo', 'posts/trek2.jpg', 'First post on VibeGram! 🎉 Hi everyone 👋 #newbie', 1,
    ['aarav_sharma', 'priya.verma', 'ishani_captures'],
    [['aarav_sharma', 'Welcome to the app! 🚀', 0.5], ['priya.verma', 'Nice shot! 😄', 0.4]]],
]

const posts = []
let n = 0
for (const [author, img, caption, hrsAgo, likers, comments] of POSTS) {
  const media = copySeed(img)
  if (!media) { console.warn('missing seed image', img); continue }
  const p = {
    id: require('crypto').randomUUID(),
    userId: users[author].id,
    media,
    mediaType: 'image',
    caption,
    type: 'post',
    likes: likers.map((l) => users[l].id).filter(Boolean),
    comments: comments.map(([who, text, ch]) => ({
      id: require('crypto').randomUUID(),
      userId: users[who].id,
      text,
      createdAt: Date.now() - ch * HOUR,
    })),
    createdAt: Date.now() - hrsAgo * HOUR,
  }
  db.posts.push(p)
  posts.push(p)
  n++
}

// a couple of image "reels" (client gives them a ken-burns effect)
const REELS = [
  ['aarav_sharma', 'posts/trek3.jpg', 'POV: you picked the harder trail 🥾 #reels #trek #mountains', 6],
  ['priya.verma', 'posts/chaat2.jpg', 'ASMR but make it chaat 🌶️😋 #reels #foodie', 3],
]
for (const [author, img, caption, hrsAgo] of REELS) {
  const media = copySeed(img)
  if (!media) continue
  db.posts.push({
    id: require('crypto').randomUUID(),
    userId: users[author].id,
    media,
    mediaType: 'image',
    caption,
    type: 'reel',
    likes: [users.demo.id, users['aarav_sharma'].id].filter((x) => x !== users[author].id),
    comments: [],
    createdAt: Date.now() - hrsAgo * HOUR,
  })
}

// stories (expire after 24h)
const STORIES = [
  ['aarav_sharma', 'posts/palace.jpg', 2],
  ['priya.verma', 'posts/chaat.jpg', 5],
  ['ishani_captures', 'posts/trek.jpg', 8],
  ['demo', 'posts/trek2.jpg', 1],
]
for (const [author, img, hrsAgo] of STORIES) {
  const media = copySeed(img)
  if (!media) continue
  db.stories.push({ id: require('crypto').randomUUID(), userId: users[author].id, media, mediaType: 'image', createdAt: Date.now() - hrsAgo * HOUR })
}

// messages demo <-> others
const MSGS = [
  ['aarav_sharma', 'demo', 'Yo! That sunrise shot from today 🔥🔥', 6],
  ['demo', 'aarav_sharma', 'Thanks bhai! Your palace one is insane too 🤩', 5.5],
  ['aarav_sharma', 'demo', 'Haha thanks! Planning leh next month, you in?', 5],
  ['demo', 'aarav_sharma', 'Count me in ✈️', 4.5],
  ['priya.verma', 'demo', 'Chaat party at my place this weekend? 🎉', 3],
  ['demo', 'priya.verma', "I'm so in. Bringing friends!", 2.5],
  ['rohan_mehta', 'demo', 'Hey! Loved your feed, keep it up 💪', 1],
]
for (const [from, to, text, hrsAgo] of MSGS) {
  db.messages.push({ id: require('crypto').randomUUID(), from: users[from].id, to: users[to].id, text, createdAt: Date.now() - hrsAgo * HOUR, read: hrsAgo > 2 })
}

// notifications for demo
const NOTIFS = [
  ['like', 'aarav_sharma', 'demo', 1], ['comment', 'priya.verma', 'demo', 0.5], ['like', 'ishani_captures', 'demo', 0.4],
  ['follow', 'priya.verma', null, 3], ['follow', 'ishani_captures', null, 10], ['like', 'karan.art', 'demo', 0.2],
]
const demoPost = posts.find((p) => p.userId === users.demo.id)
for (const [type, actor, , hrsAgo] of NOTIFS) {
  db.notifications.push({
    id: require('crypto').randomUUID(),
    userId: users.demo.id,
    actorId: users[actor].id,
    type,
    postId: type === 'follow' ? null : (demoPost ? demoPost.id : null),
    read: hrsAgo > 2,
    createdAt: Date.now() - hrsAgo * HOUR,
  })
}

save()
console.log(`Seeded ${n} posts, ${USERS.length} users, stories, messages & notifications.`)
console.log('Demo login → username: demo  password: demo123')
