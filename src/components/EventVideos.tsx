import { useState } from "react";
import { Play, X } from "lucide-react";

type EventVideoItem = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
};

function getYouTubeId(url: string) {
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;

  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : "";
}

function isDirectVideo(url?: string) {
  return Boolean(url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url));
}

function getYouTubeThumbnail(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getYouTubeEmbedUrl(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : "";
}

function hasPlayableVideo(video: EventVideoItem) {
  return Boolean(isDirectVideo(video.videoUrl) || getYouTubeId(video.youtubeUrl));
}

function getThumbnail(video: EventVideoItem) {
  if (video.thumbnailUrl) return video.thumbnailUrl;

  if (getYouTubeId(video.youtubeUrl)) {
    return getYouTubeThumbnail(video.youtubeUrl);
  }

  return "";
}

export function EventVideos({ videos }: { videos: EventVideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<EventVideoItem | null>(null);

  const validVideos = videos.filter(hasPlayableVideo);

  if (!validVideos.length) return null;

  const featured = validVideos.find((v) => v.featured) || validVideos[0];
  const others = validVideos.filter((v) => v.id !== featured.id);

  const VideoCard = ({
    video,
    featuredCard = false,
  }: {
    video: EventVideoItem;
    featuredCard?: boolean;
  }) => {
    const thumbnail = getThumbnail(video);

    return (
      <button
        type="button"
        onClick={() => setActiveVideo(video)}
        className="group w-full text-left rounded-[2rem] overflow-hidden bg-card border border-border shadow-luxe hover:-translate-y-1 transition-transform duration-500"
      >
        <div className="relative aspect-video bg-black overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-black via-primary/70 to-black" />
          )}

          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-16 w-16 md:h-20 md:w-20 rounded-full gradient-gold text-ink flex items-center justify-center shadow-luxe group-hover:scale-110 transition-transform">
              <Play className="h-7 w-7 md:h-9 md:w-9 fill-current ml-1" />
            </span>
          </div>
        </div>

        <div className={featuredCard ? "p-6 md:p-8" : "p-5"}>
          {featuredCard && (
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-medium text-gold mb-4">
              <Play className="h-4 w-4 fill-current" />
              Featured Video
            </div>
          )}

          <h3
            className={
              featuredCard
                ? "font-display text-3xl text-primary"
                : "font-display text-2xl text-primary"
            }
          >
            {video.title}
          </h3>

          {video.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {video.description}
            </p>
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      <section
        id="videos"
        className="py-20 bg-gradient-to-b from-background to-muted/40"
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Event Highlights
            </p>

            <h2 className="font-display text-4xl md:text-6xl text-primary mt-3">
              Watch the Magic
            </h2>

            <p className="mt-4 text-muted-foreground">
              See real event moments, guest reactions and photobooth memories in
              action.
            </p>
          </div>

          <div className="mt-12">
            <VideoCard video={featured} featuredCard />
          </div>

          {others.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {others.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-luxe"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gold transition"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            {isDirectVideo(activeVideo.videoUrl) ? (
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
                poster={activeVideo.thumbnailUrl || undefined}
              />
            ) : (
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.youtubeUrl)}
                title={activeVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
