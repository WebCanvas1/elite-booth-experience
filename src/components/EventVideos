import { PlayCircle } from "lucide-react";

type EventVideoItem = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  featured?: boolean;
};

function getYouTubeEmbedUrl(url: string) {
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;

  const match = url.match(regExp);
  const videoId = match && match[1].length === 11 ? match[1] : null;

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export function EventVideos({ videos }: { videos: EventVideoItem[] }) {
  if (!videos?.length) return null;

  const featured = videos.find((v) => v.featured) || videos[0];
  const others = videos.filter((v) => v.id !== featured.id);

  return (
    <section id="videos" className="py-20 bg-gradient-to-b from-background to-muted/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Event Highlights
          </p>

          <h2 className="font-display text-4xl md:text-6xl text-primary mt-3">
            Watch the Magic
          </h2>

          <p className="mt-4 text-muted-foreground">
            See real event moments, guest reactions and photobooth memories in action.
          </p>
        </div>

        <div className="mt-12 rounded-[2rem] overflow-hidden shadow-luxe border border-gold/20 bg-card">
          <div className="aspect-video bg-black">
            <iframe
              src={getYouTubeEmbedUrl(featured.youtubeUrl)}
              title={featured.title}
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-medium text-gold">
              <PlayCircle size={16} />
              Featured Video
            </div>

            <h3 className="font-display text-3xl text-primary mt-4">
              {featured.title}
            </h3>

            <p className="mt-2 text-muted-foreground">
              {featured.description}
            </p>
          </div>
        </div>

        {others.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {others.map((video) => (
              <article
                key={video.id}
                className="rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-luxe transition"
              >
                <div className="aspect-video bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(video.youtubeUrl)}
                    title={video.title}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-display text-2xl text-primary">
                    {video.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {video.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
