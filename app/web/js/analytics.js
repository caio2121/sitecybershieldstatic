(function () {
    const storageKey = 'cs_cookie_consent';

    function track(eventName, params = {}) {
        if (typeof window.gtag !== 'function') return;
        window.gtag('event', eventName, {
            site_area: document.body?.getAttribute('data-site-area') || 'static_site',
            ...params
        });
    }

    function updateConsent(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (e) {}

        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: value === 'granted' ? 'granted' : 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
        }
    }

    function readConsent() {
        try {
            return localStorage.getItem(storageKey);
        } catch (e) {
            return null;
        }
    }

    function injectStyles() {
        if (document.getElementById('cs-analytics-style')) return;
        const style = document.createElement('style');
        style.id = 'cs-analytics-style';
        style.textContent = `
            .cookie-consent {
                position: fixed;
                right: 1rem;
                bottom: 1rem;
                z-index: 2200;
                width: min(480px, calc(100vw - 2rem));
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                color: #0f172a;
                background: rgba(255,255,255,.98);
                border: 1px solid rgba(15,23,42,.12);
                border-radius: 8px;
                box-shadow: 0 18px 45px rgba(15,23,42,.22);
                font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .cookie-consent__text { display: grid; gap: .25rem; flex: 1; font-size: .9rem; line-height: 1.45; }
            .cookie-consent__text span { color: #475569; }
            .cookie-consent__actions { display: flex; gap: .5rem; flex-shrink: 0; }
            .cookie-consent__actions button {
                min-height: 40px;
                border-radius: 8px;
                border: 1px solid #10b981;
                padding: .65rem .9rem;
                cursor: pointer;
                font-weight: 700;
            }
            .cookie-consent__actions [data-cookie-consent="denied"] { color: #0f172a; background: #fff; }
            .cookie-consent__actions [data-cookie-consent="granted"] { color: #fff; background: #10b981; }
            @media (max-width: 640px) {
                .cookie-consent { left: 1rem; right: 1rem; width: auto; flex-direction: column; align-items: stretch; }
                .cookie-consent__actions button { flex: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    function initCookieConsent() {
        const currentConsent = readConsent();
        if (currentConsent === 'granted' || currentConsent === 'denied') {
            updateConsent(currentConsent);
            return;
        }

        injectStyles();
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Preferências de cookies');
        banner.innerHTML = `
            <div class="cookie-consent__text">
                <strong>Privacidade e métricas</strong>
                <span>Usamos cookies de analytics para entender visitas e melhorar o site. Você pode aceitar ou recusar.</span>
            </div>
            <div class="cookie-consent__actions">
                <button type="button" data-cookie-consent="denied">Recusar</button>
                <button type="button" data-cookie-consent="granted">Aceitar</button>
            </div>
        `;
        document.body.appendChild(banner);

        banner.addEventListener('click', event => {
            const button = event.target.closest('[data-cookie-consent]');
            if (!button) return;
            const value = button.getAttribute('data-cookie-consent');
            updateConsent(value);
            track('cookie_consent_update', { consent_value: value });
            banner.remove();
        });
    }

    function getContext(element) {
        const section = element.closest('section, header, footer, article, main');
        return section?.id || section?.className || section?.tagName?.toLowerCase() || 'unknown';
    }

    function initClickTracking() {
        document.addEventListener('click', event => {
            const link = event.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href') || '';
            const text = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 120);
            const context = getContext(link);

            if (href.includes('wa.me/')) {
                track('click_whatsapp', { link_text: text, link_url: href, page_section: context });
            } else if (href.startsWith('mailto:')) {
                track('click_email', { link_text: text, page_section: context });
            } else if (href.startsWith('tel:')) {
                track('click_phone', { link_text: text, page_section: context });
            }

            if (link.classList.contains('btn') || link.classList.contains('blog-card-link')) {
                track('cta_click', { link_text: text, link_url: href, page_section: context });
            }

            if (href.includes('assets/checklists/') || href.endsWith('.pdf')) {
                track('download_or_checklist_open', { link_text: text, link_url: href, page_section: context });
            }
        });
    }

    window.CyberShieldAnalytics = { track, updateConsent };

    document.addEventListener('DOMContentLoaded', () => {
        initCookieConsent();
        initClickTracking();
    });
})();
