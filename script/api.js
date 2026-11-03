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
     * Fetch a URL and return its JSON payload.
     * @param {string} url
     * @returns {Promise<any>}
     * @throws {Error} If the request fails or the response is not valid JSON.
     */
    async fetchJson(url) {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * 
     * @param {number} page 
     * @param {number} limit 
     * @param {string|null} search 
     * @param {string|null} genre
     * @param {string|null} [orderBy=null]
     * @param {string|null} [sort=null]
     * @param {Object} [filters={}]
     * @param {string|null} [filters.type=null]
     * @param {string|null} [filters.status=null]
     * @param {number|null} [filters.minYear=null]
     * @param {number|null} [filters.maxYear=null]
     * @param {number|null} [filters.minScore=null]
     * @param {number|null} [filters.maxScore=null]
     * @param {number|null} [filters.minEpisodes=null]
     * @param {number|null} [filters.maxEpisodes=null]
     * @returns {Promise<{meta: {currentPage: number, totalPages: number, totalCount: number, hasNextPage: boolean}, data: Anime[]}>}
     */
    async getAnimeList(page = 1, limit = 10, search = null, genre = null, orderBy = null, sort = null, filters = {}) {
        const params = new URLSearchParams();
        if (search) {
            params.set("q", search);
        }
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        if (genre) {
            params.set("genres", genre.toString());
        }
        if (orderBy) {
            params.set("order_by", orderBy);
        }
        if (sort) {
            params.set("sort", sort);
        }
        if (filters.type) {
            params.set("type", filters.type);
        }
        if (filters.status) {
            params.set("status", filters.status);
        }
        if (filters.minYear !== null && filters.minYear !== undefined) {
            params.set("min_year", filters.minYear.toString());
        }
        if (filters.maxYear !== null && filters.maxYear !== undefined) {
            params.set("max_year", filters.maxYear.toString());
        }
        if (filters.minScore !== null && filters.minScore !== undefined) {
            params.set("min_score", filters.minScore.toString());
        }
        if (filters.maxScore !== null && filters.maxScore !== undefined) {
            params.set("max_score", filters.maxScore.toString());
        }
        if (filters.minEpisodes !== null && filters.minEpisodes !== undefined) {
            params.set("min_episodes", filters.minEpisodes.toString());
        }
        if (filters.maxEpisodes !== null && filters.maxEpisodes !== undefined) {
            params.set("max_episodes", filters.maxEpisodes.toString());
        }

        const queryString = params.toString();
        const url = `https://api.tenrai.org/v1/anime${queryString ? `?${queryString}` : ""}`;

        try {
            const result = await this.fetchJson(url);
            if (!result || !Array.isArray(result.data)) {
                throw new Error("Réponse de l'API invalide");
            }
            return {
                data: result.data.map((item) => {
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
            throw new Error("Erreur lors de la récupération des animes", { cause: error });
        }
    }

    /**
     * Get ranked anime list.
     * @param {string} [rankingType="score"]
     * @param {number} [limit=10]
     * @param {string|number|null} [genre=null]
     * @param {number} [page=1]
     * @returns {Promise<{meta: {currentPage: number, totalPages: number, totalCount: number, hasNextPage: boolean}, data: Anime[]}>}
     */
    async getRanking(rankingType = "score", limit = 10, genre = null, page = 1) {
        let orderBy;
        let sort;

        switch (rankingType) {
            case "score":
                orderBy = "score";
                sort = "desc";
                break;
            case "popularity":
                orderBy = "members";
                sort = "desc";
                break;
            case "recent":
                orderBy = "start_date";
                sort = "desc";
                break;
            case "title":
                orderBy = "title";
                sort = "asc";
                break;
            default:
                orderBy = "score";
                sort = "desc";
                break;
        }

        return this.getAnimeList(page, limit, null, genre, orderBy, sort);
    }

    /**
     * Function to get the list of genres from the API.
     * @return {Promise<AnimeGenre[]>}
     */
    async getGenres() {
        const url = "https://api.tenrai.org/v1/genres/anime";

        try {
            const result = await this.fetchJson(url);
            const genreList = Array.isArray(result) ? result : result?.data;
            if (!Array.isArray(genreList)) {
                throw new Error("Réponse de l'API invalide");
            }
            return genreList.map((item) => {
                return new AnimeGenre(item);
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des genres", { cause: error });
        }
    }

}
