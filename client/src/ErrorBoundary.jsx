import React from 'react'
import { getLogs } from './logs.js'

const RULES_HELP = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2027, 1, 1);
    }
  }
}`

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('App crashed:', error, info?.componentStack)
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children
    const msg = String(error?.message || error)
    const isPerm = /permission-denied|insufficient permissions/i.test(msg)
    return (
      <div style={{ minHeight: '100vh', background: '#fff', padding: '40px 22px', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <img src="/logo.png" alt="" style={{ width: 64, height: 64, borderRadius: 14 }} />
          <h2 style={{ margin: '14px 0 4px', fontSize: 18, color: '#262626' }}>VibeGram ek error se ruk gaya</h2>
          <p style={{ color: '#ed4956', fontSize: 13, wordBreak: 'break-word', margin: '0 0 14px' }}>{msg}</p>

          {isPerm && (
            <div style={{ textAlign: 'left', background: '#fff8e1', border: '1px solid #f0d264', borderRadius: 10, padding: 14, fontSize: 12.5, color: '#7a5d00', marginBottom: 14 }}>
              <strong>Fix (2 min):</strong> Firebase Console → Firestore Database → Rules → ye rules paste karke Publish karo:
              <pre style={{ background: '#262626', color: '#9ae6b4', padding: 10, borderRadius: 8, overflowX: 'auto', fontSize: 11, marginTop: 8 }}>{RULES_HELP}</pre>
            </div>
          )}
          {!isPerm && (
            <div style={{ textAlign: 'left', background: '#f7f7f7', border: '1px solid #dbdbdb', borderRadius: 10, padding: 14, fontSize: 12.5, color: '#555', marginBottom: 14 }}>
              Internet connection check karo aur Reload karo. Problem bani rahe toh neeche wali details bhej do.
            </div>
          )}

          <button onClick={() => location.reload()} style={{ background: '#0095f6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 34px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Reload
          </button>

          <details style={{ marginTop: 18, textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#8e8e8e', fontSize: 13 }}>Technical details</summary>
            <pre style={{ background: '#262626', color: '#cfcfcf', padding: 12, borderRadius: 8, fontSize: 11, overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: 260, overflowY: 'auto' }}>
{info?.componentStack || ''}
{getLogs()}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}
