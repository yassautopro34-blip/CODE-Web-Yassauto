"use client";

import React, { useEffect, useState, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, MessageCircle } from "lucide-react";

interface GoogleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

interface ReviewsData {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
  isDemo?: boolean;
}

export const GoogleReviews: React.FC = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = window.innerWidth < 640 ? 280 : 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  if (!data) {
    return (
      <section className="py-12 md:py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-800 rounded w-40 mx-auto mb-4"></div>
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-64 md:w-80 h-40 bg-zinc-800 rounded-2xl shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-brand-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-brand-red/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-yellow-500/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header compact */}
        <div className="flex items-start md:items-end justify-between mb-6 md:mb-10 gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <MessageCircle className="w-3 h-3" />
              +{data.totalReviews} avis
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              Ils m&apos;ont fait <span className="text-brand-red">confiance</span>
            </h2>
          </div>
          
          {/* Rating badge compact */}
          <div className="shrink-0 bg-zinc-900 border border-zinc-800 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
            <div className="text-2xl md:text-4xl font-black text-white">{data.rating.toFixed(1)}</div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      i < Math.round(data.rating)
                        ? "text-yellow-500 fill-current"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500">Google</p>
            </div>
          </div>
        </div>

        {/* Navigation - hidden on mobile, use swipe */}
        <div className="hidden md:flex justify-end gap-2 mb-4">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 bg-zinc-900 hover:bg-brand-red rounded-full flex items-center justify-center border border-zinc-800 hover:border-brand-red transition-all"
            aria-label="Avis précédents"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 bg-zinc-900 hover:bg-brand-red rounded-full flex items-center justify-center border border-zinc-800 hover:border-brand-red transition-all"
            aria-label="Avis suivants"
          >
            <ChevronRight className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        </div>

        {/* Cards carousel */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data.reviews.map((review, index) => (
            <div
              key={index}
              className="group w-[260px] md:w-80 lg:w-96 shrink-0 snap-start bg-zinc-900 p-4 md:p-5 rounded-2xl border border-zinc-800 hover:border-brand-red/30 transition-all relative overflow-hidden"
            >
              {/* Quote decoration */}
              <Quote className="absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12 text-zinc-800 group-hover:text-brand-red/20 transition-colors" />
              
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3 md:line-clamp-4 relative z-10">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-800">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.author_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{review.author_name}</p>
                  <p className="text-[10px] md:text-xs text-zinc-500">{review.relative_time_description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA Card */}
          <a
            href="https://maps.app.goo.gl/79vPS7FCQyuf3Pge6?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[260px] md:w-80 lg:w-96 shrink-0 snap-start bg-gradient-to-br from-brand-red to-red-700 p-4 md:p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <p className="text-white font-bold text-sm md:text-base mb-1">Voir tous les avis</p>
            <p className="text-white/60 text-xs">sur Google Maps</p>
            <div className="flex gap-0.5 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
          </a>
        </div>

        {/* Swipe hint mobile */}
        <p className="md:hidden text-center text-zinc-600 text-[10px] mt-3">
          ← Swipe pour voir plus →
        </p>

        {/* Demo notice */}
        {data.isDemo && (
          <p className="text-center text-zinc-600 text-[10px] mt-4">
            * Avis de démonstration
          </p>
        )}
      </div>
    </section>
  );
};
