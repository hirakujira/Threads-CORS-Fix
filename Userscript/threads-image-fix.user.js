// ==UserScript==
// @name         Threads Image Fix
// @namespace    https://hiraku.dev/
// @version      1.0.1
// @description  Fix Threads image loading issues (CORS)
// @author       Hiraku
// @match        https://www.threads.net/*
// @match        https://threads.net/*
// @match        https://www.threads.com/*
// @match        https://threads.com/*
// @grant        GM_xmlhttpRequest
// @connect      fbcdn.net
// @connect      cdninstagram.com
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const processedImages = new WeakSet();

    function fixImage(img) {
        if (processedImages.has(img)) return;
        processedImages.add(img);

        const src = img.src || img.dataset.src;
        if (!src) return;
        if (!src.includes('fbcdn.net') && !src.includes('cdninstagram.com')) return;

        img.crossOrigin = 'anonymous';

        img.onerror = function() {
            if (img.dataset.retried) return;
            img.dataset.retried = 'true';

            GM_xmlhttpRequest({
                method: 'GET',
                url: src,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        img.src = URL.createObjectURL(response.response);
                    }
                }
            });
        };
    }

    function processImages() {
        document.querySelectorAll('img').forEach(fixImage);
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'IMG') {
                    fixImage(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(fixImage);
                }
            });
        });
    });

    if (document.body) {
        processImages();
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            processImages();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();
