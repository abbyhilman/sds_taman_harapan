import { Calendar, ArrowRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { NewsCardSkeleton } from "../ui/Skeleton";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string | null;
  published_date: string | null;
  author: string | null;
}

const formatDate = (value: string | null) => {
  if (!value) return "Tanggal belum tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("id,title,content,thumbnail_url,published_date,author")
        .order("published_date", { ascending: false })
        .limit(4);

      if (error) console.error("Error fetching news:", error.message);
      else setNews(data || []);
      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-orange-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Berita Terbaru</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ikuti perkembangan dan aktivitas terkini di SDS Taman Harapan.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm">
            Belum ada berita yang tersedia.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={item.thumbnail_url || "https://placehold.co/600x400?text=No+Image"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">{formatDate(item.published_date)}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                    <User className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">{item.author || "Admin"}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {(item.content || "").substring(0, 150)}...
                  </p>
                  <button
                    onClick={() => navigate(`/news/${item.id}`)}
                    className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/all-news")}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            Lihat Semua Berita
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}