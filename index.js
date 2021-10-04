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
        range: "engenharia_de_software!A4:H"
    }).then((value) => {
        return value.data.values;
    }, (reason) => {
        console.log(reason);
    });

    const totalStudentsNmb = studentsData.length;

    function printRows(sheetRows, classesNmb) {
        for (const row of sheetRows) {
            let id = parseInt(row[0]);
            let abs = parseInt(row[2]);
            let p1 = parseInt(row[3]);
            let p2 = parseInt(row[4]);
            let p3 = parseInt(row[5]);

            let average = calcAverage(p1, p2, p3);
            let state = getGradesSit(average);
            let finalGrade = calcFinalGrade(average); 
            
            console.log(`id: ${id} / Absences: ${abs} / P1: ${p1} / P2: ${p2} / P3: ${p3} / Average: ${average}\n`);

            if (abs > allowedAbs) {
                putAbsencesSit(id + 3);
                putFinalGrade(id + 3, 0);
            } 

            if (abs <= allowedAbs) {
                if (average < 50) {
                    putSittuation(id + 3, state);
                    putFinalGrade(id + 3, 0);
                } else if (average < 70) {
                    putSittuation(id + 3, state);
                    // putFinalGrade(id, finalgrade)
                } else {
                    putSittuation(id + 3, state);
                    putFinalGrade(id + 3, 0);
                }
            }
        }
        console.log(classesNmb);
        console.log(totalStudentsNmb);
    }
    printRows(studentsData, classesNmb);

    async function putAbsencesSit(id) {
        await googleSheets.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetId,
            range: `engenharia_de_software!G${id}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                range: `engenharia_de_software!G${id}`,
                values: [
                    ["Reprovado por Falta"]
                ]
            }
        }).then((value) => {
            
        }, (err) => {
            console.log(err);
        });
    }

    async function putSittuation(id, state) {
        await googleSheets.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetId,
            range: `engenharia_de_software!G${id}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                range: `engenharia_de_software!G${id}`,
                values: [
                    [state]
                ]
            }
        }).then((value) => {
            
        }, (err) => {
            console.log(err);
        });
    }

    async function putFinalGrade(id, finalGrade) {
        await googleSheets.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetId,
            range: `engenharia_de_software!H${id}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                range: `engenharia_de_software!H${id}`,
                values: [
                    [finalGrade]
                ]
            }
        }).then((value) => {
            
        }, (err) => {
            console.log(err);
        });
    }

    res.send(JSON.stringify(studentsData));
});


function getTotalClasses(classesStr) {
    let str = classesStr[0][0];
    let totalClasses = str.substring(str.indexOf(':') + 1);

    return parseInt(totalClasses);
}

function calcAverage(p1, p2, p3) {
    let average = (p1 + p2 + p3) / 3;

    return average;
}

function calcFinalGrade(average) {
    let finalGrade;
    let x;
    
    // finalGrade = ;

    return finalGrade;
}

function getGradesSit(average) {
    let str;
    if (average < 50) {
        str = "Reprovado por Nota";
    } else if (average < 70) {
        str = "Exame Final";
    } else {
        str = "Aprovado";
    }

    return str;
}

const port = 8080;
const hostname = "localhost";

app.listen(port, hostname, (req, res) => {
    console.log("It's running on localhost:8080");
});

