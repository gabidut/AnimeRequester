/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js"
import { Search } from "./search.js";

(async () => {
//const APIWrapper = new AnimeAPIWrapper();
//console.log(await APIWrapper.getAnimeList());

const search = new Search();
console.log(await search.getResults());

})()
