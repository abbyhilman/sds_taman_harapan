"use client";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface DropdownItem {
  id: string;
  label: string;
  href?: string;
}

interface MenuItem {
  id: string;
  label: string;
  dropdown?: DropdownItem[];
  cta?: boolean;
}

const menuItems: MenuItem[] = [
  { id: "home", label: "Beranda" },
  {
    id: "about",
    label: "Tentang Kami",
    dropdown: [
      { id: "about", label: "Profil" },
      { id: "about", label: "Visi & Misi" },
      { id: "teachers", label: "Tim Pengajar" },
    ],
  },
  { id: "programs", label: "Program" },
  { id: "facilities", label: "Fasilitas" },
  { id: "gallery", label: "Galeri" },
  { id: "news", label: "Berita" },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const isHeaderSolid = isScrolled || location.pathname !== "/";

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
    const sections = menuItems.flatMap((item) =>
      item.dropdown
        ? item.dropdown.map((d) => document.getElementById(d.id))
        : [document.getElementById(item.id)]
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
      setOpenDropdown(null);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHeaderSolid ? "bg-white/90 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Baris utama */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => goToSection("home")}
          >
            <img
              src="/images/logo_tamhar.png"
              alt="Logo SDS Taman Harapan"
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  isHeaderSolid ? "text-gray-900" : "text-white"
                }`}
              >
                SDS Taman Harapan
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isHeaderSolid ? "text-gray-700" : "text-gray-200"
                }`}
              >
                Jakarta Utara
              </p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeSection === item.id || item.dropdown.some(d => d.id === activeSection)
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                        : isHeaderSolid
                        ? "text-gray-800 hover:bg-orange-50 hover:text-orange-600"
                        : "text-white hover:bg-white/20 hover:text-orange-300"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {openDropdown === item.id && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                      {item.dropdown.map((sub) => (
                        <button
                          key={sub.id + sub.label}
                          onClick={() => goToSection(sub.id)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.cta ? (
                <button
                  key={item.id}
                  onClick={() => goToSection(item.id)}
                  className="ml-2 px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.id}
                  onClick={() => goToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : isHeaderSolid
                      ? "text-gray-800 hover:bg-orange-50 hover:text-orange-600"
                      : "text-white hover:bg-white/20 hover:text-orange-300"
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
            {/* CTA Button Pendaftaran */}
            <a
              href="/ppdb"
              className="ml-2 px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Pendaftaran
            </a>
          </nav>

          {/* Tombol Menu Mobile */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isHeaderSolid
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
              isHeaderSolid ? "bg-white/90 backdrop-blur-sm" : "bg-black/70"
            }`}
          >
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.id ? null : item.id
                        )
                      }
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeSection === item.id || item.dropdown.some(d => d.id === activeSection)
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                          : isHeaderSolid
                          ? "text-gray-800 hover:bg-orange-50"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.id && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.dropdown.map((sub) => (
                          <button
                            key={sub.id + sub.label}
                            onClick={() => goToSection(sub.id)}
                            className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => goToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : isHeaderSolid
                        ? "text-gray-800 hover:bg-orange-50"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            <a
              href="/ppdb"
              className="block w-full text-center px-4 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              Pendaftaran
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
