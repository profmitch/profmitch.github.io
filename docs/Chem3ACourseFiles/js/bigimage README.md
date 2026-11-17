# the 'bigimage' script README

This script is intended for the purpose of making small or "thumbed" images of all or selected images (placed as IMG elements) within an HTML document, with the thumbed images being clickable so that they produce an initial magnification of the image is an OPENED (separate) unscrollable window, with the image fitting within the extent of the display at its pixel resolution, and with that image being clickable so as to open another (separate) scrollable window which displays the image

This script should be used ONLY for images whose original size (resolution) is too big for the flow of HTML document text or which exceeds the size of browser window, requiring the image to be scrolled to view it.  For images that neatly fit within the flow of HTML document text, these images can and should be excluded from alterations by the script by not altering the image elements to include attribute or attribute values required by the script.

## The HEAD Element of the HTML Document Using 'bigimage-v2.js'

Put this in the `head` element of the HTML doc using the script. Since `js-yaml` is used, it must be loaded from the CDN that has it.

Be sure that the `src` attributes points to the location of the JS file and also that its dependencies are included in the directory/folder.

```html
<script type="importmap">
{
  "imports": {
    "js-yaml": "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm"
  }
}
</script>

<script type="module" src="/dist/html/bigimage-v2.js"></script>
```

## REDUCING THE SIZE OF (THUMBING) SELECTED/ALL DOCUMENT IMAGES

Perform the following steps.

1. [OBSOLETE now]. In the earlier version, the instruction was to add an 'onload' event to the BODY element to call a function that reduces the sizes of all images or selected images to thumbs. This is now handled with an event listener that does it when the web page is loaded.

2. To each image element (IMG tag), add a 'class' attribute with the attribute value having the following format:

<img ... class="thumbImageNNN">
or
<img ... class="thumbImage-NNN">

where NNN is actually a number as decimal between 0 and 1.  Note that the string "thumbImage" is a required prefix (class attribute values are not case-sensitive, but use it as this is readable).  The hyphen character ("-") is optional, but useful in making the class attribute value readable.  The value NNN should be the fraction of the original size of the image.  Thus if NNN="0.35", making the image 35% of its original size, the class attribute value should be

<img ... class="thumbImage0.35">
or
<img ... class="thumbImage-0.35">

The value NNN only needs to be a valid floating point number between 0 and 1. It does not have to have a certain string length, such as trailing zeros. For 50% of the original size, "thumbImage-0.5" is valid as is "thumbImage-0.50".

---

## ONE SIZE FITS ALL

`setDocWideBigImages(document)`
    passing the 'document' object of the document whose images are to be modified, this
    - adds the 'docWideBigImage' handler to the onclick  listener of the images
    - calls setImagePrompt with a default of the "click" text colored blue and at 70% font size
        always returns true

```js
function docWideResize(document) {
    var i,
        docImages = document.getElementsByTagName("img"); // document.images??
    for (i = 0; i < docImages.length; i++) {
        docImages[i].style.width = "100%";
        docImages[i].onclick = docWideBigImage;
//  docImages[i].addEventListener("click", docWideBigImage, false);
        setImagePrompt(docImages[i], "color:blue;font-size:70%;margin-top:2em;");
    }
}

function docWideBigImage(evt) {
    if (evt.srcElement)
        return bigimage(evt.srcElement);
    return bigimage(this);
}

function setImagePrompt(imgObj, styling) {
    var divElem, clonedImageObj;
    divElem = document.createElement("div"); // <div> </div>
    imgObj.parentNode.appendChild(divElem);  // <parent><img><div></div></parent>
    divElem.appendChild(clonedImageObj = imgObj.cloneNode(true));
    // <parent><img><div><imgClone></div></parent>
    imgObj.parentNode.removeChild(imgObj);
    // <parent><div><imgClone></div></parent>
    imgObj = clonedImageObj;
    // <parent><div><img></div></parent>
    if (typeof styling === "string")
        divElem.setAttribute("style", styling);
    imgObj.style.marginTop = 0;
    imgObj.style.cursor = "pointer";
    divElem.insertBefore(document.createTextNode(
                "Click on image to obtain at original resolution in new window"), imgObj);
    // <parent><div>Click text<img></div></parent>
    divElem.insertBefore(document.createElement("br"), imgObj);
    // <parent><div>Click text<br><img></div></parent>
    return imgObj;
}
```

Perform the following ONLY IF **ALL** images in the document are to be reduced
by one single constant factor:

a) Add the following text verbatim to be contained (placed) within the HEAD element of of the HTML document.

```html
<script type="text/javascript">
function initializePage() {
    reducedImageSize = 0.5;  // CHANGE THIS VALUE TO THE FACTOR DESIRED
    var docImages = document.images;
    for (var i = 0; i < docImages.length; i++)
    thumbedImage(docImages[i], reducedImageSize);
    }
</script>
<script type="text/javascript" src="include/bigimage.js"></script>
```

