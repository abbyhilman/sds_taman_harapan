import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatDescription } from "../utils/formatDescription";

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

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching news item:", error);
        setNewsItem(null);
      } else {
        setNewsItem(data);
      }
      setLoading(false);
    };

    fetchNewsItem();
  }, [id]);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-1/4 mb-6" />
          <div className="bg-gray-200 h-96 rounded-lg animate-pulse mb-6" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-full mb-2" />
          <div className="h-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
    );
  }

  if (!newsItem) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-orange-600 font-medium hover:text-orange-700"
          >
            Kembali
          </button>
          <div className="text-center text-gray-600">
            Berita tidak ditemukan
          </div>
        </div>
      </section>
    );
  }

  // Fungsi untuk merender deskripsi dengan format yang rapi
  const renderDescription = (description: string | null | undefined) => {
    const { intro, points, conclusion } = formatDescription(description);

    return (
      <>
        {intro && <p className="mb-4">{intro}</p>}

        {points && points.length > 0 && (
          <ul className="list-disc list-inside mb-4 space-y-2">
            {points.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {conclusion && (
          <p className="mt-4 text-gray-700 font-medium leading-relaxed">
            {conclusion}
          </p>
        )}
      </>
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-orange-600 font-medium hover:text-orange-700"
        >
          Kembali
        </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 overflow-hidden">
            <img
              src={
                newsItem.thumbnail_url ||
                "https://placehold.co/600x400?text=No+Image"
              }
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${newsItem.color} opacity-40`}
            ></div>
            <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 inline mr-1" />
              {newsItem.date}
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {newsItem.title}
            </h1>
            <div className="text-gray-600 leading-relaxed mb-6">
              {renderDescription(newsItem.content)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsDetail;
