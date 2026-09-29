/***
 * (C) 2026 WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import { AnimeAPIWrapper } from "./api";

searchInput = document.getElementById("search-input");
resultZone = document.getElementById("result-zone");


export class Search {

    async getResults() {
        const animeAPI = new AnimeAPIWrapper();
        let result = await animeAPI.getAnimeList();
        return result;
    }

}
