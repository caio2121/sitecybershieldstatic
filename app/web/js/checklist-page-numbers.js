(function () {
    var docNo = (document.querySelector('meta[name="document-number"]')?.getAttribute('content') || '').trim();
    var pages = Array.from(document.querySelectorAll('section.page'));
    var total = pages.length;

    pages.forEach(function (page, index) {
        page.querySelectorAll('.pageNumber').forEach(function (element) {
            element.textContent = String(index + 1);
        });
        page.querySelectorAll('.totalPages').forEach(function (element) {
            element.textContent = String(total);
        });
        page.querySelectorAll('.docNo').forEach(function (element) {
            element.textContent = docNo;
        });
    });
})();
