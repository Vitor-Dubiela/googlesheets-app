const { google } = require('googleapis');
const express = require('express');

const app = express();

const cred = "cred.json";
const scope = "https://www.googleapis.com/auth/spreadsheets";
const sheetId = "1t5qqXn7g3a86AQh5wdm8K8Zhe3kVEI-I8D0RcLKgNJ0";

app.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: cred,
        scopes: scope
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: 'v4',
        auth: client
    });

    const metadata = await googleSheets.spreadsheets.get(
        {
            auth: client,
            spreadsheetId: sheetId
        }
    );

    const studentsInfo = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "engenharia_de_software!A4:F"
    }).then((value) => {
        return value.data.values;
    }, (reason) => {
        console.log(reason);
    });

    for (const row of studentsInfo) {
        let id = row[0];
        let p1 = row[2];
        let p2 = row[3];
        let p3 = row[4];
        console.log(`ID: ${id} / P1: ${p1} / P2: ${p2} / P3: ${p3}\n`);
    }

    // console.log(studentsInfo);
    res.send(JSON.stringify(studentsInfo));
});

const port = 8080;
const hostname = "localhost";

app.listen(port, hostname, (req, res) => {
    console.log("It's running on localhost:8080");
});

