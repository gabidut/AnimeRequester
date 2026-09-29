/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js"
import { Search } from "./search.js";

(async () => {
    const APIWrapper = new AnimeAPIWrapper('');
    const search = new Search(APIWrapper);
    console.log(await search.getResults());
})()
