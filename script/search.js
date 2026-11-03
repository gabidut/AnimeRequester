/***
 * (C) 2026 WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

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
        if (!animeAPI) {
            throw new Error("No API provided");
        }
        this.animeAPI = animeAPI;

        this.resultZone = resultZone;

        this.cardFactory = new CardFactory(animeAPI, resultZone);

    }
    
    /** 
     * @param {HTMLInputElement} searchInput
     * @param {HTMLButtonElement} searchButton
    */
    initListeners(searchInput, searchButton) {
        searchButton.addEventListener("click", () => this.displayResults(searchInput.value));
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.displayResults(searchInput.value);
            }
        });
    }


    async displayResults(searchValue) {
        this.resultZone.innerHTML = `
            <h2>Résultats</h2>
            <div class="loading">
                <div class="spinner"></div>
                <p>Chargement des résultats...</p>
            </div>
        `;

        try {
            const response = await this.animeAPI.getAnimeList(1, 10, searchValue);
            this.resultZone.innerHTML = "<h2>Résultats</h2>";

            if (!response.data || response.data.length === 0) {
                const noResults = document.createElement("p");
                noResults.className = "no-results";
                noResults.textContent = "Aucun anime ne correspond à cette recherche.";
                this.resultZone.appendChild(noResults);
                return;
            }

            response.data.forEach((anime) => {
                this.resultZone.appendChild(this.cardFactory.renderCard(anime));
            });
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            this.resultZone.innerHTML = `
                <h2>Résultats</h2>
                <p class="error-message">
                    Une erreur est survenue lors de la recherche. Veuillez réessayer.
                </p>
            `;
        }
    }

}
