import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/toas";
import { GalleryCardSkeleton } from "../ui/Skeleton";
import ImageLightbox from "../ui/ImageLightbox";
import VideoLightbox from "../ui/VideoLightbox";
import SocialMediaLightbox from "../ui/SocialMediaLightbox";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  fetchTiktokThumbnail,
  getSocialEmbedHtml,
  getSocialFallbackThumbnail,
  getSocialStaticFallbackCover,
  type SocialMediaSource,
} from "../utils/socialMedia";

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

interface SocialMediaPost {
  id: string;
  source: SocialMediaSource;
  post_url: string;
  embed_code: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  display_order: number;
  is_active: boolean;
}

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | VideoItem | null>(null);
  const [selectedSocialPost, setSelectedSocialPost] = useState<SocialMediaPost | null>(null);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const [socialThumbnails, setSocialThumbnails] = useState<Record<string, string>>({});
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
    fetchSocialPosts();
  }, []);

  useEffect(() => {
    socialPosts
      .filter((post) => post.source === "tiktok" && !getSocialFallbackThumbnail(post) && !socialThumbnails[post.id])
      .forEach((post) => {
        fetchTiktokThumbnail(post.post_url).then((thumbnail) => {
          if (!thumbnail) return;
          setSocialThumbnails((prev) => ({ ...prev, [post.id]: thumbnail }));
        });
      });
  }, [socialPosts, socialThumbnails]);

  const fetchSocialPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("social_media_posts")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error) {
        setSocialPosts(data || []);
      }
    } catch (err) {
      console.warn("Failed to fetch social media posts:", err);
    }
  };

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
  const galleryPreviewItems = [
    ...displayedPhotos.map((photo) => ({ type: "photo" as const, item: photo })),
    ...socialPosts.map((post) => ({ type: "social" as const, item: post })),
  ];

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

        {!loading && photos.length === 0 && videos.length === 0 && socialPosts.length === 0 && (
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

        {!loading && (photos.length > 0 || videos.length > 0 || socialPosts.length > 0) && (
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

            {galleryPreviewItems.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4"
              >
                {galleryPreviewItems.map((galleryItem) => {
                  if (galleryItem.type === "photo") {
                    const photo = galleryItem.item;

                    return (
                      <motion.div
                        key={`photo-${photo.id}`}
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
                    );
                  }

                  const post = galleryItem.item;
                  const originalThumbnail =
                    getSocialFallbackThumbnail(post) || socialThumbnails[post.id];
                  const fallbackCover = getSocialStaticFallbackCover(post);
                  const thumbnailSrc = originalThumbnail || fallbackCover;

                  return (
                    <motion.div
                      key={`social-${post.id}`}
                      variants={itemVariants}
                      className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white"
                      onClick={() => setSelectedSocialPost(post)}
                    >
                      <div className="relative h-64 bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
                        {thumbnailSrc ? (
                          <img
                            src={thumbnailSrc}
                            alt={post.caption || "Social media post"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              if (fallbackCover && e.currentTarget.src !== new URL(fallbackCover, window.location.origin).href) {
                                e.currentTarget.src = fallbackCover;
                                return;
                              }
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <div className={`${thumbnailSrc ? "hidden" : ""} absolute inset-0 flex items-center justify-center`}>
                          {post.source === "instagram" ? (
                            <svg className="h-16 w-16 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          ) : (
                            <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z"/>
                            </svg>
                          )}
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${post.source === "instagram" ? "bg-pink-500" : "bg-gray-800"}`}>
                            {post.source === "instagram" ? "Instagram" : "TikTok"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-900 flex items-center gap-2">
                            Lihat Postingan
                            <ExternalLink className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                      {post.caption && (
                        <div className="p-3">
                          <p className="text-gray-600 text-sm line-clamp-2">{post.caption}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {(photos.length > 4 || videos.length > 1 || socialPosts.length > 0) && (
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
      {selectedSocialPost && (
        <SocialMediaLightbox
          source={selectedSocialPost.source}
          embedHtml={getSocialEmbedHtml(selectedSocialPost)}
          caption={selectedSocialPost.caption || undefined}
          onClose={() => setSelectedSocialPost(null)}
        />
      )}
    </section>
  );
};

export default Gallery;
