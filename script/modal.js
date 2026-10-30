/***
 * (C) 2026 gabidut76
 * Modal for displaying anime details.
 */

export class AnimeModal {
    /** @type {HTMLElement|null} */
    backdrop = null;
    /** @type {HTMLElement|null} */
    container = null;
    /** @type {HTMLElement|null} */
    content = null;
    /** @type {HTMLButtonElement|null} */
    closeButton = null;
    /** @type {Object|null} */
    currentAnime = null;

    constructor() {
        this.init();
    }

    /**
     * Initialize modal elements in the DOM
     */
    init() {
        if (typeof document === "undefined") {
            return;
        }

        const existing = document.getElementById("anime-modal");
        if (existing) {
            this.backdrop = existing;
            this.container = existing.querySelector(".anime-modal-container");
            this.content = existing.querySelector(".anime-modal-content");
            this.closeButton = existing.querySelector(".anime-modal-close");
            this.bindEvents();
            return;
        }

        this.backdrop = document.createElement("div");
        this.backdrop.id = "anime-modal";
        this.backdrop.className = "anime-modal-backdrop";
        this.backdrop.setAttribute("role", "dialog");
        this.backdrop.setAttribute("aria-modal", "true");
        this.backdrop.setAttribute("aria-hidden", "true");

        this.container = document.createElement("div");
        this.container.className = "anime-modal-container";

        this.closeButton = document.createElement("button");
        this.closeButton.className = "anime-modal-close";
        this.closeButton.setAttribute("type", "button");
        this.closeButton.setAttribute("aria-label", "Fermer");
        this.closeButton.innerHTML = "&times;";

        this.content = document.createElement("div");
        this.content.className = "anime-modal-content";

        this.container.appendChild(this.closeButton);
        this.container.appendChild(this.content);
        this.backdrop.appendChild(this.container);
        document.body.appendChild(this.backdrop);

        this.bindEvents();
    }

    /**
     * Bind click and key events for closing the modal
     */
    bindEvents() {
        if (!this.closeButton || !this.backdrop) {
            return;
        }

        this.closeButton.addEventListener("click", () => this.close());

        this.backdrop.addEventListener("click", (event) => {
            if (event.target === this.backdrop) {
                this.close();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.isOpen()) {
                this.close();
            }
        });
    }

    /**
     * Check if the modal is currently open
     * @returns {boolean}
     */
    isOpen() {
        return this.backdrop ? this.backdrop.classList.contains("is-visible") : false;
    }

    /**
     * Open the modal and populate with anime details
     * @param {Object} anime
     */
    open(anime) {
        if (!this.backdrop || !this.content) {
            this.init();
        }

        this.currentAnime = anime;
        this.renderContent(anime);

        this.backdrop.classList.add("is-visible");
        this.backdrop.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        if (this.closeButton) {
            this.closeButton.focus();
        }
    }

    /**
     * Close the modal and cleanup
     */
    close() {
        if (!this.backdrop) {
            return;
        }

        this.backdrop.classList.remove("is-visible");
        this.backdrop.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        const iframe = this.content ? this.content.querySelector("iframe") : null;
        if (iframe) {
            iframe.src = "";
        }
    }

