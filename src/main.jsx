import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './i18n'
import { GymApp } from './GymApp' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GymApp />
  </StrictMode>,
)
