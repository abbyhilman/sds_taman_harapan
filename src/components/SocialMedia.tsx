import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Instagram, Video, ExternalLink } from "lucide-react";
import NewsShimmer from "./NewsShimeer";
import SocialMediaLightbox from "../ui/SocialMediaLightbox";

interface SocialMediaPost {
  id: string;
  source: "instagram" | "tiktok";
  post_url: string;
  embed_code: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  display_order: number;
  is_active: boolean;
}

function getInstagramEmbedUrl(postUrl: string): string | null {
  const match = postUrl.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
  }
  return null;
}

function getInstagramThumbnailUrl(postUrl: string): string | null {
  const match = postUrl.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const shortcode = match[2];
    return `https://www.instagram.com/p/${shortcode}/media/?size=l`;
  }
  return null;
}

function getTiktokVideoId(postUrl: string): string | null {
  const match = postUrl.match(/\/(video|photo)\/(\d+)/);
  if (match) {
    return match[2];
  }
  return null;
}

function generateTiktokEmbedHtml(videoId: string, postUrl: string): string {
  return `<blockquote class="tiktok-embed" cite="${postUrl}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="TikTok Video" href="${postUrl}">TikTok Video</a> </section> </blockquote>`;
}

function generateInstagramEmbedHtml(postUrl: string): string {
  return `<blockquote class="instagram-media" data-instgrm-permalink="${postUrl}" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`;
}

function loadEmbedScripts(): Promise<void> {
  return new Promise((resolve) => {
    // Load TikTok embed script
    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const tiktokScript = document.createElement('script');
      tiktokScript.src = 'https://www.tiktok.com/embed.js';
      tiktokScript.async = true;
      tiktokScript.onload = () => {};
      tiktokScript.onerror = () => {};
      document.body.appendChild(tiktokScript);
    }
    
    // Load Instagram embed script
    if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
      const instagramScript = document.createElement('script');
      instagramScript.src = '//www.instagram.com/embed.js';
      instagramScript.async = true;
      document.body.appendChild(instagramScript);
    }
    
    resolve();
  });
}

export default function SocialMedia() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<SocialMediaPost | null>(null);

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
    loadEmbedScripts();
  }, []);

  if (posts.length === 0 && !loading) return null;

  const getEmbedHtml = (post: SocialMediaPost): string => {
    if (post.embed_code) return post.embed_code;
    
    if (post.source === "tiktok" && getTiktokVideoId(post.post_url)) {
      return generateTiktokEmbedHtml(getTiktokVideoId(post.post_url)!, post.post_url);
    }
    
    if (post.source === "instagram") {
      return generateInstagramEmbedHtml(post.post_url);
    }
    
    return '';
  };

  return (
    <>
      {loading ? (
        <NewsShimmer />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const instagramThumb = getInstagramThumbnailUrl(post.post_url);
            const thumbnailSrc = post.thumbnail_url || instagramThumb;
            
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
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`${thumbnailSrc ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
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
          embedHtml={getEmbedHtml(selectedPost)}
          caption={selectedPost.caption || undefined}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
