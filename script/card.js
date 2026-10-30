/***
 * (C) 2026 gabidut76
 * https://github.com/gabidut/AnimeRequester
 */

import {Anime} from "./anime.js";
import {animeModal} from "./modal.js";

export class CardFactory {

    /**
     * Render a card for the given anime.
     * @param {Anime} anime
     * @return {HTMLDivElement}
     */
    renderCard(anime) {
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

        if (anime.hasRanking) {
            const ranking = document.createElement("p");
            ranking.textContent = `Ranking: ${anime.ranking}`;
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

export function dev() {
    const resultZone = document.getElementById("result-zone");
    const cardFactory = new CardFactory(resultZone);

    document.body.appendChild(cardFactory.renderCard(new Anime({
        title: "Naruto",
        image: "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
        synopsis: "Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village."
    })));
}
