/**
 * @typedef {Object} AnimeData
 * @property {number|null} [id]
 * @property {string} title
 * @property {string|null} [englishTitle]
 * @property {string|null} [japaneseTitle]
 * @property {string[]} [alternativeTitles]
 * @property {string[]} [genres]
 * @property {string} image
 * @property {string} thumb
 * @property {string} synopsis
 * @property {number|null} [ranking]
 * @property {number|null} [score]
 * @property {number|null} [scoredBy]
 * @property {number|null} [popularity]
 * @property {number|null} [episodes]
 * @property {string} [status]
 * @property {string} [type]
 * @property {string|null} [season]
 * @property {number|null} [year]
 * @property {string|null} [duration]
 * @property {string|null} [rating]
 * @property {string|null} [trailer]
 * @property {string} [url]
 * @property {string[]} [studios]
 * @property {string[]} [producers]
 * @property {boolean} [hasRanking]
 * @property {boolean} [hasEpisode]
 */
export class Anime {
    /** @type {number|null} */
    id;
    /** @type {string} */
    title;
    /** @type {string|null} */
    englishTitle;
    /** @type {string|null} */
    japaneseTitle;
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
    /** @type {number|null} */
    ranking;
    /** @type {number|null} */
    score;
    /** @type {number|null} */
    scoredBy;
    /** @type {number|null} */
    popularity;
    /** @type {number|null} */
    episodes;
    /** @type {string} */
    status;
    /** @type {string} */
    type;
    /** @type {string|null} */
    season;
    /** @type {number|null} */
    year;
    /** @type {string|null} */
    duration;
    /** @type {string|null} */
    rating;
    /** @type {string|null} */
    trailer;
    /** @type {string} */
    url;
    /** @type {string[]} */
    studios;
    /** @type {string[]} */
    producers;
    /** @type {boolean} */
    hasRanking;
    /** @type {boolean} */
    hasEpisode;

    /**
     * @param {Partial<AnimeData> & Object} [item={}]
     */
    constructor(item = {}) {
        this.id = item.id ?? item.mal_id ?? null;
        this.title = item.title ?? "";
        this.englishTitle = item.englishTitle ?? item.titleEnglish ?? item.title_english ?? null;
        this.japaneseTitle = item.japaneseTitle ?? item.titleJapanese ?? item.title_japanese ?? null;
        this.alternativeTitles = item.alternativeTitles ?? (item.titles ? item.titles.map((t) => t.title) : (item.title_synonyms ?? []));
        this.genres = item.genres ? (typeof item.genres[0] === "object" ? item.genres.map((g) => g.name) : item.genres) : [];
        this.image = item.image ?? item.images?.webp?.large_image_url ?? item.images?.jpg?.large_image_url ?? item.images?.jpg?.image_url ?? "";
        this.thumb = item.thumb ?? item.images?.webp?.small_image_url ?? item.images?.jpg?.small_image_url ?? "";
        this.synopsis = item.synopsis ?? "";
        this.ranking = item.ranking ?? item.rank ?? null;
        this.score = item.score ?? null;
        this.scoredBy = item.scoredBy ?? item.scored_by ?? null;
        this.popularity = item.popularity ?? null;
        this.episodes = item.episodes ?? null;
        this.status = item.status ?? "";
        this.type = item.type ?? "";
        this.season = item.season ?? null;
        this.year = item.year ?? null;
        this.duration = item.duration ?? null;
        this.rating = item.rating ?? null;
        this.trailer = item.trailer ? (typeof item.trailer === "string" ? item.trailer : item.trailer.embed_url || item.trailer.url || null) : null;
        this.url = item.url ?? "";
        this.studios = item.studios ? (typeof item.studios[0] === "object" ? item.studios.map((s) => s.name) : item.studios) : [];
        this.producers = item.producers ? (typeof item.producers[0] === "object" ? item.producers.map((p) => p.name) : item.producers) : [];
        this.hasRanking = item.hasRanking ?? (this.ranking !== null && this.ranking !== undefined);
        this.hasEpisode = item.hasEpisode ?? (this.episodes !== null && this.episodes !== undefined && this.episodes > 0);
    }
}

/**
 * @typedef {Object} AnimeGenreData
 * @property {number|null} [id]
 * @property {string} genreName
*/
export class AnimeGenre {
    /** @type {number|null} */
    id;
    /** @type {string} */
    genreName;

    /**
     * @param {Object} item
     */
    constructor(item = {}) {
        this.id = item.mal_id ?? item.id ?? null;
        this.genreName = item.name ?? item.genreName ?? item.id ?? "";
    }
}
