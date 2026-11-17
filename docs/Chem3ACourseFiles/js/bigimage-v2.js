/*****************************************************************************
This script was written by S. M. Halloran, who reserves all rights related to
the authorship/origination and dissemination/publication of this code.

Those wishing to use this code may do so freely as long as they retain this comment
in its entirety.  Modifications to the code can be annotated as an appendix to this
comment.

Use of this code is AT THE USER'S OWN RISK.  No warranty is made explicitly or
implicitly as to this code's unlikely potential at causing damage or malfunction
to data or computing device, especially when used as intended.

For instructions on how to use the interface, see the bottom of this script
source.
*****************************************************************************/
import * as yaml from "js-yaml";
// for browser, use following script tag:
// <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
import { MathOperation, iCss } from "./iCss.js";
export { htmlDocTypeDecl, xhtmlMetaContentTypeAsXHTML, xhtmlDocTypeDecl, htmlMetaContentTypeAsHTML, HtmlImgControl };
const htmlDocTypeDecl = "<!DOCTYPE html\n" +
    "<html>\n";
const xhtmlDocTypeDecl = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
    "<?xml-stylesheet type=\"text/xsl\" href=\"copy.xsl\"?>\n" +
    "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n" +
    "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
    "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n";
const xhtmlMetaContentTypeAsXHTML = "<meta http-equiv=\"Content-Type\" " +
    "content=\"application/xhtml+xml; charset=utf-8\" />";
const htmlMetaContentTypeAsHTML = "<meta http-equiv=\"Content-Type\" " +
    "content=\"text/html; charset=utf-8\">";
