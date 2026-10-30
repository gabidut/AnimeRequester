/***
 * (C) 2026 Hugo FAVEROULT, gabidut, WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js";
import { Search } from "./search.js";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultZone = document.getElementById("result-zone");

const animeAPI = new AnimeAPIWrapper();

document.addEventListener("DOMContentLoaded", async () => {
    const search = new Search(animeAPI, resultZone);
    search.initListeners(searchInput, searchButton);
});
