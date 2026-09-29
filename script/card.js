/***
 * (C) 2026 gabidut76
 * https://github.com/gabidut/AnimeRequester
*/

import {Anime} from "./anime.js";

export class CardFactory {

    /**
     * Render a card for the given anime.
     * @param {Anime} anime
     * @return {HTMLDivElement}
     */
    renderCard(anime) {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h2");
        title.textContent = anime.title;
        card.appendChild(title);

        const image = document.createElement("img");
        image.src = anime.image;
        card.appendChild(image);

        const synopsis = document.createElement("p");
        synopsis.textContent = anime.synopsis;
        card.appendChild(synopsis);

        return card;
    }
}