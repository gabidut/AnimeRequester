/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

export class AnimeAPIWrapper {

    async getAnimeList(page = 1, limit = 10, search = null) {
        const params = new URLSearchParams();
        params.get('search');
        params.get('page');
        params.get('limit');

        const url = 'https://anime-db.p.rapidapi.com/anime?search=search&page=1&size=10';
    
        
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '',
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

}



