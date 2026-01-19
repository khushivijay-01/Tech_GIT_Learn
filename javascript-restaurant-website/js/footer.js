"use strict";

const footer = document.getElementById("footer");

const copyright = document.createElement("p");
copyright.textContent = `© ${new Date().getFullYear()} Roots & Bistro. All Rights Reserved.`;

footer.appendChild(copyright);
