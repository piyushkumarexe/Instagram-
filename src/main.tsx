import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

const container = document.getElementById('root')
if (container) {
  // drop the inline boot spinner the HTML paints, then hand over to React
  document.getElementById('boot')?.remove()
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
