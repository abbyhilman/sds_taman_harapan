import { useState, useEffect } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";

interface HeroProps {
  setActiveSection: (section: string) => void;
}

interface PhotoItem {
  id: string;
  image_url: string;
  caption?: string;
  order_position: number;
  created_at: string;
  updated_at: string;
  title?: string;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from("welcome_photos")
          .select("*")
          .in("title", ["background", "welcome"])
          .order("order_position", { ascending: true });

        if (error) throw error;
        setPhotos(data || []);
      } catch (error: any) {
        console.error("Error fetching photos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const backgroundPhoto = photos.find((photo) => photo.title === "background")?.image_url || "https://placehold.co/1920x1080";
  const heroImage = photos.find((photo) => photo.title === "welcome")?.image_url || "https://placehold.co/600x600";

  if (loading) {
    return (
      <section id="home" className="pt-20 relative min-h-screen">
        <div className="absolute inset-0 z-0 bg-gray-200 animate-pulse" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32" />
      </section>
    );
  }

  return (
    <section id="home" className="pt-20 relative overflow-hidden min-h-[90vh] flex items-center bg-white">
      {/* Gambar Background dengan Overlay Gradien gelap untuk menjamin Readability Text 100% */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundPhoto}
          alt="Background"
          className="w-full h-full object-cover scale-105 transition-transform duration-1000"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl space-y-8 rounded-[2rem] border border-white/20 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-[2px] sm:p-8">
            {/* Tag Lokasi dengan transisi micro-interaction */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-white/40 bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-500/40">
              <MapPin className="h-4 w-4 text-orange-400 animate-bounce" />
              <span className="text-sm font-semibold text-slate-800">Warakas, Jakarta Utara</span>
            </div>

            {/* Headline premium yang tebal dan kontras tinggi */}
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)] lg:text-5xl xl:text-6xl">
              Membangun Generasi <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Cerdas, Berkarakter,</span> dan Berakhlak Mulia
            </h1>

            {/* Paragraf penjelas */}
            <p className="max-w-xl text-lg font-medium leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              SDS Taman Harapan berkomitmen memberikan pendidikan berkualitas tinggi dengan pendekatan holistik untuk melahirkan pemimpin masa depan yang unggul.
            </p>

            {/* Tombol Call-to-Action dengan Palet Warna Konsisten (Oranye & Transparan Putih) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => scrollToSection("about")}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/20 shadow-orange-500/10 hover:-translate-y-0.5 active:translate-y-0 duration-300"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/85 px-8 py-4 font-semibold text-slate-800 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0"
              >
                Hubungi Kami
              </button>
            </div>
          </div>

          {/* Sisi Kanan: Gambar Utama dengan Border bersinar lembut */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-[450px] ml-auto rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/5 border-[6px] border-white/10 backdrop-blur-md">
              <img
                src={heroImage}
                alt="Siswa SDS Taman Harapan"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
            </div>
            {/* Aksen hiasan lingkaran bersinar di belakang gambar */}
            <div className="absolute -bottom-6 -left-6 -z-10 w-44 h-44 bg-orange-500/10 rounded-full filter blur-2xl" />
            <div className="absolute -top-6 -right-6 -z-10 w-44 h-44 bg-amber-500/10 rounded-full filter blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}


