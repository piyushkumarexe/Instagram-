// Firebase bootstrap — VibeGram talks directly to Firebase (no backend server).
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyB77ActmJWWWF35TrRdxvfxMjUYXMflwCc',
  authDomain: 'vibegram-ff651.firebaseapp.com',
  projectId: 'vibegram-ff651',
  storageBucket: 'vibegram-ff651.firebasestorage.app',
  messagingSenderId: '861201865526',
  appId: '1:861201865526:web:aadefda27aefc429d6f197',
  measurementId: 'G-G1K8E6K243',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()
