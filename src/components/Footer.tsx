import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Beranda', href: '#home' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Program', href: '#programs' },
    { label: 'Fasilitas', href: '#facilities' },
    { label: 'Berita', href: '#news' },
    { label: 'Kontak', href: '#contact' }
  ];

  const handleClick = (href: string) => {
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/src/assets/images/logo_tamhar.png"
                alt="Logo SDS Taman Harapan"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">SDS Taman Harapan</h3>
                <p className="text-sm text-gray-400">Jakarta Utara</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Membangun generasi cerdas, berkarakter, dan berakhlak mulia untuk masa depan Indonesia yang gemilang.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Menu Cepat</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Program</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Kurikulum Merdeka</li>
              <li>Pembelajaran Digital</li>
              <li>Ekstrakurikuler</li>
              <li>Pendidikan Karakter</li>
              <li>Leadership Training</li>
              <li>Study Tour</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Jl. Warakas V Gg. 2 No.141, RT.6/RW.8, Jakarta Utara, 14340
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <a href="tel:02143576611" className="text-gray-400 hover:text-white transition-colors text-sm">
                  (021) 4357611
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <a
                  href="mailto:sdstamanharapan.jakut@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors text-sm break-all"
                >
                  sdstamanharapan.jakut@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} SDS Taman Harapan. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">
                Kebijakan Privasi
              </button>
              <button className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