    /**
     * Render the detailed view of the anime
     * @param {Object} anime
     */
    renderContent(anime) {
        if (!this.content) {
            return;
        }
        this.content.innerHTML = "";

        const header = document.createElement("div");
        header.className = "anime-modal-header";

        if (anime.image) {
            const poster = document.createElement("img");
            poster.className = "anime-modal-poster";
            poster.src = anime.image;
            poster.alt = anime.title || "Affiche de l'anime";
            header.appendChild(poster);
        }

        const info = document.createElement("div");
        info.className = "anime-modal-info";

        const title = document.createElement("h2");
        title.className = "anime-modal-title";
        title.textContent = anime.title || "Titre inconnu";
        info.appendChild(title);

        const subTitles = [];
        if (anime.japaneseTitle) {
            subTitles.push(anime.japaneseTitle);
        }
        if (anime.englishTitle && anime.englishTitle !== anime.title) {
            subTitles.push(anime.englishTitle);
        }
        if (subTitles.length > 0) {
            const subTitleEl = document.createElement("p");
            subTitleEl.className = "anime-modal-subtitle";
            subTitleEl.textContent = subTitles.join(" • ");
            info.appendChild(subTitleEl);
        }

        const badges = document.createElement("div");
        badges.className = "anime-modal-badges";

        if (anime.score !== null && anime.score !== undefined) {
            const scoreBadge = document.createElement("span");
            scoreBadge.className = "anime-modal-badge score";
            scoreBadge.innerHTML = ` ${anime.score} / 10`;
            badges.appendChild(scoreBadge);
        }

        if (anime.hasRanking && anime.ranking) {
            const rankBadge = document.createElement("span");
            rankBadge.className = "anime-modal-badge rank";
            rankBadge.innerHTML = `#${anime.ranking}`;
            badges.appendChild(rankBadge);
        }

        if (anime.popularity) {
            const popBadge = document.createElement("span");
            popBadge.className = "anime-modal-badge";
            popBadge.textContent = `Pop. #${anime.popularity}`;
            badges.appendChild(popBadge);
        }

        if (anime.type) {
            const typeBadge = document.createElement("span");
            typeBadge.className = "anime-modal-badge";
            typeBadge.textContent = anime.type;
            badges.appendChild(typeBadge);
        }

        if (anime.status) {
            const statusBadge = document.createElement("span");
            statusBadge.className = "anime-modal-badge";
            statusBadge.textContent = anime.status;
            badges.appendChild(statusBadge);
        }

        if (anime.hasEpisode && anime.episodes) {
            const epBadge = document.createElement("span");
            epBadge.className = "anime-modal-badge";
            epBadge.textContent = `${anime.episodes} épisodes`;
            badges.appendChild(epBadge);
        }

        if (badges.children.length > 0) {
            info.appendChild(badges);
        }

        if (Array.isArray(anime.genres) && anime.genres.length > 0) {
            const genresContainer = document.createElement("div");
            genresContainer.className = "anime-modal-genres";
            anime.genres.forEach((genre) => {
                const tag = document.createElement("span");
                tag.className = "genre-tag";
                tag.textContent = genre;
                genresContainer.appendChild(tag);
            });
            info.appendChild(genresContainer);
        }

        const metaGrid = document.createElement("div");
        metaGrid.className = "anime-modal-meta-grid";

        if (anime.season || anime.year) {
            const seasonText = [anime.season, anime.year].filter(Boolean).join(" ");
            metaGrid.appendChild(this.createMetaItem("Saison / Année", seasonText));
        }

        if (anime.duration) {
            metaGrid.appendChild(this.createMetaItem("Durée", anime.duration));
        }

        if (Array.isArray(anime.studios) && anime.studios.length > 0) {
            metaGrid.appendChild(this.createMetaItem("Studio", anime.studios.join(", ")));
        }

        if (anime.rating) {
            metaGrid.appendChild(this.createMetaItem("Classification", anime.rating));
        }

        if (metaGrid.children.length > 0) {
            info.appendChild(metaGrid);
        }

        header.appendChild(info);
        this.content.appendChild(header);

        if (anime.synopsis) {
            const synopsisSection = document.createElement("div");
            synopsisSection.className = "anime-modal-synopsis";

            const synopsisHeading = document.createElement("h3");
            synopsisHeading.textContent = "Synopsis";
            synopsisSection.appendChild(synopsisHeading);

            const paragraphs = anime.synopsis.split("\n\n").filter((p) => p.trim() !== "");
            paragraphs.forEach((pText) => {
                const p = document.createElement("p");
                p.textContent = pText.trim();
                synopsisSection.appendChild(p);
            });

            this.content.appendChild(synopsisSection);
        }

        if (anime.trailer) {
            const trailerSection = document.createElement("div");
            trailerSection.className = "anime-modal-trailer";

            const trailerHeading = document.createElement("h3");
            trailerHeading.textContent = "Bande-annonce";
            trailerSection.appendChild(trailerHeading);

            let embedUrl = anime.trailer;
            embedUrl = embedUrl.replace("autoplay=1", "autoplay=0");
            if (!embedUrl.includes("autoplay=0")) {
                embedUrl += (embedUrl.includes("?") ? "&" : "?") + "autoplay=0";
            }

            const iframeWrapper = document.createElement("div");
            iframeWrapper.className = "anime-modal-video-wrapper";

            const iframe = document.createElement("iframe");
            iframe.src = embedUrl;
            iframe.title = `Bande-annonce de ${anime.title}`;
            iframe.setAttribute("allow", "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute("allowfullscreen", "true");

            iframeWrapper.appendChild(iframe);
            trailerSection.appendChild(iframeWrapper);
            this.content.appendChild(trailerSection);
        }

        if (anime.url) {
            const footer = document.createElement("div");
            footer.className = "anime-modal-footer";

            const malLink = document.createElement("a");
            malLink.className = "anime-modal-link-button";
            malLink.href = anime.url;
            malLink.target = "_blank";
            malLink.rel = "noopener noreferrer";
            malLink.textContent = "Voir sur MyAnimeList";

            footer.appendChild(malLink);
            this.content.appendChild(footer);
        }
    }

    /**
     * Helper to create a key-value meta item.
     * @param {string} label
     * @param {string} value
     * @returns {HTMLElement}
     */
    createMetaItem(label, value) {
        const item = document.createElement("div");
        item.className = "anime-modal-meta-item";

        const labelEl = document.createElement("span");
        labelEl.className = "meta-label";
        labelEl.textContent = label;

        const valueEl = document.createElement("span");
        valueEl.className = "meta-value";
        valueEl.textContent = value;

        item.appendChild(labelEl);
        item.appendChild(valueEl);
        return item;
    }
}

export const animeModal = new AnimeModal();
