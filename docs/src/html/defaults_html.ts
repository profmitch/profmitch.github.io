import type { HTMLLinkElemAttributes } from "./defaults_html-types";


// 2. Declaring a standalone global variable
declare const APP_VERSION: string;




document.addEventListener("DOMContentLoaded", () => {
   document.getElementById("title")!.appendChild(document.createTextNode(
      document.querySelector('title')!.textContent
   ));

   const linkElemAttributes: HTMLLinkElemAttributes[] = [
      {rel: "icon", type:"image/x-icon", href:"favicon.ico" },
      {rel:"shortcut-icon", type:"image/x-icon", href:"/chemistry/favicon.ico"},
      {rel:"icon", type:"image/png", sizes:"16x16", href:"favicon-16.png"},
      {rel:"icon", type:"image/png", sizes:"32x32", href:"favicon-32.png"},
      {rel:"apple-touch-icon", sizes:"180x180", href:"apple-touch-icon.png"},
      {rel:"icon", type:"image/png", sizes:"192x192", href:"android-icon-192.png"},

      {rel:"stylesheet", href:"css/std.css"},
      {rel:"stylesheet", href:"css/compact.css"},
      {rel:"stylesheet", href:"css/chem.css"}

   ];


   const scriptElemAttributes = [];

   const headElem = document.getElementsByTagName("head")[0];
   let attribValue;
   for (const linkElemData of linkElemAttributes) {
      const linkElem = document.createElement("link");
      headElem.appendChild(linkElem);
      for (const attrib in linkElemData)
         if (attribValue = linkElemData[attrib as keyof HTMLLinkElemAttributes])
            linkElem.setAttribute(attrib, attribValue);
   }
});