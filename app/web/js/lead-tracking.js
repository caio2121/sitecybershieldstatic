(function (global) {
    'use strict';

    var DEDUPE_MS = 2000;
    var recentEvents = {};
    var suppressCommercialClickUntil = 0;

    var SERVICE_LEAD_MAP = {
        abscan: { service_name: 'ab_scan', lead_type: 'ab_scan_interest' },
        relatorio: { service_name: 'web_security_report', lead_type: 'report_interest' },
        pentest: { service_name: 'manual_pentest', lead_type: 'pentest_interest' },
        'red-team': { service_name: 'red_team', lead_type: 'red_team_interest' },
        'security-review': { service_name: 'security_review', lead_type: 'security_review_interest' },
        'nao-sei': { service_name: 'service_discovery', lead_type: 'service_discovery_interest' },
        fornecedor: { service_name: 'supplier_approval', lead_type: 'commercial_evidence' }
    };

    var PII_PATTERN = /(@|tel:|mailto:|wa\.me\/\d|\+?\d[\d\s().-]{8,}\d)/i;

    function getSiteArea() {
        return document.body && document.body.getAttribute('data-site-area') || 'static_site';
    }

    function getGaClientId() {
        try {
            var match = document.cookie.match(/(?:^|;\s*)_ga=GA\d+\.\d+\.([^;]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {}
        return '';
    }

    function sanitizeCtaText(text) {
        var normalized = String(text || '').trim().replace(/\s+/g, ' ').slice(0, 120);
        if (PII_PATTERN.test(normalized)) return 'cta';
        return normalized || 'cta';
    }

    function sanitizePageLocation() {
        try {
            var url = new URL(window.location.href);
            return url.origin + url.pathname;
        } catch (e) {
            return window.location.pathname || '';
        }
    }

    function sanitizeLinkTarget(href) {
        var value = String(href || '');
        if (isScrollOnlyContactLink(value)) return '#contato';

        try {
            var url = new URL(value, global.location.href);
            if (url.protocol === 'mailto:') return 'mailto:';
            if (url.protocol === 'tel:') return 'tel:';
            if (url.hostname === 'wa.me' || /(^|\.)whatsapp\.com$/i.test(url.hostname)) return 'whatsapp';
            if (url.origin === global.location.origin) return url.origin + url.pathname;
            return url.origin;
        } catch (e) {
            return '';
        }
    }

    function getAttributionParams() {
        var allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        var params = {};
        try {
            var query = new URLSearchParams(window.location.search);
            allowed.forEach(function (key) {
                var value = query.get(key);
                var sanitized = sanitizeAttributionValue(value);
                if (sanitized) params[key] = sanitized;
            });
        } catch (e) {}
        return params;
    }

    function sanitizeAttributionValue(value) {
        var normalized = String(value || '').trim();
        if (!normalized || normalized.length > 80) return '';
        if (PII_PATTERN.test(normalized) || /(?:https?:\/\/|mailto:|tel:|wa\.me)/i.test(normalized)) return '';
        if (/\d{8,}/.test(normalized)) return '';
        if (!/^[\p{L}\p{N}._~-]+$/u.test(normalized)) return '';
        return normalized;
    }

    function mapServiceToLeadParams(serviceValue) {
        return SERVICE_LEAD_MAP[serviceValue] || {
            service_name: 'general',
            lead_type: 'contact_request'
        };
    }

    function resolveCtaLocation(element) {
        if (!element) return 'unknown';
        if (element.closest('.floating-cta')) return 'floating_button';
        if (element.closest('.hero, #home')) return 'hero';
        if (element.closest('#ab-scan')) return 'ab_scan_section';
        if (element.closest('#relatorio-exemplo')) return 'sample_report_section';
        if (element.closest('#pentest-manual')) return 'manual_pentest_section';
        if (element.closest('#contato, .contact-form, .contact-info')) return 'contact_section';
        if (element.closest('footer')) return 'footer';
        var section = element.closest('section, header, footer, article, main');
        return section && section.id ? section.id : 'unknown';
    }

    function isScrollOnlyContactLink(href) {
        if (!href) return false;
        return href === '#contato' || (href.indexOf('#contato') !== -1 && href.indexOf('wa.me') === -1 && href.indexOf('mailto:') === -1 && href.indexOf('tel:') === -1);
    }

    function isCommercialEmailLink(link, href) {
        return link.getAttribute('data-contact') === 'email' || (href && href.indexOf('mailto:') === 0);
    }

    function isCommercialPhoneLink(link, href) {
        return link.getAttribute('data-contact') === 'phone' || (href && href.indexOf('tel:') === 0);
    }

    function isCommercialWhatsAppLink(link, href) {
        if (link.getAttribute('data-contact') === 'whatsapp') return true;
        try {
            var url = new URL(href, global.location.href);
            return url.hostname === 'wa.me' && /^\/\d+$/.test(url.pathname);
        } catch (e) {
            return false;
        }
    }

    function buildDedupeKey(params) {
        return [
            params.lead_channel || '',
            params.form_id || '',
            params.cta_location || '',
            params.lead_type || '',
            params.service_name || ''
        ].join('|');
    }

    function shouldSkipDuplicate(key) {
        var now = Date.now();
        var last = recentEvents[key];
        if (last && now - last < DEDUPE_MS) return true;
        recentEvents[key] = now;
        return false;
    }

    function suppressCommercialClicks(ms) {
        suppressCommercialClickUntil = Date.now() + (ms || DEDUPE_MS);
    }

    function isCommercialClickSuppressed() {
        return Date.now() < suppressCommercialClickUntil;
    }

    function trackEvent(eventName, params) {
        if (typeof global.gtag !== 'function'
            || typeof global.ABHasAnalyticsConsent !== 'function'
            || !global.ABHasAnalyticsConsent()) return;
        global.gtag('event', eventName, Object.assign({
            site_area: getSiteArea(),
            page_location: sanitizePageLocation(),
            page_title: document.title || ''
        }, params || {}));
    }

    function trackAdsConversion(params) {
        if (typeof global.gtag !== 'function'
            || typeof global.ABHasAnalyticsConsent !== 'function'
            || !global.ABHasAnalyticsConsent()) return;
        var analytics = (global.ABConfig && global.ABConfig.analytics) || {};
        if (!analytics.adsConversionId || !analytics.adsConversionLabel) return;
        global.gtag('event', 'conversion', {
            send_to: analytics.adsConversionId + '/' + analytics.adsConversionLabel,
            lead_channel: params.lead_channel || '',
            lead_type: params.lead_type || '',
            service_name: params.service_name || ''
        });
    }

    function trackGenerateLead(extraParams) {
        extraParams = extraParams || {};
        var params = {
            lead_source: 'website',
            lead_channel: extraParams.lead_channel || 'cta',
            lead_type: extraParams.lead_type || 'contact_request',
            service_name: extraParams.service_name || 'general',
            lead_stage: extraParams.lead_stage || 'intent',
            page_location: sanitizePageLocation(),
            page_title: document.title || ''
        };

        Object.assign(params, getAttributionParams());

        if (extraParams.form_id) params.form_id = extraParams.form_id;
        if (extraParams.form_location) params.form_location = extraParams.form_location;
        if (extraParams.cta_location) params.cta_location = extraParams.cta_location;
        if (extraParams.cta_text) params.cta_text = sanitizeCtaText(extraParams.cta_text);

        var clientId = getGaClientId();
        if (clientId) params.lead_session_id = clientId;

        if (shouldSkipDuplicate(buildDedupeKey(params))) return false;
        trackEvent(extraParams.event_name || 'contact_intent', params);
        if (extraParams.ads_conversion === true) trackAdsConversion(params);
        return true;
    }

    function trackCommercialLinkClick(link) {
        if (!link || isCommercialClickSuppressed()) return false;
        var href = link.getAttribute('href') || '';
        if (isScrollOnlyContactLink(href)) return false;

        var text = sanitizeCtaText(link.textContent);
        var location = resolveCtaLocation(link);

        if (isCommercialWhatsAppLink(link, href)) {
            return trackGenerateLead({
                event_name: 'contact_channel_opened',
                lead_channel: 'whatsapp',
                lead_type: 'commercial_contact',
                service_name: 'general',
                cta_location: location,
                cta_text: text
            });
        }

        if (isCommercialEmailLink(link, href)) {
            return trackGenerateLead({
                event_name: 'contact_channel_opened',
                lead_channel: 'email',
                lead_type: 'commercial_contact',
                service_name: 'general',
                cta_location: location,
                cta_text: text
            });
        }

        if (isCommercialPhoneLink(link, href)) {
            return trackGenerateLead({
                event_name: 'contact_channel_opened',
                lead_channel: 'phone',
                lead_type: 'commercial_contact',
                service_name: 'general',
                cta_location: location,
                cta_text: text
            });
        }

        return false;
    }

    function trackLeadFormPrepared(formId, options) {
        options = options || {};
        suppressCommercialClicks();
        var serviceParams = mapServiceToLeadParams(options.service_value);
        return trackGenerateLead({
            event_name: 'whatsapp_message_prepared',
            lead_channel: 'form',
            lead_type: options.lead_type || serviceParams.lead_type,
            service_name: options.service_name || serviceParams.service_name,
            lead_stage: 'message_prepared',
            form_id: formId,
            form_location: options.form_location || 'contact_section',
            cta_text: options.cta_text || 'form_submit'
        });
    }

    // Compatibilidade para consumidores antigos; o evento agora descreve preparo.
    function trackLeadFormSubmit(formId, options) {
        return trackLeadFormPrepared(formId, options);
    }

    var delegatedClickBound = false;
    function initDelegatedLeadClickTracking() {
        if (delegatedClickBound) return;
        delegatedClickBound = true;
        document.addEventListener('click', function (event) {
            var link = event.target.closest('a');
            if (!link) return;
            trackCommercialLinkClick(link);
        });
    }

    global.ABLeadTracking = {
        getGaClientId: getGaClientId,
        mapServiceToLeadParams: mapServiceToLeadParams,
        resolveCtaLocation: resolveCtaLocation,
        isScrollOnlyContactLink: isScrollOnlyContactLink,
        sanitizeCtaText: sanitizeCtaText,
        sanitizeLinkTarget: sanitizeLinkTarget,
        sanitizeAttributionValue: sanitizeAttributionValue,
        suppressCommercialClicks: suppressCommercialClicks,
        trackGenerateLead: trackGenerateLead,
        trackCommercialLinkClick: trackCommercialLinkClick,
        trackLeadFormSubmit: trackLeadFormSubmit,
        trackLeadFormPrepared: trackLeadFormPrepared,
        getAttributionParams: getAttributionParams,
        initDelegatedLeadClickTracking: initDelegatedLeadClickTracking
    };
})(window);


