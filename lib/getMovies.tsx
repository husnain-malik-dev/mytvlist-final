import { SearchResults, ShowDetails, ShowCredits, Movie } from "@/typings";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// if (!TMDB_API_KEY) {
//   throw new Error("TMDB_API_KEY is not defined in environment variables");
// }

interface TMDBOptions {
  cacheTime?: number;
  additionalParams?: Record<string, string>;
}

class TMDBClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async fetchFromTMDB(endpoint: string, options: TMDBOptions = {}): Promise<any> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Set API key as query parameter (TMDB v3 standard)
    url.searchParams.set("api_key", this.apiKey);

    // Set default params
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("include_video", "false");
    url.searchParams.set("sort_by", "popularity.desc");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", "1");

    // Set additional params
    if (options.additionalParams) {
      Object.entries(options.additionalParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const fetchOptions: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: options.cacheTime || 60 * 60 * 24 * 7, // 7 days default
      },
    };

    try {
      const response = await fetch(url.toString(), fetchOptions);

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
      throw error;
    }
  }

  async getDiscoverMovies(genreId?: string, keywords?: string): Promise<Movie[]> {
    const params: Record<string, string> = {};
    if (keywords) params.with_keywords = keywords;
    if (genreId) params.with_genres = genreId;

    const data = await this.fetchFromTMDB("/discover/movie", { additionalParams: params });
    return data.results as Movie[];
  }

  async searchMovies(term: string): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/search/movie", {
      additionalParams: { query: term },
      cacheTime: 60 * 60 * 24, // 1 day for search
    });
    return data.results as Movie[];
  }

  async searchMulti(term: string): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/search/multi", {
      additionalParams: { query: term },
      cacheTime: 60 * 60 * 24,
    });
    return data.results as Movie[];
  }

  async getUpcomingMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/movie/upcoming");
    return data.results as Movie[];
  }

  async getTrendingMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/trending/movie/week");
    return data.results as Movie[];
  }

  async getTopRatedMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/movie/top_rated");
    return data.results as Movie[];
  }

  async getPopularMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/movie/popular");
    return data.results as Movie[];
  }

  async getTrendingTv(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/trending/tv/week");
    return data.results as Movie[];
  }

  async getTopRatedTv(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/tv/top_rated", {
      additionalParams: { language: "en-US", page: "1" },
    });
    return data.results as Movie[];
  }

  async getPopularTv(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB("/tv/popular", {
      additionalParams: { language: "en-US", page: "1" },
    });
    return data.results as Movie[];
  }

  async getShowById(mediaType: string, externalId: string): Promise<ShowDetails> {
    const data = await this.fetchFromTMDB(`/${mediaType}/${externalId}`);
    return data as ShowDetails;
  }

  async getShowCredits(mediaType: string, externalId: string): Promise<ShowCredits> {
    const data = await this.fetchFromTMDB(`/${mediaType}/${externalId}/credits`);
    return data as ShowCredits;
  }

  async getSimilarShows(mediaType: string, externalId: string): Promise<SearchResults> {
    const data = await this.fetchFromTMDB(`/${mediaType}/${externalId}/similar`);
    return data as SearchResults;
  }

  async getRecommendations(mediaType: string, externalId: string): Promise<SearchResults> {
    const data = await this.fetchFromTMDB(`/${mediaType}/${externalId}/recommendations`);
    return data as SearchResults;
  }
}

const tmdbClient = new TMDBClient(TMDB_BASE_URL, TMDB_API_KEY);

// Export functions for backward compatibility
export const getDiscoverMovies = tmdbClient.getDiscoverMovies.bind(tmdbClient);
export const getSearchedMovies = tmdbClient.searchMovies.bind(tmdbClient);
export const getSearchedMulti = tmdbClient.searchMulti.bind(tmdbClient);
export const getUpcomingMovies = tmdbClient.getUpcomingMovies.bind(tmdbClient);
export const getTrendingMovies = tmdbClient.getTrendingMovies.bind(tmdbClient);
export const getTopRatedMovies = tmdbClient.getTopRatedMovies.bind(tmdbClient);
export const getPopularMovies = tmdbClient.getPopularMovies.bind(tmdbClient);
export const getTrendingTv = tmdbClient.getTrendingTv.bind(tmdbClient);
export const getTopRatedTv = tmdbClient.getTopRatedTv.bind(tmdbClient);
export const getPopularTv = tmdbClient.getPopularTv.bind(tmdbClient);
export const getShowById = tmdbClient.getShowById.bind(tmdbClient);
export const getShowCredits = tmdbClient.getShowCredits.bind(tmdbClient);
export const getSimilarShows = tmdbClient.getSimilarShows.bind(tmdbClient);
export const getRecommendations = tmdbClient.getRecommendations.bind(tmdbClient);
