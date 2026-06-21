import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Instagram, Video, X } from "lucide-react";
import NewsShimmer from "./NewsShimeer";

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

function getTiktokEmbedUrl(postUrl: string): string | null {
  const match = postUrl.match(/\/video\/(\d+)/);
  if (match) {
    return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  return null;
}

export default function SocialMedia() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<SocialMediaPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("social_media_posts")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching social media posts:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (posts.length === 0 && !loading) return null;

  return (
    <section id="social-media" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Galeri Sekolah
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ikuti kegiatan dan momen seru di SDS Taman Harapan melalui Instagram
            dan TikTok kami.
          </p>
        </div>

        {loading ? (
          <NewsShimmer />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative h-64 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                  {post.source === "instagram" ? (
                    <Instagram className="h-20 w-20 text-pink-300 group-hover:text-pink-400 transition-colors" />
                  ) : (
                    <Video className="h-20 w-20 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  )}
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
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-900">
                      Lihat Postingan
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {post.caption && (
                    <p className="text-gray-600 line-clamp-2">{post.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Embed Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                {selectedPost.source === "instagram" ? (
                  <Instagram className="h-5 w-5 text-pink-500" />
                ) : (
                  <Video className="h-5 w-5 text-gray-700" />
                )}
                <span className="font-medium">
                  {selectedPost.source === "instagram" ? "Instagram" : "TikTok"}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedPost.embed_code ? (
                <div
                  className="flex justify-center"
                  dangerouslySetInnerHTML={{ __html: selectedPost.embed_code }}
                />
              ) : selectedPost.source === "instagram" && getInstagramEmbedUrl(selectedPost.post_url) ? (
                <iframe
                  src={getInstagramEmbedUrl(selectedPost.post_url)!}
                  width="100%"
                  height="480"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded-xl"
                  title="Instagram embed"
                />
              ) : selectedPost.source === "tiktok" && getTiktokEmbedUrl(selectedPost.post_url) ? (
                <iframe
                  src={getTiktokEmbedUrl(selectedPost.post_url)!}
                  width="100%"
                  height="580"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-xl"
                  title="TikTok embed"
                />
              ) : (
                <div className="text-center py-8">
                  <a
                    href={selectedPost.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow"
                  >
                    Lihat di {selectedPost.source === "instagram" ? "Instagram" : "TikTok"}
                  </a>
                </div>
              )}
              {selectedPost.caption && (
                <p className="mt-4 text-gray-700 text-sm">{selectedPost.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
