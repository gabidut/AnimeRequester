/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */
import {Anime, AnimeGenre} from "./anime.js";

export class AnimeAPIWrapper {

    /**
     * Map a raw API anime item to a simplified Anime object.
     * @param {Object} item
     * @returns {Anime}
     */
    mapToAnime(item) {
        return new Anime({
            id: item.mal_id,
            title: item.title,
            englishTitle: item.title_english ?? null,
            japaneseTitle: item.title_japanese ?? null,
            alternativeTitles: item.titles ? item.titles.map((t) => t.title) : (item.title_synonyms || []),
            genres: item.genres ? item.genres.map((g) => g.name) : [],
            image: item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || "",
            thumb: item.images?.webp?.small_image_url || item.images?.jpg?.small_image_url || "",
            synopsis: item.synopsis || "",
            ranking: item.rank ?? null,
            score: item.score ?? null,
            scoredBy: item.scored_by ?? null,
            popularity: item.popularity ?? null,
            episodes: item.episodes ?? null,
            status: item.status || "",
            type: item.type || "",
            season: item.season ?? null,
            year: item.year ?? null,
            duration: item.duration ?? null,
            rating: item.rating ?? null,
            trailer: item.trailer?.embed_url || item.trailer?.url || null,
            url: item.url || "",
            studios: item.studios ? item.studios.map((s) => s.name) : [],
            producers: item.producers ? item.producers.map((p) => p.name) : [],
            hasRanking: item.rank !== null && item.rank !== undefined,
            hasEpisode: item.episodes !== null && item.episodes !== undefined && item.episodes > 0,
        });
    }

    /**
     * 
     * @param {number} page 
     * @param {number} limit 
     * @param {string|null} search 
     * @param {string|null} genre
     * @returns {Promise<{meta: {currentPage: number, totalPages: number, totalCount: number, hasNextPage: boolean}, data: Anime[]}>}
     */
    async getAnimeList(page = 1, limit = 10, search = null, genre = null) {
        const params = new URLSearchParams();
        if (search) {
            params.set("q", search);
        }
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        if (genre) {
            params.set("genres", genre);
        }

        const queryString = params.toString();
        const url = `https://api.tenrai.org/v1/anime${queryString ? `?${queryString}` : ""}`;

        const options = {
            method: "GET",
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            return {
                data: (result.data || []).map((item) => {
                    return this.mapToAnime(item);
                }),
                meta: result.pagination ? {
                    currentPage: result.pagination.current_page,
                    totalPages: result.pagination.last_visible_page,
                    totalCount: result.pagination.items?.total ?? 0,
                    hasNextPage: result.pagination.has_next_page,
                } : result.meta,
            };
        } catch (error) {
            throw new Error("Request error", error);
        }
    }

    /**
     * Function to get the list of genres from the API.
     * @return {Promise<AnimeGenre[]>}
     */
    async getGenres() {
        const url = "https://api.tenrai.org/v1/genres/anime";
        const options = {
            method: "GET",
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const genreList = Array.isArray(result) ? result : (result?.data ?? []);
            return genreList.map((item) => {
                return new AnimeGenre(item);
            });
        } catch (error) {
            throw new Error("Request error", error);
        }
    }

    /**
     * Function to get an anime by its ID from the API.
     * @param {number|string} id
     * @throws {Error} If the anime is not found or if there is a request error.
     * @return {Promise<Anime>}
     */
    async getAnimeById(id) {
        const url = `https://api.tenrai.org/v1/anime/${id}`;
        const options = {
            method: "GET",
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const item = result?.data ?? result;
            if (!item || (Array.isArray(item) && item.length === 0)) {
                throw new Error("Anime not found");
            }
            return this.mapToAnime(item);
        } catch (error) {
            throw new Error("Request error", error);
        }
    }
}
