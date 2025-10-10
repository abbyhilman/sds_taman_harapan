import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  AirVent,
  Monitor,
  BookOpen,
  Dumbbell,
  Projector,
  Heart,
  Building2,
} from "lucide-react";
import NewsShimmer from "./NewsShimeer";

const iconMap: Record<number, any> = {
  0: AirVent,
  1: Monitor,
  2: BookOpen,
  3: Dumbbell,
  4: Projector,
  5: Heart,
  // Fallback ke Building2 jika indeks melebihi 5
};

export default function Facilities() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) {
        console.error("Error fetching facilities:", error);
      } else {
        setFacilities(data || []);
      }
      setLoading(false);
    };

    fetchFacilities();
  }, []);

  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Fasilitas Lengkap
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan fasilitas modern dan lengkap untuk mendukung proses
            pembelajaran yang optimal dan kenyamanan seluruh siswa.
          </p>
        </div>

        {loading ? (
          <NewsShimmer />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => {
              const Icon = iconMap[index % Object.keys(iconMap).length] || Building2;

              return (
                <div
                  key={facility.id || index}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        facility.image_url ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bagian bawah tidak diubah */}
        <div className="mt-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Lingkungan Belajar yang Nyaman dan Aman
            </h3>
            <p className="text-gray-700 leading-relaxed mb-8 text-sm sm:text-base">
              Semua fasilitas kami dirancang dan dirawat dengan baik untuk
              menciptakan lingkungan belajar yang kondusif, aman, dan
              menyenangkan bagi seluruh siswa.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-6 sm:space-y-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Terawat</div>
              </div>

              <div className="hidden sm:block h-12 w-px bg-gray-300"></div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">Aman</div>
                <div className="text-sm text-gray-600 mt-1">Terjamin</div>
              </div>

              <div className="hidden sm:block h-12 w-px bg-gray-300"></div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">Modern</div>
                <div className="text-sm text-gray-600 mt-1">Terkini</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}