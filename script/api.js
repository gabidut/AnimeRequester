/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */
import {Anime} from "./anime.js";

export class AnimeAPIWrapper {
    apiKey = '';
    isUsingDevAPI = false;

    constructor(apiKey, isUsingDevAPI = false) {
        this.apiKey = apiKey;
        this.isUsingDevAPI = !isUsingDevAPI;
    }

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
            throw new Error("Erreur de requête", error);
        }


    }
}



