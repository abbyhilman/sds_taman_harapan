"use client";
import { useState, useEffect } from "react";
import { Trophy, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  image_url: string;
}

export default function Prestasi() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("year", { ascending: false });
      if (error) {
        console.error("❌ Error fetching achievements:", error);
      } else {
        setAchievements(data || []);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  const openImage = (src: string) => setSelectedImage(src);
  const closeImage = () => setSelectedImage(null);

  return (
    <section id="prestasi" className="relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/bg_tamhar.png"
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
              SDS Taman Harapan terus berkomitmen menumbuhkan semangat kompetisi
              sehat dan membangun karakter unggul melalui prestasi di berbagai
              bidang — akademik, olahraga, dan seni.
            </p>

            {/* Daftar Prestasi dari Supabase */}
            <div className="space-y-4">
              {loading ? (
                <>
                  <div className="h-5 bg-white/40 rounded w-2/3 animate-pulse" />
                  <div className="h-5 bg-white/40 rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-white/40 rounded w-3/4 animate-pulse" />
                </>
              ) : achievements.length > 0 ? (
                achievements.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <Star className="h-6 w-6 text-yellow-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-orange-300">
                        {item.title} ({item.year})
                      </h3>
                      <p className="text-white/90 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/80 text-sm italic">
                  Belum ada data prestasi yang tersedia.
                </p>
              )}
            </div>

            {/* Tombol "Lihat Semua Prestasi" */}
            {!loading && achievements.length > 4 && (
              <button
                onClick={() => navigate("/all-prestasi")}
                className="mt-6 inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-full shadow-md transition-colors duration-200"
              >
                Lihat Semua Prestasi →
              </button>
            )}
          </div>

          {/* Kanan - Gambar prestasi */}
          <div className="relative">
            <div
              className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() =>
                achievements[0]?.image_url && openImage(achievements[0].image_url)
              }
            >
              <img
                src={
                  achievements[0]?.image_url ||
                  "/images/img_prestasi_satu.jpeg"
                }
                alt={achievements[0]?.title || "Prestasi Utama"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gambar pendukung */}
            <div className="hidden sm:flex absolute -bottom-8 -left-8 space-x-6">
              {achievements.slice(1, 3).map((item) => (
                <div
                  key={item.id}
                  className="w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openImage(item.image_url)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Mobile view */}
            <div className="flex sm:hidden justify-center mt-6 space-x-4">
              {achievements.slice(1, 3).map((item) => (
                <div
                  key={item.id}
                  className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border-4 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openImage(item.image_url)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
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
