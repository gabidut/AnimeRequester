/***
 * (C) 2026 Hugo FAVEROULT, gabidut, WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import { AnimeAPIWrapper } from "./api.js";
import { Search } from "./search.js";
import { Ranking } from "./ranking.js";

const animeAPI = new AnimeAPIWrapper();

document.addEventListener("DOMContentLoaded", async () => {
    const resultZone = document.getElementById("result-zone");

    // Page Accueil : recherche rapide
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    if (searchInput && searchButton && resultZone) {
        const search = new Search(animeAPI, resultZone);
        search.initListeners(searchInput, searchButton);
    }

    // Page Classement
    const rankingButton = document.getElementById("ranking-button");
    const rankingType = document.getElementById("ranking-type");
    const rankingGenre = document.getElementById("ranking-genre");
    const rankingLimit = document.getElementById("ranking-limit");
    if (rankingButton && resultZone) {
        const ranking = new Ranking(
            animeAPI,
            resultZone,
            rankingType,
            rankingGenre,
            rankingLimit,
            rankingButton
        );
        ranking.initListeners();
        await ranking.loadGenres();
        await ranking.displayRanking();
    }
});
