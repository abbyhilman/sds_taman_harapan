export type SocialMediaSource = "instagram" | "tiktok";

export interface SocialMediaPostLike {
  source: SocialMediaSource;
  post_url: string;
  embed_code?: string | null;
  thumbnail_url?: string | null;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

const TIKTOK_SCRIPT_SRC = "https://www.tiktok.com/embed.js";
const INSTAGRAM_SCRIPT_SRC = "https://www.instagram.com/embed.js";
const TIKTOK_FALLBACK_COVER = "/images/tiktok-school-cover.png";
const INSTAGRAM_FALLBACK_COVER = "/images/instagram-school-cover.png";

export function getInstagramShortcode(postUrl: string): string | null {
  const match = postUrl.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  return match?.[1] || null;
}

export function getInstagramThumbnailUrl(postUrl: string): string | null {
  const shortcode = getInstagramShortcode(postUrl);
  return shortcode ? `https://www.instagram.com/p/${shortcode}/media/?size=l` : null;
}

export function getTiktokVideoId(postUrl: string): string | null {
  const match = postUrl.match(/\/(?:video|photo)\/(\d+)/);
  return match?.[1] || null;
}

export function generateTiktokEmbedHtml(postUrl: string): string {
  const videoId = getTiktokVideoId(postUrl);
  const dataVideoId = videoId ? ` data-video-id="${videoId}"` : "";

  return `<blockquote class="tiktok-embed" cite="${postUrl}"${dataVideoId} style="max-width: 605px;min-width: 325px;"><section><a target="_blank" title="TikTok Post" href="${postUrl}">TikTok Post</a></section></blockquote>`;
}

export function generateInstagramEmbedHtml(postUrl: string): string {
  return `<blockquote class="instagram-media" data-instgrm-permalink="${postUrl}" data-instgrm-version="14" style="background:#FFF;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);margin:1px;max-width:540px;min-width:326px;padding:0;width:99.375%;width:-webkit-calc(100% - 2px);width:calc(100% - 2px);"></blockquote>`;
}

export function getSocialEmbedHtml(post: SocialMediaPostLike): string {
  if (post.embed_code) return post.embed_code;
  return post.source === "tiktok"
    ? generateTiktokEmbedHtml(post.post_url)
    : generateInstagramEmbedHtml(post.post_url);
}

function appendScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.loaded = "false";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export async function loadSocialEmbedScripts(): Promise<void> {
  await Promise.all([appendScript(TIKTOK_SCRIPT_SRC), appendScript(INSTAGRAM_SCRIPT_SRC)]);
}

export async function processSocialEmbeds(): Promise<void> {
  await loadSocialEmbedScripts();
  window.instgrm?.Embeds?.process();

  const tiktokScript = document.querySelector<HTMLScriptElement>(`script[src="${TIKTOK_SCRIPT_SRC}"]`);
  if (tiktokScript) {
    const clone = tiktokScript.cloneNode() as HTMLScriptElement;
    clone.async = true;
    tiktokScript.replaceWith(clone);
  }
}

export function getSocialFallbackThumbnail(post: SocialMediaPostLike): string | null {
  if (post.thumbnail_url) return post.thumbnail_url;
  return post.source === "instagram" ? getInstagramThumbnailUrl(post.post_url) : null;
}

export function getSocialStaticFallbackCover(post: SocialMediaPostLike): string | null {
  return post.source === "tiktok" ? TIKTOK_FALLBACK_COVER : INSTAGRAM_FALLBACK_COVER;
}

export async function fetchTiktokThumbnail(postUrl: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(postUrl)}`);
    if (!response.ok) return null;

    const data = (await response.json()) as { thumbnail_url?: string };
    return data.thumbnail_url || null;
  } catch {
    return null;
  }
}
