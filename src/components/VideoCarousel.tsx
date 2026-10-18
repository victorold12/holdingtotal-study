"use client";
import { useEffect, useRef, useState } from "react";
import { videos } from "@/generated/content";

export function VideoCarousel() {
  const container = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ width: 0, visible: 3 });
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState<number[]>([]);
  const max = videos.length - layout.visible;
  const goTo = (n: number) => setCurrent(Math.max(0, Math.min(n, max)));
  const touchX = useRef(0);
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const visible = innerWidth <= 640 ? 1 : innerWidth <= 1024 ? 2 : 3;
      setLayout({
        visible,
        width: (container.current?.offsetWidth || 0) / visible,
      });
      setCurrent((n) => Math.min(n, videos.length - visible));
    };
    // Literal source debounce: 150ms; slide width uses offsetWidth/visible.
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    };
    measure();
    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    let lockTimer: ReturnType<typeof setInterval>;
    let disposed = false;
    const lockSeek = () =>
      document.querySelectorAll(".voomly-embed").forEach((host) => {
        const root = host.shadowRoot;
        if (!root || root.querySelector("style[data-sem-seek]")) return;
        const style = document.createElement("style");
        style.dataset.semSeek = "";
        style.textContent =
          '[class*="progressBar_root"]{pointer-events:none!important}[class*="sliderHandle_root"],[class*="progressBar_handle"],[class*="progressBar_tipTime"]{display:none!important}';
        root.appendChild(style);
      });
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        // Real Voomly runtime, not a CSS imitation. Source lazy trigger: 200px.
        if (!document.querySelector("script[data-voomly-study]")) {
          const script = document.createElement("script");
          script.dataset.voomlyStudy = "";
          script.src = "https://embed.voomly.com/embed/embed-build.js";
          script.onload = () => {
            if (!disposed) lockSeek();
          };
          document.body.appendChild(script);
        }
        lockTimer = setInterval(lockSeek, 1000);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    const section = container.current?.closest(".video-section");
    if (section) observer.observe(section);
    return () => {
      disposed = true;
      observer.disconnect();
      clearInterval(lockTimer);
    };
  }, []);
  const arrow = (direction: "prev" | "next") => (
    <svg viewBox="0 0 24 24">
      <polyline
        points={direction === "prev" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
      />
    </svg>
  );
  return (
    <>
      <div
        className="video-carousel-outer"
        role="region"
        aria-label="Depoimentos em vídeo"
        aria-roledescription="carrossel"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") goTo(current + 1);
          if (event.key === "ArrowLeft") goTo(current - 1);
        }}
      >
        <button
          className="video-carousel-btn video-carousel-btn--prev"
          aria-label="Anterior"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
        >
          {arrow("prev")}
        </button>
        <div className="video-carousel-container" ref={container}>
          {/* Exact source: translateX in pixels, 450ms cubic-bezier(.16,1,.3,1)
            in CSS. Touch distance >40px moves one slide; no autoplay. */}
          <div
            className="video-carousel-track"
            style={{ transform: `translateX(-${layout.width * current}px)` }}
            onTouchStart={(event) => {
              touchX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              const distance = touchX.current - event.changedTouches[0].clientX;
              if (Math.abs(distance) > 40)
                goTo(distance > 0 ? current + 1 : current - 1);
            }}
          >
            {videos.map((video, index) => (
              <div
                className="video-slide"
                key={video.id}
                style={{ width: layout.width, flexBasis: layout.width }}
              >
                <div
                  className="video-slide-inner"
                  onClick={() =>
                    setPlaying((previous) =>
                      previous.includes(index)
                        ? previous
                        : [...previous, index],
                    )
                  }
                >
                  <div
                    className="voomly-embed"
                    data-id={video.id}
                    data-ratio={video.ratio}
                    data-shadow=""
                    data-skin-color={video.color}
                    data-type="v"
                    style={{
                      width: "100%",
                      aspectRatio: "0.5625/1",
                      borderRadius: "10px",
                    }}
                  />
                  <div
                    className="video-play-overlay"
                    aria-hidden="true"
                    style={
                      playing.includes(index)
                        ? {
                            opacity: 0,
                            visibility: "hidden",
                            transition:
                              "opacity 0.25s ease, visibility 0s 280ms",
                          }
                        : undefined
                    }
                  >
                    <div className="video-play-btn">
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="video-carousel-btn video-carousel-btn--next"
          aria-label="Próximo"
          disabled={current >= max}
          onClick={() => goTo(current + 1)}
        >
          {arrow("next")}
        </button>
      </div>
      <div
        className="video-carousel-dots"
        role="tablist"
        aria-label="Navegação do carrossel"
      >
        {Array.from({ length: max + 1 }, (_, index) => (
          <button
            role="tab"
            aria-selected={index === current}
            aria-label={`Slide ${index + 1}`}
            key={index}
            className={`video-carousel-dot${index === current ? " active" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </>
  );
}
