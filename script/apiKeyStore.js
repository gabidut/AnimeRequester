/***
 * (C) 2026 gabidut76
 * https://github.com/gabidut/AnimeRequester
 */


export class ApiKeyStore {
    async getCurrentApiKey() {
        if (localStorage.getItem("apiKey") === null) {
            await this.promptForApiKey();
        }
        return localStorage.getItem("apiKey");
    }

    async checkAPIKey() {
        let apiKey = await this.getCurrentApiKey();
        if (!apiKey) {
            await this.promptForApiKey();
        }
    }

    async promptForApiKey() {
        let apiKey = prompt("Please enter your API key:");

        if (apiKey) {
            localStorage.setItem("apiKey", apiKey);
        } else {
            alert("API key is required to use this application.");
            await this.promptForApiKey();
        }
    }
}