// import { config } from "process";
export const PORT = 3000;
const DELIVERY_SERVER = `http://127.0.0.1:${PORT}`;
export const SERVER_CONFIG = [
    {
        extension: "pdf",
        path: "/pdf",
        staticRoot: "D:\\ProfMitch GitHub\\profmitch.github.io\\PowerPoint Talks--Libraries\\__pdfs",
        filesFilter: (s) => s.endsWith(".pdf"),
        fileListTitle: "PowerPoint (as PDFs)",
        fileNamesList: []
    },
    {
        extension: "html",
        path: "/html",
        staticRoot: "D:\\ProfMitch GitHub\\profmitch.github.io\\TheHalloranCompleteReference",
        filesFilter: (s) => s.endsWith('.html'),
        fileListTitle: "Web documents",
        fileNamesList: []
    }
    /*,
    {
        extension: "css",
        path: "/css",
        staticRoot: "D:\\dev\\ProfMitch GitHub\\profmitch.github.io\\Teaching\\css",
        filesFilter: (s: string) => s.endsWith('.css'),
        fileListTitle: "Style Files",
        fileNamesList: []
    }*/
];
const LISTS_SELECT_LINES_MAX = 4, LIST_SELECT_LINES_MAX = 5;
let selectedConfig;
if (typeof document != "undefined")
    document.addEventListener("DOMContentLoaded", () => {
        const filesListsDiv = document.getElementById("files-lists");
        if (filesListsDiv == null)
            appError("Missing an HTML 'div' element to put file listings");
        else {
            let listsSelectLinesMax = LISTS_SELECT_LINES_MAX, configIndex = 0, fileIndex;
            if (SERVER_CONFIG.length < listsSelectLinesMax)
                listsSelectLinesMax = SERVER_CONFIG.length;
            const listsSelectElem = document.createElement("select");
            listsSelectElem.id = "lists-select";
            listsSelectElem.className = "files-lists";
            filesListsDiv.appendChild(listsSelectElem);
            listsSelectElem.size = listsSelectLinesMax;
            filesListsDiv.appendChild(document.createElement("br"));
            const oneListSelectElem = document.createElement("select");
            oneListSelectElem.id = "one-list-select";
            oneListSelectElem.className = "files-lists";
            filesListsDiv.appendChild(oneListSelectElem);
            oneListSelectElem.size = LIST_SELECT_LINES_MAX;
            listsSelectElem.addEventListener("change", (evt) => {
                const selectElem = evt.target;
                const selectedOption = selectElem.options[selectElem.selectedIndex];
                selectedConfig = SERVER_CONFIG[selectElem.selectedIndex];
                for (const option of listsSelectElem.options)
                    if (option == selectedOption)
                        option.classList.add("selected-option");
                    else
                        option.classList.remove("selected-option");
                while (oneListSelectElem.firstChild)
                    oneListSelectElem.removeChild(oneListSelectElem.firstChild);
                const config = SERVER_CONFIG[parseInt(selectedOption.value)];
                const extension = `.${config.extension}`;
                fileIndex = 0;
                config.fileNamesList.forEach((fileName) => {
                    const optionElem = document.createElement("option");
                    oneListSelectElem.appendChild(optionElem);
                    optionElem.appendChild(document.createTextNode(fileName.search(extension) > 0 ?
                        fileName.substring(0, fileName.length - extension.length) :
                        fileName));
                    optionElem.value = (fileIndex++).toString();
                });
            });
            oneListSelectElem.addEventListener("change", (evt) => {
                const selectElem = evt.currentTarget;
                if (selectedConfig.extension == "pdf") {
                    const pdfViewingDiv = document.getElementById("pdf-viewing");
                    pdfViewingDiv.style.display = "block";
                    loadPDF(`${DELIVERY_SERVER}${selectedConfig.path}/${selectedConfig.fileNamesList[selectElem.selectedIndex]}`);
                }
                else if (selectedConfig.extension == "html") {
                    const webDocIframe = document.getElementById("webdoc-viewing");
                    webDocIframe.style.display = "block";
                    webDocIframe.src =
                        `${DELIVERY_SERVER}${selectedConfig.path}/${selectedConfig.fileNamesList[selectElem.selectedIndex]}`;
                }
            });
            for (const config of SERVER_CONFIG) {
                const optionElem = document.createElement("option");
                listsSelectElem.appendChild(optionElem);
                optionElem.appendChild(document.createTextNode(config.fileListTitle));
                optionElem.value = (configIndex++).toString();
                fetch(`${DELIVERY_SERVER}${config.path}`)
                    .then(res => res.json())
                    .then(fileNameList => config.fileNamesList = fileNameList)
                    .catch((err) => {
                    if (err == 404)
                        appError("The required Express server is not running or not configured properly.");
                });
            }
        }
    });
function appError(message) {
    let appErrorDiv = document.getElementById("app-error");
    if (appErrorDiv == null) {
        const bodyElem = document.body;
        appErrorDiv = document.createElement("div");
        bodyElem.appendChild(appErrorDiv);
        appErrorDiv.style.border = "2px solid red";
        appErrorDiv.style.backgroundColor = "pink";
        appErrorDiv.style.padding = "1em 3em";
        appErrorDiv.style.font = "bold 14pt Arial,Helvetica,sans-serif";
        appErrorDiv.style.color = "red";
        appErrorDiv.appendChild(document.createTextNode("\u000a"));
    }
    appErrorDiv.replaceChild(document.createTextNode(message), appErrorDiv.firstChild);
}
//# sourceMappingURL=localFileListing%5Bbrowser%5D.js.map