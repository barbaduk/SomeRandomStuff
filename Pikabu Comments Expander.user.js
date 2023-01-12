// ==UserScript==
// @name         Pikabu Comments Expander
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Expand all comments
// @author       Barbaduk
// @match        *://pikabu.ru/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @run-at document-end
// ==/UserScript==

var numAttempts = 0;
var tryNow = function() {
    var elem = document.querySelector('button.comment__more');
    if (elem) {
        while (elem) {
            document.getElementsByClassName('comment__more')[0].click();
        }
    } else {
        numAttempts++;
        if (numAttempts >= 34) {
            console.warn('Giving up after 34 attempts. Could not find:', 'button.comment__more');
        } else {
            setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
        }
    }
};
tryNow();
