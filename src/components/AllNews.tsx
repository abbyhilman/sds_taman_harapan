import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import NewsShimmer from "./NewsShimeer";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const news: NewsItem[] = [
  {
    title: "Masa Pengenalan Lingkungan Sekolah (MPLS)",
    date: "Juli 2024",
    category: "Kegiatan Sekolah",
    description:
      "Kegiatan MPLS untuk siswa baru tahun ajaran 2024/2025 berlangsung meriah. Siswa baru diperkenalkan dengan lingkungan sekolah, tata tertib, dan berbagai kegiatan positif untuk membangun semangat belajar.",
    image:
      "https://images.pexels.com/photos/8466664/pexels-photo-8466664.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: () => <></>,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "HUT Republik Indonesia Ke-80",
    date: "Agustus 2024",
    category: "Peringatan Nasional",
    description:
      "Perayaan HUT RI ke-80 di SDS Taman Harapan diisi dengan berbagai lomba, upacara bendera, dan kegiatan yang menumbuhkan semangat nasionalisme dan cinta tanah air kepada seluruh siswa.",
    image: "images/img_welcome_dua.png",
    icon: () => <></>,
    color: "from-red-500 to-red-600",
  },
  {
    title: "Peringatan Hari Guru Nasional",
    date: "November 2024",
    category: "Peringatan Nasional",
    description:
      "Kegiatan peringatan Hari Guru Nasional dengan berbagai penghargaan untuk guru berprestasi dan acara apresiasi di SDS Taman Harapan.",
    image:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: () => <></>,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Lomba Lari Estafet Antar Kelas",
    date: "September 2024",
    category: "Kegiatan Sekolah",
    description:
      "Lomba lari estafet antar kelas yang diikuti oleh siswa dengan semangat tinggi untuk memeriahkan hari olahraga sekolah.",
    image:
      "https://images.pexels.com/photos/416322/pexels-photo-416322.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: () => <></>,
    color: "from-green-500 to-green-600",
  },
];

const AllNews: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <NewsShimmer />;
  }

  return (
    <section className="pt-28 pb-16 relative min-h-screen overflow-hidden">
      {/* Background */}
      <img
        src="/images/bg_tamhar.png"
        alt="Background"
        className="w-full h-full object-cover opacity-90 absolute top-0 left-0 z-0"
      />


      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-left pl-4">
          Berita Terbaru
        </h2>
        <div className="flex items-center mb-8 pl-4">
          <span className="text-2xl font-semibold text-white mr-2">✨</span>
          <span className="w-16 h-1 bg-orange-500 rounded-full"></span>
        </div>

        <div className="flex flex-col md:flex-row justify-between w-full gap-6">
          {/* Left Side Image */}
          <div className="md:w-1/3 w-full flex justify-center md:justify-start animate-fade-in">
            <img
              src="/images/img_lapangan.jpeg"
              alt="Left Image"
              className="w-full h-auto rounded-lg border-4 border-orange-500 shadow-md"
            />
          </div>

          {/* News Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-2/3 w-full animate-fade-in">
            {news.map((item, index) => (
              <div
                key={index}
                className={`overflow-hidden transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg rounded-md ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {item.date}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <button
                    onClick={() => navigate(`/news/${index}`)}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700"
                  >
                    Baca Selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animasi sederhana */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default AllNews;
