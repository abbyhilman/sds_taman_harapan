import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import Facilities from "./components/Facilities";
import News from "./components/News";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Prestasi from "./components/Prestasi";
import AllNews from "./components/AllNews";
import NewsDetail from "./components/NewsDetail";
import Gallery from "./components/Gallery";
import AllGallery from "./components/AllGallery";

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero setActiveSection={setActiveSection} />
                <About />
                <Programs />
                <Facilities />
                <Prestasi />
                <Gallery />
                <News />
                <Contact />
              </>
            }
          />
          <Route path="/all-news" element={<AllNews />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/all-gallery" element={<AllGallery />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
