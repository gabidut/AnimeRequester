/***
 * (C) 2026 WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

const searchInput = document.getElementById("search-input");
const resultZone = document.getElementById("result-zone");


export class Search {

    animeAPI;

    constructor(animeAPI) {
        if (animeAPI == null) {
            throw new Error("No API key provided");
        }
        this.animeAPI = animeAPI;
    }

    async getResults() {
        let result = await this.animeAPI.getAnimeList();
        return result;
    }

}
