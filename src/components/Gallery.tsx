import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/toas";
import { GalleryCardSkeleton } from "../ui/Skeleton";
import ImageLightbox from "../ui/ImageLightbox";
import VideoLightbox from "../ui/VideoLightbox";
import { motion, useInView } from "framer-motion";

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
  const [selectedItem, setSelectedItem] = useState<PhotoItem | VideoItem | null>(null);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  // Ref untuk video MPLS autoplay
  const mplsVideoRef = useRef<HTMLVideoElement>(null);
  const mplsContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(mplsContainerRef, { amount: 0.5 });

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

  // Autoplay video MPLS saat masuk viewport
  useEffect(() => {
    if (mplsVideoRef.current) {
      if (isInView) {
        mplsVideoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      } else {
        mplsVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  }, [isInView]);

  // Cari video MPLS berdasarkan title yang mengandung "MPLS"
  const mplsVideo = videos.find((v) => v.title?.toLowerCase().includes("mpls")) || videos[0];
  
  // Fungsi untuk mendapatkan thumbnail dari database
  const getVideoThumbnail = (video: VideoItem | undefined) => {
    if (!video) return undefined;
    return video.thumbnail_url || videoThumbnails[video.id] || undefined;
  };
  
  const displayedPhotos = photos.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Galeri Sekolah
        </motion.h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <GalleryCardSkeleton />
            <GalleryCardSkeleton />
            <GalleryCardSkeleton />
            <GalleryCardSkeleton />
          </div>
        )}

        {!loading && photos.length === 0 && videos.length === 0 && (
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

        {!loading && (photos.length > 0 || videos.length > 0) && (
          <div className="space-y-8">
            {/* Video MPLS Full Card */}
            {mplsVideo && (
              <motion.div
                ref={mplsContainerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="relative w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
                onClick={() => setSelectedItem(mplsVideo)}
              >
                <video
                  ref={mplsVideoRef}
                  src={mplsVideo.video_url}
                  poster={getVideoThumbnail(mplsVideo)}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-2">
                    Video MPLS
                  </span>
                  {mplsVideo.title && (
                    <h3 className="text-white text-xl md:text-2xl font-bold">
                      {mplsVideo.title}
                    </h3>
                  )}
                </div>
                {/* Play icon - hanya muncul saat video tidak playing */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-orange-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Foto Gallery Grid dengan Animasi */}
            {displayedPhotos.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4"
              >
                {displayedPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    variants={itemVariants}
                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                    onClick={() => setSelectedItem(photo)}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || "Gallery photo"}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        {photo.caption}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {(photos.length > 4 || videos.length > 1) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => navigate("/all-gallery")}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                >
                  Lihat Semua Gallery
                </button>
              </motion.div>
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
          poster={getVideoThumbnail(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};

export default Gallery;
