"use client";
import React, { useState, useRef } from "react";
import { Volume2, VolumeX, ExternalLink } from "lucide-react"; // Assuming you use lucide-react, or use SVGs below

export default function VideoCard() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleAudio = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent any parent clicks
    if (videoRef.current) {
      // React handles the muted attribute, but using ref ensures immediate DOM update
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const openLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    window.open(
      "https://www.tiktok.com/@yass.auto.pro/video/7578205342165765398",
      "_blank",
    );
  };

  return (
    <div className="relative hidden md:flex items-center justify-center">
      {/* Added 'group' class here to control hover state of children */}
      <div className="group relative rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-800 rotate-2 hover:rotate-0 transition-all duration-500 scale-75 hover:scale-[85%]">
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-auto object-cover aspect-[3/4]"
          autoPlay
          loop
          preload="auto"
          muted={isMuted} // Controlled by state
          playsInline
        >
          <source
            src="https://res.cloudinary.com/di1rwrzdc/video/upload/v1765132747/test_zikrgj.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* --- NEW: Button Overlay --- */}
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 bg-black/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleAudio}
            className="rounded-full bg-white/10 p-4 text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/20 backdrop-blur-md"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              // Volume X Icon (Muted)
              <VolumeX />
            ) : (
              // Volume 2 Icon (Unmuted)
              <Volume2 />
            )}
          </button>

          {/* Open Link Button */}
          <button
            onClick={openLink}
            className="rounded-full bg-white p-4 text-black hover:bg-zinc-200 hover:scale-110 transition-all shadow-lg"
            title="Open Link"
          >
            {/* External Link Icon */}
            <ExternalLink />
          </button>
        </div>

        {/* Existing Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black to-transparent p-6 pointer-events-none">
          <p className="text-white font-bold">Yassine</p>
          <p className="text-zinc-400 text-sm">Fondateur & Expert</p>
        </div>
      </div>
    </div>
  );
}
