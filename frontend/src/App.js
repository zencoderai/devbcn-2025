import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitTalk from './pages/SubmitTalk';
import Talks from './pages/Talks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitTalk />} />
          <Route path="/talks" element={<Talks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;