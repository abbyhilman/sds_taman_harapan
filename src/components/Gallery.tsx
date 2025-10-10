import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase"; 
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Untuk navigasi ke halaman semua gallery
import { toast } from "../ui/toas";
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

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | VideoItem | null>(
    null
  );
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>(
    {}
  ); // State untuk menyimpan thumbnail yang dihasilkan
  const navigate = useNavigate();
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("order_position", { ascending: true });

      console.log(data);

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    console.log("ini photo nya ====>" + photos);
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_videos")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) throw error;
      setVideos(data || []);
      // Generate thumbnails untuk video setelah data dimuat
      data?.forEach((video) => generateVideoThumbnail(video));
    } catch (error: any) {
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
  const displayedItems = galleryItems.slice(0, 4); // Tampilkan hanya 4 item

  return (
    <section className="py-12 bg-gray-50 min-h-screen" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Galeri Sekolah
        </h1>

        {loading && <NewsShimmer />}

        {!loading && galleryItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="https://placehold.co/600x400"
              alt="No data available"
              className="w-full max-w-md rounded-lg shadow-md mb-4"
            />
            <p className="text-gray-600 text-lg">
              Tidak ada foto atau video yang tersedia saat ini.
            </p>
          </div>
        )}

        {!loading && galleryItems.length > 0 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {displayedItems.map((item) =>
                "image_url" in item ? (
                  <div
                    key={item.id}
                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.caption || "Gallery photo"}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
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
                      ref={(el) => (videoRefs.current[item.id] = el)}
                      src={item.video_url}
                      poster={
                        videoThumbnails[item.id] || item.thumbnail_url
                      } // Gunakan thumbnail yang dihasilkan atau default
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
            {galleryItems.length > 4 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/all-gallery")}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                >
                  Lihat Semua Gallery
                </button>
              </div>
            )}
          </div>
        )}

        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
              {"image_url" in selectedItem ? (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.caption || "Gallery item"}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={selectedItem.video_url}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                  controls
                  autoPlay
                />
              )}
              {"caption" in selectedItem && selectedItem.caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {selectedItem.caption}
                </p>
              )}
              {"title" in selectedItem && selectedItem.title && (
                <p className="text-white text-center mt-4 text-lg">
                  {selectedItem.title}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;