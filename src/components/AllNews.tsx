import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Flag } from "lucide-react";
import { supabase } from "../lib/supabase";
import NewsShimmer from "./NewsShimeer";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  thumbnail_url: string;
  icon: string;
  color: string;
}

const AllNews: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_date", { ascending: false });

      if (error) {
        console.error("❌ Error fetching news:", error);
      } else {
        setNews(data || []);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
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
              src="/images/img_school_news.png"
              alt="Left Image"
              className="w-full h-auto rounded-lg border-4 border-orange-500 shadow-md"
            />
          </div>

          {/* News Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:w-2/3 w-full animate-fade-in">
            {news.map((item) => {
              const Icon =
                item.icon === "Users"
                  ? Users
                  : item.icon === "Flag"
                  ? Flag
                  : Users;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-2xl rounded-xl bg-white"
                >
                  {/* ✅ Gambar lebih besar & lebih dominan */}
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={
                        item.thumbnail_url ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
                      <Calendar className="h-3.5 w-3.5 inline mr-1 text-orange-600" />
                      {item.date}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.content.substring(0, 120)}...
                    </p>
                    <button
                      onClick={() => navigate(`/news/${item.id}`)}
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animasi */}
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
