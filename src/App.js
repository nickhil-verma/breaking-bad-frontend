import './App.css';
import About from './components/About';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import HIW from './components/HIW';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Login from './components/Login';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Stat from './components/Stat';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stat" element={<Stat />} />

        {/* Main App Layout */}
        <Route path="*" element={
          <>
            <Navbar />
            <Hero />
            <HIW />
            <About />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
