document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("title").appendChild(document.createTextNode(document.querySelector('title').textContent));
    const faviconAttributes = [
        { rel: "icon", type: "image/x-icon", href: "favicon.ico", },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "favicon-16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "favicon-32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "android-icon-192.png" }
    ];
    const headElem = document.getElementsByTagName("head")[0];
    let attribValue;
    for (const linkElemData of faviconAttributes) {
        const linkElem = document.createElement("link");
        headElem.appendChild(linkElem);
        for (const attrib in linkElemData)
            if (attribValue = linkElemData[attrib])
                linkElem.setAttribute(attrib, attribValue);
    }
});
//# sourceMappingURL=defaults_html.js.map