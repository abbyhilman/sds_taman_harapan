"use client";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

interface PhotoItem {
  image_url: string;
  title?: string;
}

interface PPDBSettings {
  google_form_url: string;
}

export default function PPDB() {
  const [backgroundImage, setBackgroundImage] = useState<string>("https://placehold.co/1920x1080");
  const [googleFormUrl, setGoogleFormUrl] = useState<string>("https://forms.gle/examplePPDBForm");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil background dari welcome_photos
        const { data: photoData, error: photoError } = await supabase
          .from("welcome_photos")
          .select("image_url")
          .eq("title", "background")
          .single();

        if (photoError) throw photoError;
        if (photoData?.image_url) setBackgroundImage(photoData.image_url);

        // Mengambil URL Google Form dari ppdb_settings
        const { data: ppdbData, error: ppdbError } = await supabase
          .from("ppdb_settings")
          .select("google_form_url")
          .single();

        if (ppdbError) throw ppdbError;
        if (ppdbData?.google_form_url) setGoogleFormUrl(ppdbData.google_form_url);
      } catch (error: any) {
        console.error("❌ Error fetching PPDB data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedirect = () => {
    window.open(googleFormUrl, "_blank");
  };

  return (
    <section id="ppdb" className="relative overflow-hidden py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Background PPDB"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-gray-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 animate-fadeIn">
          {/* Label */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-orange-100">
            <ArrowRight className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Pendaftaran Siswa Baru
            </span>
          </div>

          {/* Judul */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Wujudkan Masa Depan Cerah Anak Anda
          </h2>

          {/* Deskripsi */}
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed drop-shadow max-w-2xl mx-auto">
            Bergabunglah dengan SDS Taman Harapan untuk pendidikan berkualitas yang mengutamakan kecerdasan, karakter, dan akhlak mulia. Daftar sekarang untuk tahun ajaran baru!
          </p>

          {/* Tombol Pendaftaran */}
          <div className="mt-8">
            {loading ? (
              <div className="h-14 bg-white/40 rounded-full w-64 mx-auto animate-pulse" />
            ) : (
              <button
                onClick={handleRedirect}
                className="group inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animasi CSS */}
      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style> */}
    </section>
  );
}