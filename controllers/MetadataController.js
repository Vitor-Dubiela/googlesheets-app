const { request, response } = require('express');
const Authorization = require('../auth/Authorization');

const auth = new Authorization();

class MetadataController {
    async getSheetData(req = request, res = response) {
        const metadata  = await auth.googleSheets.spreadsheets.get({
            spreadsheetId: auth.sheetId
        });
        
        console.log(metadata);
        res.send(metadata);
    }
}

module.exports = MetadataController;