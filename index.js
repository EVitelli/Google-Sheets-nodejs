const fs = require('fs');
const { google } = require('googleapis');
const auth = require('./auth');
const docId = '185FdmijOJ18jYFBDoCw01awy0N5mgONCqkCrc9OXNtI';


// Load client secrets from a local file.
fs.readFile('credentials.json', async (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    await auth.authorize(JSON.parse(content), writeLines);
    await auth.authorize(JSON.parse(content), getValues);
});

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getValues(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: docId,
        range: 'A2:B',
    }, (err, res) => {

        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            console.log(res.data.values?.length);
            console.log(res.data.values);
        }
    });
}

function writeLine(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.update({
        spreadsheetId: docId,
        range: 'A2',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [
                    'Erik Lopes',
                    'Male'
                ],
            ],
        },
    }, (err, res) => {

        if (err) {
            console.log('The API returned an error: ' + err);
        }
    });
}

function writeLines(auth) {
    const sheets = google.sheets({ version: 'v4', auth });

    sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: docId,
        resource: {
            data: {
                range: 'A2',
                values: [
                    [
                        'Erik Lopes',
                        'Male'
                    ], [
                        'Carol Sanguinete',
                        'Female'
                    ],
                ],
            },
            valueInputOption: 'USER_ENTERED',
        },
    }, (err, res) => {

        if (err) {
            console.log('The API returned an error: ' + err);
        }
    });
}