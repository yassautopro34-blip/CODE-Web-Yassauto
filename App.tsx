import React from 'react';
import { HashRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Accompagnement } from './pages/Accompagnement';
import { Mecanique } from './pages/Mecanique';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Confirmation page should not render the common Layout (no header/footer) */}
        <Route path="/merci" element={<Confirmation />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/accompagnement" element={<Accompagnement />} />
                <Route path="/mecanique" element={<Mecanique />} />
                <Route path="/propos" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;