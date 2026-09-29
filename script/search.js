/***
 * (C) 2026 WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import { AnimeAPIWrapper } from "./api";
import {CardFactory} from "./card";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultZone = document.getElementById("result-zone");


export class Search {

    /** @type {AnimeAPIWrapper} */
    animeAPI;

    /** @type {CardFactory} */
    cardFactory;

    /**
     * 
     * @param {AnimeAPIWrapper} animeAPI 
     */
    constructor(animeAPI) {
        if (animeAPI == null) {
            throw new Error("No API key provided");
        }
        this.animeAPI = animeAPI;

        this.cardFactory = new CardFactory(animeAPI, document.getElementById("result-zone"));

        searchButton.addEventListener("click", this.getResults)
    }

    async getResults() {
        //TODO: this.cardFactory.renderCard(await this.animeAPI.getAnimeList(1, 10, searchInput.value));
    }

}
