import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase"; 
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/toas";
import { GalleryCardSkeleton } from "../ui/Skeleton";
import ImageLightbox from "../ui/ImageLightbox";
import VideoLightbox from "../ui/VideoLightbox";

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
  );
  const navigate = useNavigate();
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("order_position", { ascending: true });

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

  const generateVideoThumbnail = (video: VideoItem) => {
    const videoElement = document.createElement("video");
    videoElement.src = video.video_url;
    videoElement.crossOrigin = "anonymous";
    videoElement.muted = true;
    videoElement.playsInline = true;

    videoElement.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 180;
      const context = canvas.getContext("2d");

      if (context) {
        videoElement.currentTime = 0.1;
        videoElement.onseeked = () => {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/jpeg");
          setVideoThumbnails((prev) => ({
            ...prev,
            [video.id]: thumbnail,
          }));
          videoElement.remove();
        };
      }
    };

    videoElement.onerror = () => {
      videoElement.remove();
    };

    videoElement.load();
  };

  useEffect(() => {
    fetchPhotos();
    fetchVideos();
  }, []);

  const galleryItems = [...photos, ...videos];
  const displayedItems = galleryItems.slice(0, 4);

  return (
    <section className="py-12 bg-gray-50 min-h-screen" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Galeri Sekolah
        </h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <GalleryCardSkeleton />
            <GalleryCardSkeleton />
            <GalleryCardSkeleton />
            <GalleryCardSkeleton />
          </div>
        )}

        {!loading && galleryItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="https://placehold.co/600x400"
              alt="No data available"
              className="w-full max-w-md rounded-lg shadow-md mb-4"
              loading="lazy"
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
                      loading="lazy" // Mengaktifkan lazy loading gambar untuk meningkatkan PageSpeed LCP score
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
                      }
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
      </div>

      {selectedItem && "image_url" in selectedItem && (
        <ImageLightbox
          src={selectedItem.image_url}
          alt={selectedItem.caption || "Gallery"}
          caption={selectedItem.caption}
          onClose={() => setSelectedItem(null)}
        />
      )}
      {selectedItem && "video_url" in selectedItem && (
        <VideoLightbox
          src={selectedItem.video_url}
          title={selectedItem.title || "Video Galeri"}
          poster={videoThumbnails[selectedItem.id] || selectedItem.thumbnail_url}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};

export default Gallery;


