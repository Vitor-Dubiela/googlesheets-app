const { google } = require('googleapis');

class Authorization {
    cred = "../cred.json";
    scope = "https://www.googleapis.com/auth/spreadsheets";
    sheetId = "1t5qqXn7g3a86AQh5wdm8K8Zhe3kVEI-I8D0RcLKgNJ0";
    authKey;
    client;
    googleSheets;

    constructor() {
        this.setAuth();
    }

    async setAuth() {
        this.authKey = new google.auth.GoogleAuth({
            keyFile: this.cred,
            scopes: this.scope
        });

        this.client = await this.authKey.getClient();

        this.googleSheets = google.sheets({
            version: 'v4',
            auth: this.client
        });
    }
}

module.exports = Authorization;