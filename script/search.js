/***
 * (C) 2026 WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import { AnimeAPIWrapper } from "./api";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultZone = document.getElementById("result-zone");


export class Search {

    animeAPI;

    /**
     * 
     * @param {AnimeAPIWrapper} animeAPI 
     */
    constructor(animeAPI) {
        if (animeAPI == null) {
            throw new Error("No API key provided");
        }
        this.animeAPI = animeAPI;

        searchButton.addEventListener("click", this.getResults)
    }

    async getResults() {
        const p = document.createElement("p");
        p.innerHTML = "test";
        resultZone.appendChild(p);
        //let result = await this.animeAPI.getAnimeList();
        //return result;
    }

}
