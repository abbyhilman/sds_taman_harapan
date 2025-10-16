import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase"; // Pastikan supabase sudah diinisialisasi
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
import AllPrestasi from "./components/AllPrestasi";
import FloatingWhatsappButton from "./ui/FloatingWhatsappButton";
import PPDB from "./components/PPDB";

interface ContactInfo {
  phone: string;
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [phoneNumber, setPhoneNumber] = useState<string>("6287789164894"); // Fallback default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_info")
          .select("phone")
          .single();

        if (error) throw error;
        if (data?.phone) {
          // Normalisasi nomor telepon: hapus karakter non-digit dan pastikan format sesuai
          const normalizedPhone = data.phone.replace(/[^0-9]/g, "");
          setPhoneNumber(normalizedPhone);
        }
      } catch (error: any) {
        console.error("Error fetching phone number:", error.message);
        // Gunakan fallback phoneNumber jika terjadi error
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumber();
  }, []);

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
                  <PPDB />
                <News />
                <Contact />
              </>
            }
          />
          <Route path="/all-news" element={<AllNews />} />
          <Route path="/all-prestasi" element={<AllPrestasi />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/all-gallery" element={<AllGallery />} />
        </Routes>

        <Footer />

        {!loading && (
          <FloatingWhatsappButton
            phoneNumber={phoneNumber}
            message="Halo! Saya ingin menanyakan informasi tentang SDS Taman Harapan."
          />
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;