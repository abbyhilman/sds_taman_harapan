import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Asumsi Anda telah menginisialisasi Supabase client
import { toast } from "../ui/toas";
import ImageLightbox from "../ui/ImageLightbox";
import VideoLightbox from "../ui/VideoLightbox";
import NewsShimmer from "./NewsShimeer";


interface PhotoItem {
  id: string;
  image_url: string;
  caption?: string;
  order_position: number;
  created_at: string;
  updated_at: string;
}

interface VideoItem {
  id: string;
  title?: string;
  description?: string;
  video_url: string;
  embed_url?: string;
  thumbnail_url: string;
  order_position: number;
  created_at: string;
  updated_at: string;
}

const AllGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | VideoItem | null>(
    null
  );
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>(
    {}
  );

  // Fungsi untuk mendapatkan thumbnail dari database
  const getVideoThumbnail = (video: VideoItem) => {
    return video.thumbnail_url || videoThumbnails[video.id] || undefined;
  };

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_videos")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) throw error;
      setVideos(data || []);
      data?.forEach((video) => generateVideoThumbnail(video));
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghasilkan thumbnail dari video_url
  const generateVideoThumbnail = (video: VideoItem) => {
    const videoElement = document.createElement("video");
    videoElement.src = video.video_url;
    videoElement.crossOrigin = "anonymous"; // Untuk mengatasi CORS jika diperlukan
    videoElement.muted = true;
    videoElement.playsInline = true;

    videoElement.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320; // Lebar thumbnail
      canvas.height = 180; // Tinggi thumbnail (aspect ratio 16:9)
      const context = canvas.getContext("2d");

      if (context) {
        videoElement.currentTime = 0.1; // Ambil frame awal (0.1 detik)
        videoElement.onseeked = () => {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/jpeg");
          setVideoThumbnails((prev) => ({
            ...prev,
            [video.id]: thumbnail,
          }));
          videoElement.remove(); // Bersihkan elemen setelah selesai
        };
      }
    };

    videoElement.onerror = () => {
      toast({
        title: "Error",
        description: `Gagal memuat thumbnail untuk video ${video.title}`,
        variant: "destructive",
      });
      videoElement.remove();
    };

    videoElement.load();
  };

  useEffect(() => {
    fetchPhotos();
    fetchVideos();
  }, []);

  const galleryItems = [...photos, ...videos];

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
          Semua Galeri
        </h2>
        <div className="flex items-center mb-8 pl-4">
          <span className="text-2xl font-semibold text-white mr-2">✨</span>
          <span className="w-16 h-1 bg-orange-500 rounded-full"></span>
        </div>

        {loading && <NewsShimmer />}

        {!loading && galleryItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="https://placehold.co/600x400"
              alt="No data available"
              className="w-full max-w-md rounded-lg shadow-md mb-4" loading="lazy"
            />
            <p className="text-gray-600 text-lg">
              Tidak ada foto atau video yang tersedia saat ini.
            </p>
          </div>
        )}

        {!loading && galleryItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) =>
              "image_url" in item ? (
                <div
                  key={item.id}
                  className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.image_url}
                    alt={item.caption || "Gallery photo"}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {item.caption}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  key={item.id}
                  className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <video
                    src={item.video_url}
                    poster={getVideoThumbnail(item)}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {item.title}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

      </div>

      {selectedItem && "image_url" in selectedItem && (
        <ImageLightbox
          src={selectedItem.image_url}
          alt={selectedItem.caption || "Galeri"}
          caption={selectedItem.caption}
          onClose={() => setSelectedItem(null)}
        />
      )}
      {selectedItem && "video_url" in selectedItem && (
        <VideoLightbox
          src={selectedItem.video_url}
          title={selectedItem.title || "Video Galeri"}
          poster={getVideoThumbnail(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}

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

export default AllGallery;


