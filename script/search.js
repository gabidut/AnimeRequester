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
    /** @type {string} */
    currentSearch = "";
    /** @type {number} */
    currentPage = 0;
    /** @type {boolean} */
    hasNextPage = false;
    /** @type {HTMLButtonElement|null} */
    loadMoreButton = null;
    /** @type {boolean} */
    isLoading = false;
    /** @type {number} */
    requestId = 0;

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
        const requestId = ++this.requestId;

        this.currentSearch = (searchValue ?? "").trim();
        this.currentPage = 1;
        this.hasNextPage = false;
        this.loadMoreButton = null;
        this.isLoading = true;

        this.resultZone.innerHTML = `
            <h2>Résultats</h2>
            <div class="loading">
                <div class="spinner"></div>
                <p>Chargement des résultats...</p>
            </div>
        `;

        try {
            const response = await this.animeAPI.getAnimeList(1, 10, this.currentSearch || null);
            if (requestId !== this.requestId) {
                return;
            }

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

            this.hasNextPage = Boolean(response.meta?.hasNextPage);
            this.updateLoadMoreButton();
        } catch (error) {
            if (requestId !== this.requestId) {
                return;
            }
            console.error("Erreur lors de la recherche :", error);
            this.resultZone.innerHTML = `
                <h2>Résultats</h2>
                <p class="error-message">
                    Une erreur est survenue lors de la recherche. Veuillez réessayer.
                </p>
            `;
        } finally {
            if (requestId === this.requestId) {
                this.isLoading = false;
            }
        }
    }

    /**
     * Load and append the next page of results.
     */
    async loadMore() {
        if (this.isLoading || !this.hasNextPage) {
            return;
        }

        const requestId = this.requestId;
        this.isLoading = true;
        this.setLoadMoreLoading(true);

        try {
            const nextPage = this.currentPage + 1;
            const response = await this.animeAPI.getAnimeList(nextPage, 10, this.currentSearch || null);
            if (requestId !== this.requestId) {
                return;
            }

            if (response.data && response.data.length > 0) {
                response.data.forEach((anime) => {
                    this.resultZone.appendChild(this.cardFactory.renderCard(anime));
                });
            }

            this.currentPage = nextPage;
            this.hasNextPage = Boolean(response.meta?.hasNextPage);
            this.setLoadMoreLoading(false);
            this.updateLoadMoreButton();
        } catch (error) {
            if (requestId !== this.requestId) {
                return;
            }
            console.error("Erreur lors du chargement des résultats suivants :", error);
            this.setLoadMoreLoading(false);
            this.appendError("Impossible de charger plus de résultats. Veuillez réessayer.");
        } finally {
            if (requestId === this.requestId) {
                this.isLoading = false;
            }
        }
    }

    /**
     * Add or remove the "Voir plus" button depending on the API pagination.
     */
    updateLoadMoreButton() {
        if (!this.hasNextPage) {
            if (this.loadMoreButton) {
                this.loadMoreButton.remove();
                this.loadMoreButton = null;
            }
            return;
        }

        if (!this.loadMoreButton) {
            this.loadMoreButton = document.createElement("button");
            this.loadMoreButton.type = "button";
            this.loadMoreButton.className = "load-more-button";
            this.loadMoreButton.textContent = "Voir plus";
            this.loadMoreButton.addEventListener("click", () => this.loadMore());
        }

        this.resultZone.appendChild(this.loadMoreButton);
    }

    /**
     * Update the "Voir plus" button while a request is running.
     * @param {boolean} loading
     */
    setLoadMoreLoading(loading) {
        if (!this.loadMoreButton) {
            return;
        }
        this.loadMoreButton.disabled = loading;
        this.loadMoreButton.textContent = loading ? "Chargement..." : "Voir plus";
    }

    /**
     * Display a non-blocking error without removing the current results.
     * @param {string} message
     */
    appendError(message) {
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent = message;
        this.resultZone.appendChild(errorMessage);

        if (this.loadMoreButton) {
            this.resultZone.appendChild(this.loadMoreButton);
        }
    }
}
