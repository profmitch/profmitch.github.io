const gapiLibraries = "client", // should be ':'-separated list of libraries to load
apiLoadTimeout = 5000, // milliseconds for GAPI loading to occur
CLIENT_ID = "949429110997-pveh14isubihlnri1pnjs0vvmtmham1v.apps.googleusercontent.com", SCOPES = "https://www.googleapis.com/auth/drive.file", API_KEY = "AIzaSyDsjlRQ0HmeBRPCAzcmmCqbKxekc8kgdXw", DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
let accessToken;
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
function retrieveGDriveFile(GoogleDriveApi, fileId) {
    return new Promise((resolve, reject) => {
        try {
            gapiInit(GoogleDriveApi).then(() => {
                //				getAccessToken().then((token: string) => {
                //					accessToken = token;
                //					console.log('Access Token:', accessToken);
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
                //				}).catch(err => {
                //					reject(`function 'getAccessToken()' call error` +
                //						`\nErr: ${err}`);
                //				});
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
function googleApiLoadClient(GoogleDriveApi) {
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
function getDriveFilesList(GoogleDriveApi, referrer) {
    return new Promise((resolve, reject) => {
    });
}
document.addEventListener("DOMContentLoaded", () => {
    getDriveFilesList(google).then((files) => {
        console.log(files.join("\n"));
    }).catch((err) => {
        console.log(`Error during initialization and getting list of files\nErr: ${err}`);
    });
});
export {};
/*
    {
        "web": {
            "client_id": "949429110997-pveh14isubihlnri1pnjs0vvmtmham1v.apps.googleusercontent.com",
            "project_id": "solid-garden-467304-k2",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "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",
            "javascript_origins":["https://profmitch.github.io"]
        }
    }
*/ 
//# sourceMappingURL=GoogleDriveApiFileRetrieve.js.map