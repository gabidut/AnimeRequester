/**
 * @typedef {Object} AnimeData
 * @property {string} title
 * @property {string[]} [alternativeTitles]
 * @property {string[]} [genres]
 * @property {string} image
 * @property {string} thumb
 * @property {string} synopsis
 * @property {number} ranking
 * @property {number} episodes
 * @property {string} status
 * @property {string} type
 * @property {boolean} hasRanking
 * @property {boolean} hasEpisode
 */
export class Anime {
    /** @type {string} */
    title;
    /** @type {string[]} */
    alternativeTitles;
    /** @type {string[]} */
    genres;
    /** @type {string} */
    image;
    /** @type {string} */
    thumb;
    /** @type {string} */
    synopsis;
    /** @type {number} */
    ranking;
    /** @type {number} */
    episodes;
    /** @type {string} */
    status;
    /** @type {string} */
    type;
    /** @type {boolean} */
    hasRanking;
    /** @type {boolean} */
    hasEpisode;

    /**
     * @param {AnimeData} item
     */
    constructor(item) {
        this.title = item.title;
        this.alternativeTitles = item.alternativeTitles;
        this.genres = item.genres;
        this.image = item.image;
        this.thumb = item.thumb;
        this.synopsis = item.synopsis;
        this.ranking = item.ranking;
        this.episodes = item.episodes;
        this.status = item.status;
        this.type = item.type;
        this.hasRanking = item.hasRanking;
        this.hasEpisode = item.hasEpisode;
    }
}

/**
 * @typedef {Object} AnimeGenreData
 * @property {string} genreName
*/
export class AnimeGenre {
    /** @type {string} */
    genreName;

    constructor(item) {
        this.genreName = item.id;
    }
}