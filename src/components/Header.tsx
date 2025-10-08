"use client";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { id: "home", label: "Beranda" },
    { id: "about", label: "Tentang Kami" },
    { id: "programs", label: "Program" },
    { id: "facilities", label: "Fasilitas" },
    { id: "prestasi", label: "Prestasi" },
    { id: "news", label: "Berita" },
    { id: "contact", label: "Kontak" },
  ];

  // 🔹 Efek saat scroll (ubah background)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Gunakan Intersection Observer untuk deteksi section aktif
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
        rootMargin: "-50% 0px -50% 0px", // mendeteksi bagian tengah viewport
        threshold: [0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section!));

    return () => observer.disconnect();
  }, [setActiveSection]);

  // 🔹 Scroll halus ke section
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/90 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Baris utama */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <img
              src="/images/logo_tamhar.png"
              alt="Logo SDS Taman Harapan"
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                SDS Taman Harapan
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-gray-200"
                }`}
              >
                Jakarta Utara
              </p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : isScrolled
                    ? "text-gray-800 hover:bg-orange-50 hover:text-orange-600"
                    : "text-white hover:bg-white/20 hover:text-orange-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Tombol Menu Mobile */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-gray-800 hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav
            className={`md:hidden py-4 space-y-2 transition-all ${
              isScrolled ? "bg-white/90 backdrop-blur-sm" : "bg-black/70"
            }`}
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : isScrolled
                    ? "text-gray-800 hover:bg-orange-50"
                    : "text-white hover:bg-white/10"
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
