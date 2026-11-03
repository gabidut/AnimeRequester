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
    /** @type {number} */
    currentPage = 1;
    /** @type {Object|null} */
    lastMeta = null;

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
            this.displayResults(1);
        });

        this.form.addEventListener("reset", () => {
            this.currentPage = 1;
            this.lastMeta = null;
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
        const limit = 100;

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
     * Display the results for the given page.
     * @param {number} [page=1]
     */
    async displayResults(page = 1) {
        if (!this.resultZone) {
            return;
        }

        const { search, genre, limit, filters, orderBy, sort } = this.collectFilters();
        this.currentPage = page;

        this.resultZone.innerHTML = `
            <h2>Résultats</h2>
            <div class="loading">
                <div class="spinner"></div>
                <p>Chargement des résultats...</p>
            </div>
        `;

        try {
            const response = await this.animeAPI.getAnimeList(
                page,
                limit,
                search,
                genre,
                orderBy,
                sort,
                filters
            );
            this.lastMeta = response.meta;

            this.resultZone.innerHTML = "<h2>Résultats</h2>";

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

            this.renderPagination();
        } catch (error) {
            console.error("Erreur lors de la recherche avancée :", error);
            this.resultZone.innerHTML = `
                <h2>Résultats</h2>
                <p class="error-message">
                    Une erreur est survenue lors de la recherche. Veuillez réessayer.
                </p>
            `;
        }
    }

    /**
     * Render previous/next pagination controls based on the last API metadata.
     */
    renderPagination() {
        const meta = this.lastMeta;
        if (!meta || !meta.totalPages || meta.totalPages <= 1) {
            return;
        }

        const pagination = document.createElement("div");
        pagination.className = "pagination";

        const previousButton = document.createElement("button");
        previousButton.type = "button";
        previousButton.textContent = "Précédent";
        previousButton.disabled = this.currentPage <= 1;
        previousButton.addEventListener("click", () => this.displayResults(this.currentPage - 1));

        const info = document.createElement("span");
        info.className = "pagination-info";
        info.textContent = `Page ${this.currentPage} / ${meta.totalPages}`;

        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.textContent = "Suivant";
        nextButton.disabled = this.currentPage >= meta.totalPages;
        nextButton.addEventListener("click", () => this.displayResults(this.currentPage + 1));

        pagination.appendChild(previousButton);
        pagination.appendChild(info);
        pagination.appendChild(nextButton);
        this.resultZone.appendChild(pagination);
    }
}
