import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "../ui/toas";
import ImageLightbox from "../ui/ImageLightbox";
import VideoLightbox from "../ui/VideoLightbox";
import SocialMediaLightbox from "../ui/SocialMediaLightbox";
import NewsShimmer from "./NewsShimeer";
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
  created_at?: string;
}

type GalleryItem =
  | { type: "photo"; id: string; order: number; createdAt: string; item: PhotoItem }
  | { type: "video"; id: string; order: number; createdAt: string; item: VideoItem }
  | { type: "social"; id: string; order: number; createdAt: string; item: SocialMediaPost };

const AllGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | VideoItem | null>(null);
  const [selectedSocialPost, setSelectedSocialPost] = useState<SocialMediaPost | null>(null);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const [socialThumbnails, setSocialThumbnails] = useState<Record<string, string>>({});

  const getVideoThumbnail = (video: VideoItem) => {
    return video.thumbnail_url || videoThumbnails[video.id] || undefined;
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
          setVideoThumbnails((prev) => ({
            ...prev,
            [video.id]: canvas.toDataURL("image/jpeg"),
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
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const [photosResult, videosResult, socialResult] = await Promise.all([
          supabase.from("gallery_photos").select("*").order("order_position", { ascending: true }),
          supabase.from("gallery_videos").select("*").order("order_position", { ascending: true }),
          supabase
            .from("social_media_posts")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true }),
        ]);

        if (photosResult.error) throw photosResult.error;
        if (videosResult.error) throw videosResult.error;

        setPhotos(photosResult.data || []);
        setVideos(videosResult.data || []);
        setSocialPosts(socialResult.error ? [] : socialResult.data || []);
        videosResult.data?.forEach((video) => generateVideoThumbnail(video));
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

    fetchGallery();
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

  const galleryItems: GalleryItem[] = [
    ...photos.map((photo) => ({
      type: "photo" as const,
      id: photo.id,
      order: photo.order_position,
      createdAt: photo.created_at,
      item: photo,
    })),
    ...videos.map((video) => ({
      type: "video" as const,
      id: video.id,
      order: video.order_position,
      createdAt: video.created_at,
      item: video,
    })),
    ...socialPosts.map((post) => ({
      type: "social" as const,
      id: post.id,
      order: post.display_order,
      createdAt: post.created_at || "",
      item: post,
    })),
  ].sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="pt-28 pb-16 relative min-h-screen overflow-hidden">
      <img
        src="/images/bg_tamhar.png"
        alt="Background"
        className="w-full h-full object-cover opacity-90 absolute top-0 left-0 z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-left pl-4">
          Semua Galeri
        </h2>
        <div className="flex items-center mb-8 pl-4">
          <span className="text-2xl font-semibold text-white mr-2">*</span>
          <span className="w-16 h-1 bg-orange-500 rounded-full"></span>
        </div>

        {loading && <NewsShimmer />}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((galleryItem) => {
              if (galleryItem.type === "photo") {
                const photo = galleryItem.item;

                return (
                  <div
                    key={`photo-${photo.id}`}
                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white"
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
                  </div>
                );
              }

              if (galleryItem.type === "video") {
                const video = galleryItem.item;

                return (
                  <div
                    key={`video-${video.id}`}
                    className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white"
                    onClick={() => setSelectedItem(video)}
                  >
                    <video
                      src={video.video_url}
                      poster={getVideoThumbnail(video)}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
                    {video.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        {video.title}
                      </div>
                    )}
                  </div>
                );
              }

              const post = galleryItem.item;
              const originalThumbnail = getSocialFallbackThumbnail(post) || socialThumbnails[post.id];
              const fallbackCover = getSocialStaticFallbackCover(post);
              const thumbnailSrc = originalThumbnail || fallbackCover;

              return (
                <div
                  key={`social-${post.id}`}
                  className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white"
                  onClick={() => setSelectedSocialPost(post)}
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                    {thumbnailSrc ? (
                      <img
                        src={thumbnailSrc}
                        alt={post.caption || "Social media post"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          if (fallbackCover && event.currentTarget.src !== new URL(fallbackCover, window.location.origin).href) {
                            event.currentTarget.src = fallbackCover;
                            return;
                          }
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          post.source === "instagram" ? "bg-pink-500" : "bg-gray-800"
                        }`}
                      >
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
                </div>
              );
            })}
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

export default AllGallery;
