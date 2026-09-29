/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js"
import { Search } from "./search.js";
import {ApiKeyStore} from "./apiKeyStore.js";

const apiKeyStore = new ApiKeyStore();

document.addEventListener("DOMContentLoaded", async () => {
    await apiKeyStore.checkAPIKey();
    const search = new Search(APIWrapper);
    console.log(await search.getResults());
})
