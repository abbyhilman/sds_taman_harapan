"use client";
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  image_url: string;
}

export default function AllPrestasi() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("year", { ascending: false });
      if (!error && data) setAchievements(data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
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
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 text-white">
          <div className="inline-flex items-center bg-white/90 px-4 py-2 rounded-full shadow-sm border border-orange-100">
            <Trophy className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Semua Prestasi
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4">
            Daftar Prestasi Sekolah
          </h1>
          <p className="text-white/90 mt-2 max-w-2xl mx-auto">
            Jelajahi seluruh capaian dan kebanggaan siswa-siswi SDS Taman Harapan.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-white/20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:scale-[1.02] transition-transform"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 text-white">
                  <h3 className="font-semibold text-orange-300">{item.title}</h3>
                  <p className="text-sm text-white/90 mt-2 line-clamp-3">
                    {item.description}
                  </p>
                  <p className="text-xs text-white/70 mt-3">Tahun {item.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
