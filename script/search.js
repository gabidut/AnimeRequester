/***
 * (C) 2026 WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js";
import {CardFactory} from "./card.js";

export class Search {

    /** @type {AnimeAPIWrapper} */
    animeAPI;
    /** @type {HTMLElement} */
    resultZone;
    /** @type {CardFactory} */
    cardFactory;

    /**
     * 
     * @param {AnimeAPIWrapper} animeAPI
     * @param {HTMLElement} resultZone 
     */
    constructor(animeAPI, resultZone) {
        if (animeAPI == null) {
            throw new Error("No API key provided");
        }
        this.animeAPI = animeAPI;

        this.resultZone = resultZone;

        this.cardFactory = new CardFactory(animeAPI, resultZone);

    }
    
    /** 
     * @param {HTMLButtonElement} searchInput
     * @param {HTMLButtonElement} searchButton
    */
    initListeners(searchInput, searchButton) {
        searchButton.addEventListener("click", () => this.displayResults(searchInput.value));
    }


    async displayResults(searchValue) {
        (await this.animeAPI.getAnimeList(1, 10, searchValue)).data.forEach((anime) => {
            this.resultZone.appendChild(
                this.cardFactory.renderCard(anime)
            );
        });
    }

}
