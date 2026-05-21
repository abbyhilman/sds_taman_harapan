"use client";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: "home", label: "Beranda" },
  { id: "about", label: "Tentang Kami" },
  { id: "programs", label: "Program" },
  { id: "facilities", label: "Fasilitas" },
  { id: "prestasi", label: "Prestasi" },
  { id: "news", label: "Berita" },
  { id: "gallery", label: "Galeri" },
  { id: "contact", label: "Kontak" },
];

export default function Header({
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHeaderSolid = isScrolled || location.pathname !== "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = menuItems.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const sectionId = visible[0].target.id;
          setActiveSection(sectionId);
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section!));

    return () => observer.disconnect();
  }, [setActiveSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const goToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => scrollToSection(sectionId), 120);
      return;
    }

    scrollToSection(sectionId);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isHeaderSolid 
          ? "bg-white/95 shadow-md backdrop-blur-md border-b border-slate-100 py-1" 
          : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo dengan transisi teks & ikon */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => goToSection("home")}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white p-1.5 shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/logo_tamhar.png"
                alt="Logo SDS Taman Harapan"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1
                className={`text-xl font-extrabold tracking-tight transition-colors duration-500 ${
                  isHeaderSolid ? "text-gray-900" : "text-white drop-shadow-sm"
                }`}
              >
                SDS Taman Harapan
              </h1>
              <p
                className={`text-xs font-medium transition-colors duration-500 ${
                  isHeaderSolid ? "text-gray-600" : "text-gray-300 drop-shadow-sm"
                }`}
              >
                Jakarta Utara
              </p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 scale-[1.03]"
                      : isHeaderSolid
                      ? "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Tombol Menu Mobile */}
          <button
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 border ${
              isHeaderSolid
                ? "text-gray-800 border-slate-100 hover:bg-gray-50"
                : "text-white border-white/10 hover:bg-white/10"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav
            className={`md:hidden py-4 px-2 space-y-1.5 rounded-2xl mt-2 border shadow-xl transition-all duration-300 ${
              isHeaderSolid 
                ? "bg-white border-slate-100" 
                : "bg-slate-950/95 backdrop-blur-lg border-white/10"
            }`}
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => goToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : isHeaderSolid
                    ? "text-gray-700 hover:bg-orange-50/50 hover:text-orange-600"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

