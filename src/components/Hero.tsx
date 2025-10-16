import { useState, useEffect } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase"; // Asumsi Anda telah menginisialisasi Supabase client

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
  title?: string; // Menambahkan title ke interface
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
          .in("title", ["background", "welcome"]) // Filter berdasarkan title
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

  console.log(photos);

  // Mengambil backgroundPhoto berdasarkan title "background"
  const backgroundPhoto = photos.find((photo) => photo.title === "background")?.image_url || "https://placehold.co/1920x1080";
  // Mengambil heroImage berdasarkan title "welcome"
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
    <section id="home" className="pt-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundPhoto}
          alt="Background"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-orange-100">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Warakas, Jakarta Utara</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              Membangun Generasi Cerdas, Berkarakter, dan Berakhlak Mulia
            </h1>

            <p className="text-lg text-white/95 leading-relaxed drop-shadow">
              Untuk masa depan Indonesia yang gemilang. SDS Taman Harapan berkomitmen memberikan pendidikan
              berkualitas dengan pendekatan holistik.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("about")}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/95 backdrop-blur-sm text-blue-700 font-semibold rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md"
              >
                Hubungi Kami
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm overflow-hidden shadow-2xl border-4 border-white/20">
              <img
                src={heroImage}
                alt="Siswa SDS Taman Harapan"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}