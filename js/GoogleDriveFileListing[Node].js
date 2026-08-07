/*****************************
 *  Get file listing of files to be public/shared on Google Drive & store it in repository
 *  Uses Google Drive API with OAuth2 to get listing
 *****************************/
//import { ref } from "process";
import { google } from "googleapis";
const gapiLibraries = "client", // should be ':'-separated list of libraries to load
apiLoadTimeout = 5000, // milliseconds for GAPI loading to occur
CLIENT_ID = "949429110997-pveh14isubihlnri1pnjs0vvmtmham1v.apps.googleusercontent.com", SCOPES = "https://www.googleapis.com/auth/drive.file", API_KEY = "AIzaSyDsjlRQ0HmeBRPCAzcmmCqbKxekc8kgdXw", DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
let accessToken;
function getAccessToken() {
    return new Promise((resolve, reject) => {
        try {
            google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        // Use the access token in your API requests
                        resolve(tokenResponse.access_token);
                    }
                    else
                        reject();
                },
            }).requestAccessToken();
        }
        catch (exc) {
            console.log(`Exception caught: ${exc}`);
        }
    });
}
function googleApiLoadClientGetList(GoogleDriveApi) {
    return new Promise((resolve, reject) => {
        GoogleDriveApi.client.load("drive", "v3").then(() => {
            GoogleDriveApi.client.drive.files.list({
                pageSize: 10,
                fields: "files(id, name)",
            }).then((response) => {
                resolve(response.result.files);
                console.log("Files:", response.result.files);
            }).catch((err) => {
                reject(`Method 'gapi.client.drive.files.list()' call error` +
                    `\nErr: ${err}`);
            });
        }).catch((err) => {
            reject(`Method 'gapi.client.load' call error` +
                `\nErr: ${err}`);
        });
    });
}
function gapiInit(GoogleDriveApi) {
    return new Promise((resolve, reject) => {
        GoogleDriveApi.load(gapiLibraries, {
            callback: () => {
                try {
                    GoogleDriveApi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: [DISCOVERY_DOC],
                        //clientId: CLIENT_ID,
                        //scope: SCOPES
                    }).then(() => {
                        resolve();
                    }).catch((err) => {
                        if (err.message)
                            reject(err.message);
                        else
                            reject(err);
                    });
                }
                catch (e) {
                    reject(e);
                }
            },
            onerror: () => {
                console.error(`Google libraries '${gapiLibraries}' failed to load: parameter issue?`);
            },
            timeout: apiLoadTimeout,
            ontimeout: () => {
                console.error(`Google libraries '${gapiLibraries}' timeout error in loading`);
            }
        });
    });
}
function getDriveFilesList(GoogleDriveApi) {
    return new Promise((resolve, reject) => {
        try {
            gapiInit(GoogleDriveApi).then(() => {
                getAccessToken().then((token) => {
                    accessToken = token;
                    console.log('Access Token:', accessToken);
                    googleApiLoadClientGetList(GoogleDriveApi).then((files) => {
                        resolve(files);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(`function 'getAccessToken()' call error` +
                        `\nErr: ${err}`);
                }); // get the file IDs list from the local file
            }).catch(err => {
                reject(`Init of Google API: function 'gapiInit()' call error` +
                    `\nErr: ${err}`);
            });
        }
        catch (err) {
            reject(`Error starting Promise--in 'try block\nErr: ${err}`);
        }
    });
}
function entry() {
    // Google Drive API loading, intialization, authentication
    getDriveFilesList(google).then((items) => {
        console.log(items);
    });
    // file list generation
}
entry();
//# sourceMappingURL=GoogleDriveFileListing%5BNode%5D.js.map