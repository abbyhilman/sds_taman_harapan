import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import FloatingWhatsappButton from "./ui/FloatingWhatsappButton";
import AppLoadingScreen from "./ui/AppLoadingScreen";
import ScrollAnimate from "./ui/ScrollAnimate";

// Lazy loading components untuk performa loading awal super cepat (Code Splitting)
const About = React.lazy(() => import("./components/About"));
const Programs = React.lazy(() => import("./components/Programs"));
const Facilities = React.lazy(() => import("./components/Facilities"));
const Prestasi = React.lazy(() => import("./components/Prestasi"));
const Gallery = React.lazy(() => import("./components/Gallery"));
const PPDB = React.lazy(() => import("./components/PPDB"));
const News = React.lazy(() => import("./components/News"));
const Contact = React.lazy(() => import("./components/Contact"));

const AllNews = React.lazy(() => import("./components/AllNews"));
const AllPrestasi = React.lazy(() => import("./components/AllPrestasi"));
const NewsDetail = React.lazy(() => import("./components/NewsDetail"));
const AllGallery = React.lazy(() => import("./components/AllGallery"));
const PublicPPDBPage = React.lazy(() => import("./components/PublicPPDBPage"));

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

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
          const normalizedPhone = data.phone.replace(/[^0-9]/g, "");
          setPhoneNumber(normalizedPhone);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching phone number:", message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumber();
  }, []);

  if (loading) {
    return <AppLoadingScreen label="Menyiapkan halaman SDS Taman Harapan..." />;
  }

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        
        {/* Menggunakan Suspense dengan AppLoadingScreen sebagai fallback */}
        <Suspense fallback={<AppLoadingScreen label="Memuat konten..." />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero setActiveSection={setActiveSection} />
                  
                  <ScrollAnimate variant="fade-up" delay={0}>
                    <About />
                  </ScrollAnimate>
                  
                  <ScrollAnimate variant="fade-up" delay={50}>
                    <Programs />
                  </ScrollAnimate>
                  
                  <ScrollAnimate variant="fade-up" delay={0}>
                    <Facilities />
                  </ScrollAnimate>
                
                  <ScrollAnimate variant="fade-up" delay={50}>
                    <Prestasi />
                  </ScrollAnimate>
                  
                  <ScrollAnimate variant="fade-up" delay={0}>
                    <Gallery />
                  </ScrollAnimate>
                  
                  <ScrollAnimate variant="fade-up" delay={50}>
                    <PPDB />
                  </ScrollAnimate>
                  
                  <ScrollAnimate variant="fade-up" delay={0}>
                    <News />
                  </ScrollAnimate>
                  
                  <ScrollAnimate variant="fade-up" delay={50}>
                    <Contact />
                  </ScrollAnimate>
                </>
              }
            />
            <Route path="/all-news" element={<AllNews />} />
            <Route path="/all-prestasi" element={<AllPrestasi />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/all-gallery" element={<AllGallery />} />
            <Route path="/ppdb" element={<PublicPPDBPage />} />
          </Routes>
        </Suspense>

        <Footer />

        {!loading && (
          <FloatingWhatsappButton
            phoneNumber={phoneNumber}
            message="Halo! Saya ingin menanyakan informasi tentang SDS Taman Harapan."
          />
        )}
      </div>
    </>
  );
};

export default App;


