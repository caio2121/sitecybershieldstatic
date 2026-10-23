(function () {
    var config = window.ABConfig || {};
    var analyticsConfig = config.analytics || {};
    var storageKey = analyticsConfig.consentStorageKey || 'ab_cookie_consent';

    function track(eventName, params) {
        if (typeof window.gtag !== 'function') return;
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
    }

    function readConsent() {
        try {
            var current = localStorage.getItem(storageKey);
            if (current === 'granted' || current === 'denied') return current;
        } catch (e) {}
        return null;
    }

    function injectStyles() {
        if (document.getElementById('ab-analytics-style')) return;
        var style = document.createElement('style');
        style.id = 'ab-analytics-style';
        style.textContent = ''
            + '.cookie-consent{position:fixed;right:1rem;bottom:1rem;z-index:2200;width:min(480px,calc(100vw - 2rem));display:flex;align-items:center;gap:1rem;padding:1rem;color:#0b1f3a;background:rgba(255,255,255,.98);border:1px solid rgba(1,34,77,.16);border-radius:8px;box-shadow:0 18px 45px rgba(1,34,77,.18);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}'
            + '.cookie-consent__text{display:grid;gap:.25rem;flex:1;font-size:.9rem;line-height:1.45;}'
            + '.cookie-consent__text span{color:#43546a;}'
            + '.cookie-consent__link{color:#01224d;font-weight:700;text-decoration:underline;width:fit-content;}'
            + '.cookie-consent__actions{display:flex;gap:.5rem;flex-shrink:0;}'
            + '.cookie-consent__actions button{min-height:40px;border-radius:8px;border:1px solid #01224d;padding:.65rem .9rem;cursor:pointer;font-weight:800;}'
            + '.cookie-consent__actions [data-cookie-consent="denied"]{color:#01224d;background:#fff;}'
            + '.cookie-consent__actions [data-cookie-consent="granted"]{color:#fff;background:#01224d;}'
            + '@media (max-width:640px){.cookie-consent{left:1rem;right:1rem;width:auto;flex-direction:column;align-items:stretch}.cookie-consent__actions button{flex:1}}';
        document.head.appendChild(style);
    }

    function initCookieConsent() {
        var currentConsent = readConsent();
        if (currentConsent === 'granted' || currentConsent === 'denied') {
            updateConsent(currentConsent);
            return;
        }

        injectStyles();
        var banner = document.createElement('div');
        banner.className = 'cookie-consent';
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
                    link_url: isScrollContact ? '#contato' : href,
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


