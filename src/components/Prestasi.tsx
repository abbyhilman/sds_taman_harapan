"use client";
import { useState } from "react";
import { Trophy, Star, X } from "lucide-react";

export default function Prestasi() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Fungsi untuk menampilkan popup
  const openImage = (src: string) => {
    setSelectedImage(src);
  };

  // Fungsi untuk menutup popup
  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <section id="prestasi" className="relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/bg_tamhar.png"
          alt="Background Prestasi"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-blue-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Kiri - Konten teks */}
          <div className="space-y-8 text-white">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-orange-100">
              <Trophy className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">
                Prestasi Sekolah
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
              Mengukir Prestasi, Menginspirasi Negeri
            </h2>

            <p className="text-lg text-white/95 leading-relaxed drop-shadow">
              SDS Taman Harapan terus berkomitmen menumbuhkan semangat
              kompetisi sehat dan membangun karakter unggul melalui prestasi di
              berbagai bidang — akademik, olahraga, dan seni.
            </p>

            {/* Daftar Prestasi */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Star className="h-6 w-6 text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-300">
                    Juara Umum Pencak Silat Antar Sekolah
                  </h3>
                  <p className="text-white/90 text-sm">
                    Membuktikan ketangguhan dan sportivitas siswa dalam ajang
                    tingkat Jakarta Utara.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star className="h-6 w-6 text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-300">
                    Gelar Karya Projek P5
                  </h3>
                  <p className="text-white/90 text-sm">
                    Pameran hasil karya siswa dengan tema “Bhinneka Tunggal Ika”
                    yang menampilkan kreativitas luar biasa.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star className="h-6 w-6 text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-300">
                    Kompetisi Seni & Budaya Sekolah
                  </h3>
                  <p className="text-white/90 text-sm">
                    Menunjukkan bakat dan semangat kolaboratif siswa dalam
                    berbagai lomba seni, musik, dan tari.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan - Gambar prestasi */}
          <div className="relative">
            {/* Gambar utama */}
            <div
              className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() =>
                openImage("/src/assets/images/img_prestasi_satu.jpeg")
              }
            >
              <img
                src="/src/assets/images/img_prestasi_satu.jpeg"
                alt="Prestasi SDS Taman Harapan"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gambar kecil */}
            <div className="absolute -bottom-8 -left-8 flex space-x-6">
              <div
                className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() =>
                  openImage("/src/assets/images/img_prestasi_dua.jpeg")
                }
              >
                <img
                  src="/src/assets/images/img_prestasi_dua.jpeg"
                  alt="Prestasi Dua"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() =>
                  openImage("/src/assets/images/img_prestasi_tiga.jpeg")
                }
              >
                <img
                  src="/src/assets/images/img_prestasi_tiga.jpeg"
                  alt="Prestasi Tiga"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm transition-all"
          onClick={closeImage}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
              onClick={closeImage}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/10"
            />
          </div>
        </div>
      )}
    </section>
  );
}