class HtmlImgControl {
    constructor() {
        this.imgWin = null; // recycle windows when possible
        this.configInfo = {};
        this.methodError = "";
    }
    /* resizeImage() forces a change in the size of the image to the
    * factor indicated
    * @param imgObj | instance of DOM img Object
    * @param factor | the factor by which to resize image in aspect
    * @return void
    */
    resizeImage(imgObj, factor) {
        this.methodError = "";
        const aspect = imgObj.height / imgObj.width;
        if (typeof (imgObj) == "undefined" || typeof (factor) == "undefined")
            return;
        factor = Math.abs(factor);
        if (aspect > 1) {
            imgObj.width *= factor;
            imgObj.height = imgObj.width * aspect;
        }
        else {
            imgObj.height *= factor;
            imgObj.width = imgObj.height / aspect;
        }
    }
    /*
    setThumbedImages() calls thumbedImage for all images with the 'class' attribute
    set to 'thumbImage' in the document body. this function had to be created
    because the 'onload' attribute is not permitted for the IMG element in the HTML
    specification, but is permitted for the document body or a frameset

    Normally, the image is thumbed by the class="..." value if it exceeds a
    certain size.  However, if the argument 'force' is set 'true', then
    the image will be resized whether or not it exceeds screen size
    */
    setThumbedImages(docBody, force, includePrompt) {
        const calculationError = (message) => {
            const defaultMessage = "There was a calculation error, probably in CSS math";
            if (message) {
                console.log(message);
                return message;
            }
            else {
                console.log(defaultMessage);
                return defaultMessage;
            }
        };
        this.methodError = "";
        const imgSetRegex = /[0-9]*\.?[0-9]+/;
        let bodyImages, imgElem, classNames, styleElem, htmlElems, factor, promptSpan, 
        // imgStyle: CSSStyleDeclaration,
        imgParent, imgContain, computedFactor;
        //	imageDecColor: number,
        // parentColor: string;
        //	oldParentColor: string | null = null;
        if (!includePrompt)
            includePrompt = false;
        if ((htmlElems = document.getElementsByTagName("style")) == null ||
            (htmlElems instanceof HTMLCollection == true && htmlElems.length == 0)) {
            styleElem = document.createElement("style");
            htmlElems = document.getElementsByTagName("head");
            htmlElems[0].appendChild(styleElem);
        }
        else
            styleElem = htmlElems[0];
        let promptSpanRule = "";
        for (const prop in this.configInfo.promptSpan)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            promptSpanRule += `${prop}: ${this.configInfo.promptSpan[prop]};`;
        styleElem.appendChild(document.createTextNode(`span.enlargePrompt{${promptSpanRule}}`));
        if ((bodyImages = docBody.getElementsByTagName("img")) == null)
            throw "there were no images found";
        for (let i = 0; i < bodyImages.length; i++) {
            imgElem = bodyImages[i];
            //		imgElem.style.width = "auto"; // ✅ Adjust width as needed 
            //		imgElem.style.height = "auto"; // ✅ Maintain aspect ratio */
            imgElem.style.display = "block"; // ✅ Ensures proper resizing */
            imgElem.addEventListener("click", (evt) => {
                this.bigimage(evt.currentTarget.cloneNode(true), true);
            });
            // imgStyle = getComputedStyle(imgElem);
            imgParent = imgElem.parentNode;
            if (includePrompt == true) {
                //	parentColor = imgStyle.backgroundColor;
                imgContain = document.createElement("div");
                let cssProperty;
                for (const prop in this.configInfo.imgContain) {
                    const value = this.configInfo.imgContain[prop];
                    if (prop.startsWith("style-")) {
                        cssProperty = prop.substring("style-".length);
                        imgContain.style.setProperty(cssProperty, value);
                    }
                    else
                        imgContain.setAttribute(prop, value);
                }
                /*
                imgContain.style.display = "inline-block";
                imgContain.className = "img-container";
                imgContain.style.margin = "0";
                imgContain.style.borderWidth = "1px";
                imgContain.style.borderStyle = "solid";
                imgContain.style.textAlign = "center"; */
                /*
                imgContain.style.display = "flex";
                imgContain.style.alignItems = "center";
                imgContain.style.justifyContent = "center";
                */
                imgParent.insertBefore(imgContain, imgElem);
                imgElem = imgParent.removeChild(imgElem);
                imgElem = imgContain.appendChild(imgElem);
                promptSpan = document.createElement("span");
                promptSpan.className = "enlargePrompt";
                /*
                if (parentColor != oldParentColor) {
                    imageDecColor = ColorComponents.generateRandomContrastColor(parentColor, "cssColorString");
                    oldParentColor = parentColor;
                } else {
                    imageDecColor = parentColor
                } */
                //	imgContain.style.borderColor = imageDecColor.toString();
                promptSpan.appendChild(document.createTextNode("Click on the image to enlarge it in a new window"));
                //	promptSpan.style.color = imageDecColor.toString();
                imgContain.insertBefore(promptSpan, imgElem);
                imgContain.insertBefore(document.createElement("br"), imgElem);
            }
            classNames = imgElem.className.split(/\s+/g);
            imgElem.style.cursor = "pointer";
            for (let j = 0; j < classNames.length; j++)
                if (classNames[j].toLowerCase().search("thumbimage") >= 0) {
                    factor = classNames[j].match(imgSetRegex);
                    if (factor) {
                        if (force == true)
                            this.resizeImage(imgElem, parseFloat(factor[0]));
                        else
                            this.thumbIfBig(imgElem, parseFloat(factor[0]));
                        break;
                    }
                    else {
                        const imgParentStyle = getComputedStyle(imgParent), iCSS = new iCss();
                        let intermediate;
                        // no resizing value set; fit to parent padded width
                        intermediate = iCSS.doCssMath(MathOperation.CSS_MULTIPLY, -2, imgParentStyle.padding) ?? calculationError();
                        intermediate = iCSS.doCssMath(MathOperation.CSS_SUM, imgParentStyle.width, intermediate) ?? calculationError();
                        computedFactor = iCSS.extractValueDim(iCSS.doCssMath(MathOperation.CSS_DIVIDE, intermediate, imgElem.width));
                        if (computedFactor != null && computedFactor.val < 1)
                            imgElem.width = computedFactor.val * imgElem.width;
                    }
                }
        }
    }
    // img width = (img parent width - 2 * parent padding) / current img width (pixels) /
    /* thumbedImage() or thumbIfBig() for IMG onload event to size the thumb form of an image
        according to the screen resolution, but not the browser window
        dimensions.  One should try to use a thumb already sized to what
        it should be like */
    /**
     * @method thumbedImage -- calls thumbIfBig()
     * @param imgObj
     * @param screenProportion
     */
    thumbedImage(imgObj, screenProportion) {
        this.methodError = "";
        this.thumbIfBig(imgObj, screenProportion);
    }
    /**
     * @method thumbIfBig --
     * @param imgObj
     * @param screenProportion
     */
    thumbIfBig(imgObj, screenProportion) {
        this.methodError = "";
        if (!imgObj) {
            this.methodError = "An image element must be passed as an argument to 'thumbIfBig()'";
            return;
        }
        if (typeof (screenProportion) == "undefined")
            screenProportion = 1;
        if (imgObj.height > screenProportion * screen.availHeight) {
            imgObj.width *= screenProportion * screen.availHeight / imgObj.height;
            imgObj.height = screenProportion * screen.availHeight;
        }
        if (imgObj.width > screenProportion * screen.availWidth) {
            imgObj.height *= screenProportion * screen.availWidth / imgObj.width;
            imgObj.width = screenProportion * screen.availWidth;
        }
    }
    /* winHeight, and winWidth must be values between 0 and 1, and represent
        the proportion the window is to the screen (0 = min, 1 = max, and
        somewhere in between) */
    /**
     * @method resizeImage2Screen -- this reduces an image larger than the screen to the screenn
     * @param imgObj
     * @param scrn
     * @param resizeFactor
     * @returns {boolean}
     */
    resizeImage2Screen(imgObj, scrn, resizeFactor) {
        this.methodError = "";
        const wratio = imgObj.width / scrn.availWidth, hratio = imgObj.height / scrn.availHeight, aspect = imgObj.width / imgObj.height;
        if (typeof imgObj == "undefined" || imgObj == null)
            this.methodError = "resizeImage2Screen() arg #1: img object instance undefined or null";
        if (typeof scrn == "undefined" || scrn == null)
            this.methodError = "resizeImage2Screen() arg #2: screen instance undefined or null";
        if (typeof imgObj == "undefined" || imgObj == null)
            this.methodError = "resizeImage2Screen() arg #3: resizeFactor float undefined or null" +
                "a good default to use = 0.96";
        if (wratio < 1.0 && hratio < 1.0)
            this.methodError = "image already fits within the screen; no resize necessary";
        if (this.methodError.length > 0)
            return false;
        if (wratio > hratio) {
            imgObj.width *= (resizeFactor / wratio);
            imgObj.height = imgObj.width / aspect;
        }
        else {
            imgObj.height *= (resizeFactor / hratio);
            imgObj.width = imgObj.height * aspect;
        }
        return true;
    }
    /**
     * @method resizeWin2Image -- this will cause a window to be resized so thta it containns
     * 	an unresized image
     * @param imgObj
     * @param win
     * @param resizeFactor
     */
    resizeWin2Image(imgObj, win, resizeFactor) {
        this.methodError = "";
        if (typeof imgObj == "undefined" || imgObj == null)
            this.methodError = "resizeWin2Image() arg #1: img object instance undefined or null";
        else if (typeof win == "undefined" || win == null)
            this.methodError = "resizeWin2Image() arg #2: window instance undefined or null";
        else if (!resizeFactor || resizeFactor == null)
            this.methodError = "resizeWin2Image() arg #3: resizeFactor float undefined or null" +
                "\na good default to use = 1.1";
        win.resizeTo(imgObj.width * resizeFactor, imgObj.height * resizeFactor);
    }
    /**
     * @method getImage -- this will open a new window with the URL (it may not strictly be an image)
     * @param url
     * @returns
     */
    getImage(url) {
        return window.open(url);
    }
    /**
     *  Use docWideResize() to resize all images in the document
     *  to the parent container width of 100% and automatically make them clickable.
     *
     *  EXCEPTIONS:  to stop an image from being scripted in this way,
     *    put as a class attribute /class="no-js"/
     */
    /**
     * @method setDocWideBigImages --
     * @param document
     * @param styling
     * @returns
     */
    setDocWideBigImages(document, styling) {
        const imageRefs = document.getElementsByTagName("img"), docImages = [];
        let clonedImage;
        if (typeof imageRefs.item == "function")
            for (let i = 0; i < imageRefs.length; i++)
                if (imageRefs[i].className.search(/no-js/) < 0)
                    docImages.push(imageRefs.item(i));
        for (let i = 0; i < docImages.length; i++) {
            clonedImage = this.setImagePrompt(docImages[i], styling);
            clonedImage.addEventListener("click", this.docWideBigImage, false);
        }
        return docImages.length; // number of images processed
    }
    /* this is a handler */
    /**
     * @method docWideBigImage
     * @param evt
     * @returns
     */
    docWideBigImage(evt) {
        if (evt.target)
            return this.bigimage(evt.target, true);
        return this.bigimage(evt.currentTarget, true);
    }
    /**
     * @method setImagePrompt --
     * @param imgObj
     * @param styling
     * @returns
     */
    setImagePrompt(imgObj, styling) {
        const parentNode = imgObj.parentNode, divElem = document.createElement("div"); // <div> </div>;
        let clonedImageObj;
        parentNode.appendChild(divElem); // <parent><img><div></div></parent>
        divElem.appendChild(clonedImageObj = imgObj.cloneNode(true));
        // <parent><img><div><imgClone></div></parent>
        parentNode.removeChild(imgObj);
        // <parent><div><imgClone></div></parent>
        imgObj = clonedImageObj;
        // <parent><div><img></div></parent>
        if (typeof styling === "string")
            divElem.setAttribute("style", styling);
        imgObj.style.marginTop = "0";
        imgObj.style.cursor = "pointer";
        divElem.insertBefore(document.createTextNode("Click on image to obtain at original resolution in new window"), imgObj);
        // <parent><div>Click text<img></div></parent>
        divElem.insertBefore(document.createElement("br"), imgObj);
        // <parent><div>Click text<br><img></div></parent>
        return imgObj;
    }
    /* imgObj is the DOM image object
        origRez is a boolean: if true, open a window immediately to the image's
            original resolution;  if not set or false, then it jumps by intermediates */
    bigimage(imgObj, origRez) {
        //		let nameParts: RegExpMatchArray | null,
        //			filename: string;
        if (origRez == null || typeof (origRez) == "undefined")
            origRez = false;
        //		if ((nameParts = imgObj.src.match(/(.*)\/thumbs(.*)-thumb(.*)/)) == null)
        //			filename = imgObj.src;
        //		else
        //			filename = nameParts[1] + nameParts[2] + nameParts[3];
        if (origRez == true)
            return this.origImage(imgObj);
        return this.makeBigImage(imgObj);
    }
    origImage(imgObj) {
        let origwin, caption;
        this.methodError = "";
        if ((origwin = window.open("", "", "resizable=yes,scrollbars=yes")) == null) {
            this.methodError = "A child window could not be opened which is necessary. Incorrect URL?";
            return;
        }
        const doc = origwin.document;
        doc.close();
        const headElem = doc.getElementsByTagName("head")[0];
        const titleElem = doc.createElement("title");
        headElem.appendChild(titleElem);
        if ((caption = imgObj.getAttribute("data-caption")) == null)
            caption = imgObj.alt;
        titleElem.appendChild(doc.createTextNode("Original Size: " + caption));
        const metaElem = document.createElement("meta");
        metaElem.setAttribute("html-equiv", "Content-Type");
        metaElem.setAttribute("content", "text/html; charset=utf-8");
        headElem.appendChild(metaElem);
        if (typeof iCss == "undefined")
            this.methodError = "iCss class is undefined:  is 'iCss.js' included?";
        const iCSS = new iCss();
        iCSS.createStyleSheet(doc, "\nbody{background-color:black;}\nimg{border:3px solid blue;}");
        const bodyElem = doc.getElementsByTagName("body")[0];
        const divElem = doc.createElement("div");
        divElem.style.marginTop = "0";
        divElem.style.textAlign = "center";
        divElem.style.color = "white";
        divElem.style.font = "bold 1em 'Courier New',Courier,monospace";
        divElem.appendChild(doc.createTextNode(caption));
        divElem.appendChild(doc.createElement("br"));
        const imgElem = doc.createElement("img");
        imgElem.src = imgObj.src;
        imgElem.setAttribute("data-caption", "Huge Image\n\nClick the right mouse button and select " +
            "'Save Picture As...' to save this image to your hard disk\n" +
            "\nURL=" + imgObj.src);
        divElem.appendChild(imgElem);
        bodyElem.appendChild(divElem);
    }
    // this is a support function for bigimage()
    makeBigImage(imgObj) {
        const winResize = 1.25, imgResize = 0.80;
        let paraElem, doc, spanElem, caption = imgObj.getAttribute("data-caption");
        this.methodError = "";
        if (typeof imgObj.src != "string" || imgObj.src.length == 0)
            this.methodError = "The argument for parameter 'imgURL' must be a string with a valid URL";
        if (caption == null || caption.length == 0) {
            caption = "*** this image had no title ***";
            imgObj.setAttribute("data-capture", caption);
        }
        this.imgWin = window.open("" /*window.location.href*/, "", "resizable=no,scrollbars=no;,height=" +
            screen.availHeight * 0.98 + ",width=" + screen.availWidth * 0.98);
        if (this.imgWin == null)
            this.methodError = "A child window could not be opened. Is there a restriction on pop-ups?";
        if (this.methodError.length > 0)
            return;
        (doc = this.imgWin.document).close();
        const headElem = doc.getElementsByTagName("head")[0];
        const titleElem = doc.createElement("title");
        headElem.appendChild(titleElem);
        titleElem.appendChild(doc.createTextNode(caption));
        const metaElem = doc.createElement("meta");
        metaElem.setAttribute("html-equiv", "Content-Type");
        metaElem.setAttribute("content", "text/html; charset=utf-8");
        headElem.appendChild(metaElem);
        if (typeof iCss == "undefined")
            this.methodError = "iCss object is undefined:  is css.js included?";
        /*   returnValue = iCSS.createStyleSheet(doc,
                "html{margin:0;} body{background-color:black;margin:0;} img {border:3px solid blue;}" +
                "\n .rez {color:red;font:bold 100% Verdana,Tahoma,Arial,sans-serif;}"); */
        const bodyElem = doc.getElementsByTagName("body")[0];
        paraElem = doc.createElement("p");
        bodyElem.appendChild(paraElem);
        paraElem.style.color = "yellow";
        paraElem.appendChild(doc.createTextNode("Click image to show at original resolution: "));
        spanElem = doc.createElement("span");
        spanElem.id = "origrez";
        spanElem.className = "rez";
        paraElem.appendChild(spanElem);
        spanElem.appendChild(doc.createTextNode("\u00a0\u00a0current image resolution: "));
        spanElem = doc.createElement("span");
        spanElem.id = "currez";
        spanElem.className = "rez";
        paraElem.appendChild(spanElem);
        spanElem.appendChild(doc.createTextNode("\u00a0\u00a0screen resolution: "));
        spanElem = doc.createElement("span");
        spanElem.className = "rez";
        spanElem.appendChild(document.createTextNode(screen.width + "\u00d7" + screen.height));
        paraElem.appendChild(spanElem);
        paraElem = doc.createElement("p");
        bodyElem.appendChild(paraElem);
        paraElem.style.marginTop = "0";
        paraElem.style.textAlign = "center";
        paraElem.style.color = "white";
        paraElem.style.font = "bold 1em 'Courier New',Courier,monospace";
        paraElem.appendChild(doc.createTextNode(caption));
        paraElem.appendChild(doc.createElement("br"));
        const theImage = doc.createElement("img");
        theImage.src = imgObj.src;
        theImage.id = "the-Image";
        theImage.setAttribute("data-caption", "Huge Image\nClick the right mouse button and select " +
            "'Save Picture As...' to save this image to your hard disk");
        theImage.addEventListener("click", () => {
            return this.origImage(imgObj);
        }, false);
        paraElem.appendChild(theImage);
        doc.getElementById("origrez").appendChild(doc.createTextNode(theImage.width + " \u00d7 " + theImage.height));
        this.resizeImage2Screen(theImage, screen, imgResize);
        this.resizeWin2Image(theImage, this.imgWin, winResize);
        doc.getElementById("currez").appendChild(doc.createTextNode(theImage.width + " \u00d7 " + theImage.height));
    }
    readConfigYaml(yamlConfig) {
        return new Promise((resolve, reject) => {
            fetch(yamlConfig)
                .then(response => response.text())
                .then(data => {
                this.configInfo = yaml.load(data);
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
}
/* Instantiate the class on loading

*/
document.addEventListener("DOMContentLoaded", () => {
    const htmlImgControl = new HtmlImgControl();
    htmlImgControl.readConfigYaml("./bigImageConfig.yaml")
        .then(() => {
        htmlImgControl.setThumbedImages(document.body, true, true);
    }).catch(err => {
        console.log(err);
    });
});
//# sourceMappingURL=bigimage-v2.js.map