import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PwaShell } from './components/PwaShell'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <PwaShell />
    </>
  </React.StrictMode>,
)
