(function () {
    function activate(link) {
        link.media = 'all';
        link.rel = 'stylesheet';
        link.removeAttribute('data-deferred-style');
        link.removeAttribute('data-lazy-style');
    }

    document.querySelectorAll('link[data-deferred-style]').forEach(function (link) {
        activate(link);
    });

    document.querySelectorAll('.fas, .far, .fab').forEach(function (icon) {
        if (!icon.hasAttribute('aria-hidden')) icon.setAttribute('aria-hidden', 'true');
    });

    window.addEventListener('load', function () {
        document.querySelectorAll('link[data-lazy-style]').forEach(activate);
    }, { once: true });
})();