This HTML code is valid with Strict document type HTML.  Note the location of 'bigimage.js' is determined by the user.

b) Go to where the text was added within the HEAD element.  With the first SCRIPT element within the function initializePage(), change the value of variable 'reducedImageSize' to a value between 0 and 1 which represents the size of the images you want.  Thus for a value of '0.1', all thumbed images will be 10% of the original size.

c) Modify the body element (BODY tag) so that it includes the following 'onload' attribute:

<body ... onload="initializePage();" ...>

Note that "..." refers to other possible attributes of the body element.

d) do not perform Steps 1 and 2 above

---

SETTING SELECTED DOCUMENT IMAGES TO BE MAGNIFIED

To enable reduced images to be magnified (in two-stages) in new windows,
perform the following steps:

1. Add the following 'onclick' attribute to the image element (IMG tag) of all reduced images (the text added should be verbatim):

   `<img ... onclick="bigimage(this);" ...>`

    where the '...' represent other attributes of the element.

    A typical 'img' tag in validated Strict HTML will look like this:

   `<img src="path/to/myimage.jpg" onclick="bigimage(this);"
     data-caption="The desired title of my image" class="thumbImage-0.4">`

    Note that the 'data-caption' attribute is required for 'img' elements and its value will be used as a title for the image in the window containing the magnified
images.  So fill in the 'data-caption' attribute properly or the text

    `*** this image had no title ***`

    will appear.

    NOTE: in a prior version, the captioning was done using the image object's 'alt' attribute, but this has changed. Use the "data-caption" attribute instead.  The 'alt' attribute is still used for the image in the pop-up window, but it is not used for the captioning.

2. Optionally--but strongly urged---it is useful to enclose the tag of reduced images within a DIV container that takes the image out of flow (use 'float' in a style attribute) and presents the text "click on image to obtain at original resolution in new window".

For example:

`<div class="leftimglegend">`
Click on image to obtain at original resolution in new window
`<br><img src="path/to/myimage.jpg" onclick="bigimage(this);"`
    class="thumbImage-0.33"
    data-caption="Nine-tenths of cells allowed to form colonies">
</div>

Rather than using inline style attributes for every container, the class attribute is defined and the document or external stylesheet defines the style properties for the classed element.

.leftimglegend { float:left;margin-right:3em;padding:3px;
    font:normal 60% Arial,Helvetica,sans-serif;}
.rightimglegend { float:right;font:normal 60% Arial,Helvetica,sans-serif;
    margin-left:3em;padding:3px;}

So the text "Click on..." is reduced to a small size (60% of normal body text) and both this text and the image are taken out of the flow (to the left) by the float property, with the container having margins and padding appropriate to give room.  Other properties could be added to change color or add borders.  Additional text could be added to caption the image.

---

OTHER USEFUL FUNCTIONS OF THE SCRIPT INTERFACE

* resizeImage2Screen() will basically enlarge the image with aspect preserved
to screen size.  It is utilized by bigimage().

* resizeWin2Image() does just that:  it resizes a window to the image dimensions.

* makeBigImage() requires the image URL and an image "title" as parameters and
provides the engine for two-step image enlargement to the original, both in
separate pop-up windows.

* `imgObj` is the image object.  If null or undefined, an error is returned
* `topFraction` is a value 0->1 that is the starting point from the top of the image to begin the crop and represents a fraction of the height of the image.  If out of range, a default 0 is used.
* `leftFraction` is a value 0->1 that is the starting point from the left of the image to begin the crop and represents a fraction of the width of the image.  If out of range, a default of 0 is used.
* `height` represents the fraction of the height to show starting from the `topFraction`.  Its value should zero to a maximum value, that is (1 - `topFraction`).  If out of range, the value (1 - topFraction) is the default. `width` represents the fraction of the width to show starting from the `leftFraction`.  Its value should zero to a maximum value that is (1 - `leftFraction`).  If out of range, the value (1 - leftFraction) is the default.

```js
function croppedImage(imgObj, topFraction, leftFraction, height, width) {
    if (!imgObj || typeof(imgObj)  == "undefined" || imgObj == null)
        return;
    if (topFraction < 0.0 || topFraction > 1.0)
        topFraction = 0.0;
    if (leftFraction < 0.0 || leftFraction > 1.0)
        leftFraction = 0.0;
    if (height > 1.0 - topFraction)
        height = 1.0 - topFraction;
    if (width > 1.0 - leftFraction)
        width = 1.0 - leftFraction;
    imgObj.style.clip = "rect(" + imgObj.height * topFraction + "px, " +
                imgObj.width \* (width - leftFraction) + "px, " +
                imgObj.height \* (height - topFraction) + "px, " +
                imgObj.width \* leftFraction + "px);";
}
```
