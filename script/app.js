/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

import {AnimeAPIWrapper} from "./api.js"

(async () => {
const APIWrapper = new AnimeAPIWrapper();
console.log(await APIWrapper.getAnimeList());

})()