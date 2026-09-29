import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Шрифтът Inter е вече на нашия сайт (не се чака сървърът на Google)
import '@fontsource-variable/inter'
import './index.css'
import App from './App.tsx'
import { initTracking } from './utils/tracking'

initTracking()

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Ако първият екран вече е вграден в HTML-а (при build) — React само го "съживява"
// (без да го рисува наново). Иначе — нормално рисуване.
if (container.hasChildNodes()) {
  hydrateRoot(container, app, {
    // Грешка 419 е очаквана: долната част на страницата нарочно се рисува чак в браузъра.
    onRecoverableError: (error) => {
      if (!String((error as Error)?.message || '').includes('419')) console.error(error)
    },
  })
} else {
  createRoot(container).render(app)
}
