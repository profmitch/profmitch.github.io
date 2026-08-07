// Ensure PDF.js is available from CDN in your HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
const HEIGHT_CANVAS_MAX = 630;
const WIDTH_CANVAS_MAX = HEIGHT_CANVAS_MAX * 16 / 9;
let pdfDoc;
let pageNum = 1;
const pageCountEl = document.getElementById('pageCount');
const pageNumInput = document.getElementById('pageNum');
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
export function loadPDF(url) {
    // Load PDF
    pdfjsLib.getDocument(url).promise.then((doc) => {
        pdfDoc = doc;
        pageCountEl.textContent = `/ ${doc.numPages}`;
        renderPage(pageNum);
    });
}
function renderPage(num) {
    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        let viewportWidth, viewportHeight;
        if (viewport.width > WIDTH_CANVAS_MAX)
            viewportWidth =
                canvas.width = viewport.width;
        canvas.height = viewport.height;
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
            canvas: canvas
        };
        page.render(renderContext);
        pageNumInput.value = String(num);
    });
}
// Control bindings
document.getElementById('nextPage').onclick = () => {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
    }
};
document.getElementById('prevPage').onclick = () => {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
    }
};
document.getElementById('firstPage').onclick = () => {
    pageNum = 1;
    renderPage(pageNum);
};
document.getElementById('lastPage').onclick = () => {
    pageNum = pdfDoc.numPages;
    renderPage(pageNum);
};
pageNumInput.onchange = () => {
    const inputPage = parseInt(pageNumInput.value, 10);
    if (inputPage >= 1 && inputPage <= pdfDoc.numPages) {
        pageNum = inputPage;
        renderPage(pageNum);
    }
};
//# sourceMappingURL=pdfviewer.js.map