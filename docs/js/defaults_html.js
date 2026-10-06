const currentScript = document.currentScript;
// 2. Declaring a standalone global variable
//declare const APP_VERSION: string;
document.addEventListener("DOMContentLoaded", () => {
    const scriptUrl = currentScript?.getAttribute("src") ?? null;
    if (!scriptUrl) {
        console.error("Unable to obtain a path for determining locations of default files");
        return;
    }
    console.log(`Base script path is '${scriptUrl}'`);
    const elem = document.querySelector('title');
    if (elem && elem.textContent)
        document.getElementById("title").appendChild(document.createTextNode(elem.textContent));
    // CSS path check
    (async () => {
        let testPath, CSS;
        testPath = "./css/std.css";
        if (await checkPath(testPath) == true)
            CSS = testPath;
        else {
            testPath = "../css/std.css";
            if (await checkPath(testPath) == true)
                CSS = testPath;
            else {
                console.log("need to report error");
                CSS = "";
            }
        }
        const linkElemAttributes = [
            { rel: "icon", type: "image/x-icon", href: "favicon.ico" },
            { rel: "shortcut-icon", type: "image/x-icon", href: "../img/favicon.ico" },
            { rel: "icon", type: "image/png", sizes: "16x16", href: "../img/favicon-16.png" },
            { rel: "icon", type: "image/png", sizes: "32x32", href: "../img/favicon-32.png" },
            { rel: "apple-touch-icon", sizes: "180x180", href: "../img/apple-touch-icon.png" },
            { rel: "icon", type: "image/png", sizes: "192x192", href: "../img/android-icon-192.png" },
            { rel: "stylesheet", href: `${CSS}/std.css` },
            { rel: "stylesheet", href: `${CSS}/compact.css` },
            { rel: "stylesheet", href: `${CSS}/chem.css` }
        ];
        //   const scriptElemAttributes = [];
        const headElem = document.getElementsByTagName("head")[0];
        let attribValue;
        for (const linkElemData of linkElemAttributes) {
            const linkElem = document.createElement("link");
            headElem.appendChild(linkElem);
            for (const attrib in linkElemData) {
                attribValue = linkElemData[attrib];
                if (attribValue)
                    linkElem.setAttribute(attrib, attribValue);
            }
        }
    })();
});
async function checkPath(relativePath) {
    const url = new URL(relativePath, document.baseURI);
    try {
        const response = await fetch(url);
        return response.ok; // true for HTTP 2xx; false for 404, etc.
    }
    catch {
        return false; // network or browser security error
    }
}

export {};
