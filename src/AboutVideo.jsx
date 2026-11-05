import { useEffect, useRef, useState } from "react";

export default function AboutVideo({ src }) {
  const frame = useRef(null);
  const video = useRef(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const loading = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: "250px" });
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    loading.observe(frame.current);
    visibility.observe(frame.current);
    return () => { loading.disconnect(); visibility.disconnect(); };
  }, []);

  useEffect(() => {
    const media = video.current;
    if (near && visible && !pausedByUser) media.play().catch(() => setPlaying(false));
    else media.pause();
  }, [near, visible, pausedByUser, src]);

  const togglePlayback = () => {
    const media = video.current;
    if (playing) { setPausedByUser(true); media.pause(); }
    else { setPausedByUser(false); media.play().catch(() => setPlaying(false)); }
  };

  return <div className="about-video-frame" ref={frame}>
    <video ref={video} src={near ? src : undefined} muted loop playsInline preload="metadata" aria-label="Eastern Western collection video" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button type="button" className="about-video-toggle" onClick={togglePlayback} aria-label={playing ? "Pause collection video" : "Play collection video"}><span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>{playing ? "Pause" : "Play"}</button>
  </div>;
}
