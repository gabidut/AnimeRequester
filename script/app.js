/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js"
import { Search } from "./search.js";
import {ApiKeyStore} from "./apiKeyStore.js";

const apiKeyStore = new ApiKeyStore();

const animeAPI = new AnimeAPIWrapper(apiKeyStore.getCurrentApiKey(), true);

document.addEventListener("DOMContentLoaded", async () => {
    await apiKeyStore.checkAPIKey();
    const search = new Search(animeAPI);
    console.log(await search.getResults());
})
