import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PPDB() {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "https://placehold.co/1920x1080"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: photoData, error: photoError } = await supabase
          .from("welcome_photos")
          .select("image_url")
          .eq("title", "background")
          .single();

        if (photoError) throw photoError;
        if (photoData?.image_url) setBackgroundImage(photoData.image_url);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching PPDB data:", message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section id="ppdb" className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Background PPDB"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-gray-900/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-6 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 rounded-full border border-orange-100 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
            <ArrowRight className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Pendaftaran Siswa Baru
            </span>
          </div>

          <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
            Wujudkan Masa Depan Cerah Anak Anda
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow sm:text-xl">
            Bergabunglah dengan SDS Taman Harapan untuk pendidikan berkualitas
            yang mengutamakan kecerdasan, karakter, dan akhlak mulia. Daftar
            sekarang untuk tahun ajaran baru!
          </p>

          <div className="mt-8">
            {loading ? (
              <div className="mx-auto h-14 w-64 animate-pulse rounded-full bg-white/40" />
            ) : (
              <button
                type="button"
                onClick={() => navigate("/ppdb")}
                className="group inline-flex items-center rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
