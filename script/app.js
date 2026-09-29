/***
 * (C) 2026 Hugo FAVEROULT, gabidut, WewennJr
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js"
import { Search } from "./search.js";
import {ApiKeyStore} from "./apiKeyStore.js";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultZone = document.getElementById("result-zone");

const apiKeyStore = new ApiKeyStore();

const animeAPI = new AnimeAPIWrapper(apiKeyStore.getCurrentApiKey(), true);

document.addEventListener("DOMContentLoaded", async () => {
    await apiKeyStore.checkAPIKey();
    const search = new Search(animeAPI, resultZone);
    search.initListeners(searchInput, searchButton);
})
