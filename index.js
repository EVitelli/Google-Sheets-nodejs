const fs = require('fs');
const { google } = require('googleapis');
const auth = require('./auth');
const docId = '185FdmijOJ18jYFBDoCw01awy0N5mgONCqkCrc9OXNtI';


// Load client secrets from a local file.
fs.readFile('credentials.json', async (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.

    var name = 'abcd';
    await auth.authorize(JSON.parse(content), (auth) => getValues(auth, (range) => {
        writeLine(auth, ("A" + (range + 1)), name)
    }));
});

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getValues(auth, callback) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: docId,
        range: 'A1:B',
    }, (err, res) => {

        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            //return res.data.values?.length;
            if (callback) callback(res.data.values?.length);
            else {
                console.log(res.data.values?.length);
                console.log(res.data.values);
            }
        }
    });

}

async function writeLine(auth, range, name) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.update({
        spreadsheetId: docId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [
                    name,
                    'Male'
                ],
            ],
        },
    }, (err, res) => {

        if (err) {
            console.log('The API returned an error: ' + err);
        }
    });

    await setTimeout(() => {
        getValues(auth);
    }, 500);
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

    await setTimeout(() => {
        getValues(auth);
    }, 500);
}