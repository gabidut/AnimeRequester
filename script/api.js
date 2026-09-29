/***
 * (C) 2026 Hugo FAVEROULT
 * https://github.com/gabidut/AnimeRequester
 */

export class AnimeAPIWrapper {

    apiKey = '';

    constructor(apiKey){
        this.apiKey = apiKey;
    }

    async getAnimeList(page = 1, limit = 10, search = null) {
        const params = new URLSearchParams();
        params.set('search', search);
        params.set('page', page);
        params.set('size', limit);
        

        const url = 'https://anime-db.p.rapidapi.com/anime?'+params.toString();
        //const url = 'https://gabidt76.fr/prout.php?'+params.toString();    
        


        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            return result;
        } catch (error){
            throw new Error("Erreur de requete", error);
            
            console.error(error);
        }


    }


}



