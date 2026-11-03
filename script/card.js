/***
 * (C) 2026 gabidut76
 * https://github.com/gabidut/AnimeRequester
 */

import {animeModal} from "./modal.js";

export class CardFactory {

    /**
     * Render a card for the given anime.
     * @param {import("./anime.js").Anime} anime
     * @param {string|number|null} [rankDisplay=null]
     * @return {HTMLDivElement}
     */
    renderCard(anime, rankDisplay = null) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Voir les détails de ${anime.title}`);

        const title = document.createElement("h2");
        title.textContent = anime.title;
        card.appendChild(title);

        const image = document.createElement("img");
        image.src = anime.image;
        image.alt = anime.title || "Affiche de l'anime";
        card.appendChild(image);

        const synopsis = document.createElement("p");
        synopsis.textContent = anime.synopsis;
        card.appendChild(synopsis);

        const displayedRank = rankDisplay !== null && rankDisplay !== undefined
            ? (typeof rankDisplay === "number" ? `Ranking: #${rankDisplay}` : `${rankDisplay}`)
            : (anime.hasRanking && anime.ranking ? `Ranking: ${anime.ranking}` : null);

        if (displayedRank) {
            const ranking = document.createElement("p");
            ranking.textContent = displayedRank;
            card.appendChild(ranking);
        }

        card.addEventListener("click", () => {
            animeModal.open(anime);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                animeModal.open(anime);
            }
        });

        return card;
    }
}
