/***
 * (C) 2026 AnimeRequester
 * https://github.com/gabidut/AnimeRequester
 */

import { CardFactory } from "./card.js";

export class AdvancedSearch {
    /** @type {AnimeAPIWrapper} */
    animeAPI;
    /** @type {HTMLFormElement} */
    form;
    /** @type {HTMLElement} */
    resultZone;
    /** @type {HTMLSelectElement|null} */
    genreSelect;
    /** @type {CardFactory} */
    cardFactory;

    /**
     * @param {AnimeAPIWrapper} animeAPI
     * @param {HTMLFormElement} form
     * @param {HTMLElement} resultZone
     */
    constructor(animeAPI, form, resultZone) {
        if (!animeAPI) {
            throw new Error("No API provided");
        }
        this.animeAPI = animeAPI;
        this.form = form;
        this.resultZone = resultZone;
        this.genreSelect = form.querySelector("#genre-select");
        this.cardFactory = new CardFactory(animeAPI, resultZone);
    }

    /**
     * Populate the genre dropdown from the API.
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
     * Attach event listeners to the advanced search form.
     */
    initListeners() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.displayResults();
        });

        this.form.addEventListener("reset", () => {
            this.resultZone.innerHTML = "";
        });
    }

    /**
     * Get the trimmed value of a form field by its id.
     * @param {string} id
     * @returns {string}
     */
    getValue(id) {
        const element = this.form.querySelector(`#${id}`);
        return element ? element.value.trim() : "";
    }

    /**
     * Get a numeric form field value, or null when empty/invalid.
     * @param {string} id
     * @returns {number|null}
     */
    getNumber(id) {
        const value = this.getValue(id);
        if (value === "") {
            return null;
        }
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    }

    /**
     * Validate the numeric ranges entered in the form.
     * @returns {string|null} An error message, or null when the filters are valid.
     */
    validateFilters() {
        const yearMin = this.getNumber("year-min");
        const yearMax = this.getNumber("year-max");
        if (yearMin !== null && yearMax !== null && yearMin > yearMax) {
            return "L'année minimale ne peut pas être supérieure à l'année maximale.";
        }

        const episodesMin = this.getNumber("episodes-min");
        const episodesMax = this.getNumber("episodes-max");
        if (episodesMin !== null && episodesMax !== null && episodesMin > episodesMax) {
            return "Le nombre minimum d'épisodes ne peut pas être supérieur au nombre maximum.";
        }

        return null;
    }

    /**
     * Display an error message in the result zone.
     * @param {string} message
     */
    showError(message) {
        this.resultZone.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.className = "error-message";
        errorMessage.textContent = message;
        this.resultZone.appendChild(errorMessage);
    }

    /**
     * Read the form and build the API parameters.
     * @returns {{search: string|null, genre: string|null, limit: number, filters: Object, orderBy: string|null, sort: string|null}}
     */
    collectFilters() {
        const search = this.getValue("search-input") || null;
        const genre = this.getValue("genre-select") || null;
        const type = this.getValue("type-select") || null;
        const status = this.getValue("status-select") || null;
        const yearMin = this.getNumber("year-min");
        const yearMax = this.getNumber("year-max");
        const scoreMin = this.getNumber("score-min");
        const episodesMin = this.getNumber("episodes-min");
        const episodesMax = this.getNumber("episodes-max");
        const limit = parseInt(this.getValue("results-limit"), 10) || 10;

        const filters = {};
        if (type) {
            filters.type = type;
        }
        if (status) {
            filters.status = status;
        }
        if (yearMin !== null) {
            filters.startDate = `${yearMin}-01-01`;
        }
        if (yearMax !== null) {
            filters.endDate = `${yearMax}-12-31`;
        }
        if (scoreMin !== null) {
            filters.minScore = scoreMin;
        }
        if (episodesMin !== null) {
            filters.minEpisodes = episodesMin;
        }
        if (episodesMax !== null) {
            filters.maxEpisodes = episodesMax;
        }

        const sortingMap = {
            "title-asc": { orderBy: "title", sort: "asc" },
            "title-desc": { orderBy: "title", sort: "desc" },
            "score-desc": { orderBy: "score", sort: "desc" },
            "score-asc": { orderBy: "score", sort: "asc" },
            "year-desc": { orderBy: "start_date", sort: "desc" },
            "year-asc": { orderBy: "start_date", sort: "asc" },
            "episodes-desc": { orderBy: "episodes", sort: "desc" },
            "episodes-asc": { orderBy: "episodes", sort: "asc" },
        };
        const sorting = sortingMap[this.getValue("sort-select")] ?? { orderBy: null, sort: null };

        return {
            search,
            genre,
            limit,
            filters,
            orderBy: sorting.orderBy,
            sort: sorting.sort,
        };
    }

    /**
     * Display the results for the current filters.
     */
    async displayResults() {
        if (!this.resultZone) {
            return;
        }

        const validationError = this.validateFilters();
        if (validationError) {
            this.showError(validationError);
            return;
        }

        const { search, genre, limit, filters, orderBy, sort } = this.collectFilters();

        this.resultZone.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Chargement des résultats...</p>
            </div>
        `;

        try {
            const response = await this.animeAPI.getAnimeList(
                1,
                limit,
                search,
                genre,
                orderBy,
                sort,
                filters
            );

            this.resultZone.innerHTML = "";

            if (!response.data || response.data.length === 0) {
                const noResults = document.createElement("p");
                noResults.className = "no-results";
                noResults.textContent = "Aucun anime ne correspond à ces critères.";
                this.resultZone.appendChild(noResults);
                return;
            }

            response.data.forEach((anime) => {
                this.resultZone.appendChild(this.cardFactory.renderCard(anime));
            });
        } catch (error) {
            console.error("Erreur lors de la recherche avancée :", error);
            this.showError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
        }
    }
}
