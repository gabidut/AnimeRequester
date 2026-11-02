/***
 * (C) 2026 AnimeRequester
 * https://github.com/gabidut/AnimeRequester
 */

import { CardFactory } from "./card.js";

export class Ranking {
    /** @type {AnimeAPIWrapper} */
    animeAPI;
    /** @type {HTMLElement} */
    resultZone;
    /** @type {HTMLSelectElement|null} */
    typeSelect;
    /** @type {HTMLSelectElement|null} */
    genreSelect;
    /** @type {HTMLSelectElement|null} */
    limitSelect;
    /** @type {HTMLButtonElement|null} */
    rankingButton;
    /** @type {CardFactory} */
    cardFactory;

    /**
     * @param {AnimeAPIWrapper} animeAPI
     * @param {HTMLElement} resultZone
     * @param {HTMLSelectElement|null} typeSelect
     * @param {HTMLSelectElement|null} genreSelect
     * @param {HTMLSelectElement|null} limitSelect
     * @param {HTMLButtonElement|null} rankingButton
     */
    constructor(animeAPI, resultZone, typeSelect, genreSelect, limitSelect, rankingButton) {
        if (!animeAPI) {
            throw new Error("No API provided");
        }
        this.animeAPI = animeAPI;
        this.resultZone = resultZone;
        this.typeSelect = typeSelect;
        this.genreSelect = genreSelect;
        this.limitSelect = limitSelect;
        this.rankingButton = rankingButton;
        this.cardFactory = new CardFactory(animeAPI, resultZone);
    }

    /**
     * Populate genres dropdown from the API
     */
    async loadGenres() {
        if (!this.genreSelect) {
            return;
        }

        try {
            const genres = await this.animeAPI.getGenres();
            this.genreSelect.innerHTML = "<option value=\"\">Tous les genres</option>";
            genres
                .filter((g) => g.id && g.genreName)
                .sort((a, b) => a.genreName.localeCompare(b.genreName))
                .forEach((genre) => {
                    const option = document.createElement("option");
                    option.value = genre.id.toString();
                    option.textContent = genre.genreName;
                    this.genreSelect.appendChild(option);
                });
        } catch (error) {
            console.error("Erreur lors du chargement des genres :", error);
        }
    }

    /**
     * Attach event listeners
     */
    initListeners() {
        if (this.rankingButton) {
            this.rankingButton.addEventListener("click", () => this.displayRanking());
        }

        if (this.typeSelect) {
            this.typeSelect.addEventListener("change", () => this.displayRanking());
        }

        if (this.genreSelect) {
            this.genreSelect.addEventListener("change", () => this.displayRanking());
        }

        if (this.limitSelect) {
            this.limitSelect.addEventListener("change", () => this.displayRanking());
        }
    }

    /**
     * Display ranked animes in resultZone
     */
    async displayRanking() {
        if (!this.resultZone) {
            return;
        }

        const rankingType = this.typeSelect ? this.typeSelect.value : "score";
        const genre = this.genreSelect && this.genreSelect.value ? this.genreSelect.value : null;
        const limit = this.limitSelect ? parseInt(this.limitSelect.value, 10) || 10 : 10;

        this.resultZone.innerHTML = `
            <h2>Résultats du classement</h2>
            <div class="loading">
                <div class="spinner"></div>
                <p>Chargement du classement...</p>
            </div>
        `;

        try {
            const response = await this.animeAPI.getRanking(rankingType, limit, genre);
            this.resultZone.innerHTML = "<h2>Résultats du classement</h2>";

            if (!response.data || response.data.length === 0) {
                const noResults = document.createElement("p");
                noResults.className = "card-description";
                noResults.style.gridColumn = "1 / -1";
                noResults.style.textAlign = "center";
                noResults.textContent = "Aucun anime trouvé pour ce classement.";
                this.resultZone.appendChild(noResults);
                return;
            }

            response.data.forEach((anime, index) => {
                const position = index + 1;
                let rankLabel;

                if (rankingType === "score") {
                    const scoreText = anime.score ? ` (★ ${anime.score})` : "";
                    rankLabel = `#${position}${scoreText}`;
                } else if (rankingType === "recent") {
                    const yearText = anime.year ? ` (${anime.year})` : "";
                    rankLabel = `#${position}${yearText}`;
                } else {
                    rankLabel = `#${position}`;
                }

                const card = this.cardFactory.renderCard(anime, rankLabel);
                this.resultZone.appendChild(card);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du classement :", error);
            this.resultZone.innerHTML = `
                <h2>Résultats du classement</h2>
                <p class="card-description" style="grid-column: 1 / -1; text-align: center; color: #ef4444;">
                    Une erreur est survenue lors du chargement du classement. Veuillez réessayer.
                </p>
            `;
        }
    }
}
