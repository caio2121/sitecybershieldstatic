(function () {
    var config = window.ABConfig || {};
    var analyticsConfig = config.analytics || {};
    var storageKey = analyticsConfig.consentStorageKey || 'ab_cookie_consent';

    function track(eventName, params) {
        if (typeof window.gtag !== 'function'
            || typeof window.ABHasAnalyticsConsent !== 'function'
            || !window.ABHasAnalyticsConsent()) return;
        window.gtag('event', eventName, Object.assign({
            site_area: document.body && document.body.getAttribute('data-site-area') || 'static_site'
        }, params || {}));
    }

    function updateConsent(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (e) {}

        if (typeof window.gtag === 'function') {
            var granted = value === 'granted' ? 'granted' : 'denied';
            window.gtag('consent', 'update', {
                analytics_storage: granted,
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
        }
        if (value === 'granted' && typeof window.ABLoadAnalytics === 'function') window.ABLoadAnalytics();
    }

    function readConsent() {
        try {
            var current = localStorage.getItem(storageKey);
            if (current === 'granted' || current === 'denied') return current;
        } catch (e) {}
        return null;
    }

    function initCookieConsent() {
        var currentConsent = readConsent();
        if (currentConsent === 'granted' || currentConsent === 'denied') {
            updateConsent(currentConsent);
            return;
        }

        var banner = document.createElement('div');
        banner.className = 'cookie-consent cookie-consent--static';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Preferencias de cookies');
        banner.innerHTML = ''
            + '<div class="cookie-consent__text">'
            + '<strong>Privacidade e metricas</strong>'
            + '<span>Usamos cookies de analise para entender a navegacao e melhorar o site. Esses cookies serao usados apenas com consentimento.</span>'
            + '<a class="cookie-consent__link" href="/politica-privacidade.html#cookies">Saiba mais na Politica de Privacidade.</a>'
            + '</div>'
            + '<div class="cookie-consent__actions">'
            + '<button type="button" data-cookie-consent="denied">Recusar</button>'
            + '<button type="button" data-cookie-consent="granted">Aceitar</button>'
            + '</div>';
        document.body.appendChild(banner);

        banner.addEventListener('click', function(event) {
            var button = event.target.closest('[data-cookie-consent]');
            if (!button) return;
            var value = button.getAttribute('data-cookie-consent');
            updateConsent(value);
            track('cookie_consent_update', { consent_value: value });
            banner.remove();
        });
    }

    function getContext(element) {
        var section = element.closest('section, header, footer, article, main');
        return section && (section.id || section.className || section.tagName.toLowerCase()) || 'unknown';
    }

    function initClickTracking() {
        if (window.ABLeadTracking) {
            window.ABLeadTracking.initDelegatedLeadClickTracking();
        }

        document.addEventListener('click', function(event) {
            var link = event.target.closest('a');
            if (!link) return;
            var href = link.getAttribute('href') || '';
            var text = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 120);
            var context = getContext(link);
            var leadTracking = window.ABLeadTracking;
            var isScrollContact = leadTracking
                ? leadTracking.isScrollOnlyContactLink(href)
                : (href === '#contato' || href.indexOf('#contato') !== -1);

            if (link.classList.contains('btn') || link.classList.contains('blog-card-link')) {
                track('cta_click', {
                    link_text: text,
                    link_url: leadTracking && typeof leadTracking.sanitizeLinkTarget === 'function'
                        ? leadTracking.sanitizeLinkTarget(href)
                        : (isScrollContact ? '#contato' : ''),
                    page_section: context
                });
            }

            if (href.indexOf('#relatorio-exemplo') !== -1) {
                track('sample_report_viewed', { page_section: context });
            }
        });
    }

    window.ABAnalytics = { track: track, updateConsent: updateConsent };

    document.addEventListener('DOMContentLoaded', function() {
        initCookieConsent();
        initClickTracking();
    });
})();


