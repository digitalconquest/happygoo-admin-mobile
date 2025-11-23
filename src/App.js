import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Drivers from './components/Drivers';
import Profile from './components/Profile';
import './App.css';
import './components/Drivers.css';
import './components/Profile.css';
import './components/AddDriver.css';
import './components/DriverDetails.css';
import './components/DocumentViewer.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Driver Management App</h1>
        </header>
        
        <nav className="bottom-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">👥</span>
            <span className="nav-label">Drivers</span>
          </Link>
          <Link to="/profile" className="nav-item">
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </Link>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Drivers />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;