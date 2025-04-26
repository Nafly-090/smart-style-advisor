import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Fooder.jsx'; // Renamed from Fooder to Footer (fix typo)
import Home from './Home.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import Recent from './Recent.jsx';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Nav />
        <main className="flex-grow pt-16 sm:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<ImageUpload />} />
            <Route path="/recent" element={<Recent />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;