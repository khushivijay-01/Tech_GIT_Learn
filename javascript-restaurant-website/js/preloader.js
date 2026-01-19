'use strict';

const preloader = document.querySelector("[data-preload]");

window.addEventListener("load", function() {
    preloader.classList.add("loaded");
    
    setTimeout(function(){
        preloader.style.display = "none";
    }, 500);
});
console.log("preloader js connected");