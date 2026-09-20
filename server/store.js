// Tiny JSON-file database (zero native deps, perfect for a demo app)
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')
const DB_PATH = path.join(DATA_DIR, 'db.json')

function emptyDB() {
  return { users: [], posts: [], stories: [], follows: [], messages: [], notifications: [] }
}

let db = null

function load() {
  if (fs.existsSync(DB_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
      // ensure all collections exist
      for (const k of Object.keys(emptyDB())) if (!db[k]) db[k] = []
      return db
    } catch (e) {
      console.error('Failed to parse db.json, starting fresh', e)
    }
  }
  db = emptyDB()
  return db
}

let saveTimer = null
function save() {
  // debounced atomic-ish write
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
      const tmp = DB_PATH + '.tmp'
      fs.writeFileSync(tmp, JSON.stringify(db))
      fs.renameSync(tmp, DB_PATH)
    } catch (e) {
      console.error('DB save failed', e)
    }
  }, 120)
}

function getDB() {
  if (!db) load()
  return db
}

module.exports = { getDB, save, load }
