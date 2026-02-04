import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Navbar />
        <Hero />
        <About />
        <FeaturedProjects />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
