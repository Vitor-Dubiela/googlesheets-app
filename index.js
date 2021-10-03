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

    const totalClassesCell = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "engenharia_de_software!A2:A2"
    }).then((value) => {
        return value.data.values;
    }, (reason) => {
        console.log(reason);
    });

    const classesNmb = getTotalClasses(totalClassesCell);
    const allowedAbs = classesNmb * 0.25;

    const studentsData = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "engenharia_de_software!A4:F"
    }).then((value) => {
        return value.data.values;
    }, (reason) => {
        console.log(reason);
    });

    const totalStudentsNmb = studentsData.length;

    function printRows(sheetRows, classesNmb) {
        for (const row of sheetRows) {
            let id = row[0];
            let abs = row[2];
            let p1 = row[3];
            let p2 = row[4];
            let p3 = row[5];
            console.log(`ID: ${id} / Absences: ${abs} / P1: ${p1} / P2: ${p2} / P3: ${p3}\n`);
            if (abs > allowedAbs) {

            }
        }
        console.log(classesNmb);
        console.log(totalStudentsNmb);
    }
    printRows(studentsData, classesNmb);

    async function updateAbsences() {
        await googleSheets.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetId,
            range: "engenharia_de_software!G4",
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                range: "engenharia_de_software!G4",
                values: [
                    ["aprovado"]
                ]
            }
        }).then((value) => {
            console.log(value);
        }, (err) => {
            console.log(err);
        });
    }

    updateAbsences();
    res.send(JSON.stringify(studentsData));
});


function getTotalClasses(classesStr) {
    let str = classesStr[0][0];
    let totalClasses = str.substring(str.indexOf(':') + 1);

    return parseInt(totalClasses);
}


const port = 8080;
const hostname = "localhost";

app.listen(port, hostname, (req, res) => {
    console.log("It's running on localhost:8080");
});

