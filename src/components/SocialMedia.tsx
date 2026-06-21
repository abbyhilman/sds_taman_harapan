import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Instagram, Video, ExternalLink } from "lucide-react";
import NewsShimmer from "./NewsShimeer";
import SocialMediaLightbox from "../ui/SocialMediaLightbox";
import {
  fetchTiktokThumbnail,
  getSocialEmbedHtml,
  getSocialFallbackThumbnail,
  getSocialStaticFallbackCover,
  loadSocialEmbedScripts,
  type SocialMediaSource,
} from "../utils/socialMedia";

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

export default function SocialMedia() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<SocialMediaPost | null>(null);
  const [socialThumbnails, setSocialThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("social_media_posts")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.warn("Social media posts not available:", error.message);
          setPosts([]);
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.warn("Failed to fetch social media posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    loadSocialEmbedScripts();
  }, []);

  useEffect(() => {
    posts
      .filter((post) => post.source === "tiktok" && !getSocialFallbackThumbnail(post) && !socialThumbnails[post.id])
      .forEach((post) => {
        fetchTiktokThumbnail(post.post_url).then((thumbnail) => {
          if (!thumbnail) return;
          setSocialThumbnails((prev) => ({ ...prev, [post.id]: thumbnail }));
        });
      });
  }, [posts, socialThumbnails]);

  if (posts.length === 0 && !loading) return null;

  return (
    <>
      {loading ? (
        <NewsShimmer />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const originalThumbnail =
              getSocialFallbackThumbnail(post) || socialThumbnails[post.id];
            const fallbackCover = getSocialStaticFallbackCover(post);
            const thumbnailSrc =
              originalThumbnail ||
              fallbackCover;
            
            return (
              <div
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                onClick={() => setSelectedPost(post)}
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
                      <Instagram className="h-20 w-20 text-pink-300 group-hover:text-pink-400 transition-colors" />
                    ) : (
                      <Video className="h-20 w-20 text-gray-300 group-hover:text-gray-400 transition-colors" />
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        post.source === "instagram"
                          ? "bg-pink-500"
                          : "bg-gray-800"
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
                <div className="p-6">
                  {post.caption && (
                    <p className="text-gray-600 line-clamp-2">{post.caption}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Screen Lightbox */}
      {selectedPost && (
        <SocialMediaLightbox
          source={selectedPost.source}
          embedHtml={getSocialEmbedHtml(selectedPost)}
          caption={selectedPost.caption || undefined}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
