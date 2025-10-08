import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Facilities from './components/Facilities';
import News from './components/News';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Prestasi from './components/Prestasi';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero setActiveSection={setActiveSection} />
      <About />
      <Programs />
      <Facilities />
      <Prestasi />
      <News />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
