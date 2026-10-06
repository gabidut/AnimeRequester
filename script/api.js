/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */
import {Anime, AnimeGenre} from "./anime.js";

export class AnimeAPIWrapper {
    apiKey = '';
    isUsingDevAPI = false;

    constructor(apiKey, isUsingDevAPI = false) {
        this.apiKey = apiKey;
        this.isUsingDevAPI = !isUsingDevAPI;
    }

    /**
     * 
     * @param {*} page 
     * @param {*} limit 
     * @param {*} search 
     * @returns {{meta: {currentPage: number, totalPages: number, totalCount: number}, data: Anime[]}}
     */
    async getAnimeList(page = 1, limit = 10, search = null) {
        const params = new URLSearchParams();
        params.set('search', search);
        params.set('page', page);
        params.set('size', limit);


        const url = this.isUsingDevAPI ? 'https://anime-db.p.rapidapi.com/anime?' + params.toString() : 'https://gabidut76.fr/prout.php?' + params.toString();

        const options = {
            method: 'GET',
            headers: this.isUsingDevAPI ? {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            } : {}
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            return {
                data: result.data.map((item) => {
                    return new Anime(item);
                }),
                meta: result.meta,
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
        const url = this.isUsingDevAPI ? 'https://anime-db.p.rapidapi.com/genre' : 'https://duteurtre.eu/genres.json';
        const options = {
            method: 'GET',
            headers: this.isUsingDevAPI ? {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            } : {}
        };

        try {
            const response = await fetch(url, options);
            return (await response.json()).map((item) => {
                return new AnimeGenre(item);
            });
        } catch (error) {
            throw new Error("Request error", error);
        }
    }

    /**
     * Function to get an anime by its ID from the API.
     * @param id
     * @throws {Error} If the anime is not found or if there is a request error.
     * @return {Promise<Anime>}
     */
    async getAnimeById(id) {
        const url = this.isUsingDevAPI ? `https://anime-db.p.rapidapi.com/anime/by-id/{id}` : `https://gabidut76.fr/prout.php?id=${id}`;
        const options = {
            method: 'GET',
            headers: this.isUsingDevAPI ? {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            } : {}
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            if(!result || result.length === 0) {
                throw new Error("Anime not found");
            }
            return new Anime(result);
        } catch (error) {
            throw new Error("Request error", error);
        }
    }
}



