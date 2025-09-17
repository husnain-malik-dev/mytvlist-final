"use client";

import { useEffect, useCallback } from "react";
import { Movie } from "@/typings";
import MovieCard from "./MovieCard";
import { Switch } from "@/components/ui/switch";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import clsx from 'clsx';

interface MoviesCarouselProps {
  title?: string;
  movies: Movie[];
  isVertical?: boolean;
  onToggle?: () => void;
  isMovie?: boolean;
  showToggle?: boolean;
  className?: string;
}

function MoviesCarousel({
  title,
  movies,
  isVertical = false,
  onToggle,
  isMovie,
  showToggle = true,
  className,
}: MoviesCarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    // Optional: Add keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') scrollPrev();
      if (event.key === 'ArrowRight') scrollNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [embla, scrollPrev, scrollNext]);

  if (!movies?.length) {
    return null;
  }

  return (
    <section className={clsx("relative z-50 mt-10", className)}>
      <header className="flex justify-between items-center mb-4">
        {title && (
          <h2 className="text-xl font-bold text-white">{title}</h2>
        )}
        {showToggle && onToggle && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{isMovie ? "Movies" : "TV Shows"}</span>
            <Switch
              checked={!isMovie}
              onCheckedChange={onToggle}
              aria-label="Toggle between movies and TV shows"
            />
          </div>
        )}
      </header>

      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="embla__slide flex-shrink-0">
              <Link
                href={`/title/${movie.name ? 'tv' : 'movie'}/${(movie.name ?? movie.title)?.split(" ").join("_")}/${movie.id}`}
                className="block"
              >
                <MovieCard movie={movie} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MoviesCarousel;