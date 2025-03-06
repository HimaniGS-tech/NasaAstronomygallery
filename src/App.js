// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGallery from './components/ImageGallery';
import ImageDetails from './components/ImageDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageGallery />} />
        <Route path="/image/:date" element={<ImageDetails />} />
      </Routes>
    </Router>
  );
}

export default App;