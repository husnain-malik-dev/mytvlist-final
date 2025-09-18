import CarouselBannerWrapper from "@/components/CarouselBannerWrapper";
import MoviesCarouselClient from "@/components/MoviesCarouselClient";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingTv,
  getPopularTv,
  getTopRatedTv,
} from "@/lib/getMovies";

export default async function HomePage() {
  // Fetch all movie and TV data in parallel for better performance
  const [
    trendingMovies,
    topRatedMovies,
    popularMovies,
    trendingTv,
    popularTv,
    topRatedTv,
  ] = await Promise.all([
    getTrendingMovies(),
    getTopRatedMovies(),
    getPopularMovies(),
    getTrendingTv(),
    getPopularTv(),
    getTopRatedTv(),
  ]);

  return (
    <main className="min-h-screen">
      <CarouselBannerWrapper />

      <section className="relative z-10 md:-mt-48 pt-8 md:pt-0 px-4 md:px-8 lg:px-12">
        <MoviesCarouselClient
          trendingMovies={trendingMovies}
          topRatedMovies={topRatedMovies}
          popularMovies={popularMovies}
          trendingTv={trendingTv}
          topRatedTv={topRatedTv}
          popularTv={popularTv}
        />
      </section>
    </main>
  );
}