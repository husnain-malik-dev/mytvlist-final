import getImagePath from "@/lib/getImagePath";
import { Movie } from "@/typings";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const title = movie.title || movie.name || "Untitled";
  const imageUrl = getImagePath(movie.poster_path || movie.backdrop_path);

  return (
    <article className="group relative flex-shrink-0 cursor-pointer transform transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
          {title}
        </h3>
        {movie.vote_average && (
          <div className="flex items-center mt-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-white text-xs ml-1">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      <Image
        className="w-full h-56 object-cover rounded-xl shadow-lg"
        src={imageUrl}
        alt={`${title} poster`}
        width={300}
        height={450}
        priority={false}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
    </article>
  );
}

export default MovieCard;