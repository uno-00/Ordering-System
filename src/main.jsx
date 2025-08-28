import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx'

import './index.css'

function AppWrapper() {
  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </div>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
