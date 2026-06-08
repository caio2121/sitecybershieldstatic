/**
 * Rastreamento GA4 de geração de leads — evento recomendado generate_lead.
 * Sem envio de PII; anti-duplicação; captura de client_id para conciliação offline.
 */
(function (global) {
    'use strict';

    var DEDUPE_MS = 2000;
    var recentEvents = {};
    var suppressCommercialClickUntil = 0;

    var SERVICE_LEAD_MAP = {
        diagnostico: { service_name: 'general', lead_type: 'diagnostic_request' },
        pentest: { service_name: 'pentest', lead_type: 'pentest_request' },
        hardening: { service_name: 'infrastructure', lead_type: 'quote_request' },
        consultoria: { service_name: 'consulting', lead_type: 'quote_request' },
        lgpd: { service_name: 'consulting', lead_type: 'quote_request' }
    };

    var PII_PATTERN = /(@|tel:|mailto:|wa\.me\/\d|\d{10,})/i;

    function getSiteArea() {
        return document.body?.getAttribute('data-site-area') || 'static_site';
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
        var normalized = String(text || '')
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 120);
        if (PII_PATTERN.test(normalized)) {
            return 'cta';
        }
        return normalized || 'cta';
    }

    function sanitizePageLocation() {
        try {
            var url = new URL(window.location.href);
            return url.origin + url.pathname + url.search;
        } catch (e) {
            return window.location.pathname || '';
        }
    }

    function mapServiceToLeadParams(serviceValue) {
        var mapped = SERVICE_LEAD_MAP[serviceValue];
        if (mapped) {
            return {
                service_name: mapped.service_name,
                lead_type: mapped.lead_type
            };
        }
        return {
            service_name: 'general',
            lead_type: 'quote_request'
        };
    }

    function resolveCtaLocation(element) {
        if (!element) return 'unknown';

        if (element.closest('.floating-cta')) return 'floating_button';
        if (element.closest('.hero, #home')) return 'hero';
        if (element.closest('.services, #servicos, .service-card')) return 'services_section';
        if (element.closest('.lead-capture')) return 'lead_capture';
        if (element.closest('#contato, .contact-form, .contact-info')) return 'contact_section';
        if (element.closest('footer')) return 'footer';
        if (element.closest('.standards-cta, .differentiators-cta')) return 'final_cta';
        if (element.closest('.hero-actions')) return 'hero';
        if (element.closest('.report-actions, .final-report, #report-section')) return 'final_cta';
        if (element.closest('.cta-box')) return 'final_cta';

        var section = element.closest('section, header, footer, article, main');
        if (section && section.id) return section.id;
        return 'unknown';
    }

    function isScrollOnlyContactLink(href) {
        if (!href) return false;
        if (href === '#contato') return true;
        if (href.indexOf('#contato') !== -1 && href.indexOf('wa.me') === -1 && href.indexOf('mailto:') === -1 && href.indexOf('tel:') === -1) {
            return true;
        }
        return false;
    }

    function isCommercialEmailLink(link, href) {
        return link.getAttribute('data-contact') === 'email' || (href && href.indexOf('mailto:') === 0);
    }

    function isCommercialPhoneLink(link, href) {
        return link.getAttribute('data-contact') === 'phone' || (href && href.indexOf('tel:') === 0);
    }

    function isCommercialWhatsAppLink(link, href) {
        return link.getAttribute('data-contact') === 'whatsapp' || (href && href.indexOf('wa.me/') !== -1);
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
        if (last && now - last < DEDUPE_MS) {
            return true;
        }
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
        if (typeof global.gtag !== 'function') return;
        global.gtag('event', eventName, {
            site_area: getSiteArea(),
            page_location: sanitizePageLocation(),
            page_title: document.title || '',
            ...params
        });
    }

    function trackGenerateLead(extraParams) {
        var params = {
            lead_source: 'website',
            lead_channel: extraParams.lead_channel || 'cta',
            lead_type: extraParams.lead_type || 'commercial_contact',
            service_name: extraParams.service_name || 'general',
            page_location: sanitizePageLocation(),
            page_title: document.title || ''
        };

        if (extraParams.form_id) params.form_id = extraParams.form_id;
        if (extraParams.form_location) params.form_location = extraParams.form_location;
        if (extraParams.cta_location) params.cta_location = extraParams.cta_location;
        if (extraParams.cta_text) params.cta_text = sanitizeCtaText(extraParams.cta_text);

        var clientId = getGaClientId();
        if (clientId) {
            params.lead_session_id = clientId;
        }

        var dedupeKey = buildDedupeKey(params);
        if (shouldSkipDuplicate(dedupeKey)) {
            return false;
        }

        trackEvent('generate_lead', params);
        return true;
    }

    function trackCommercialLinkClick(link) {
        if (!link || isCommercialClickSuppressed()) return false;

        var href = link.getAttribute('href') || '';
        if (isScrollOnlyContactLink(href)) return false;

        var text = sanitizeCtaText(link.textContent);
        var location = resolveCtaLocation(link);
        var base = { cta_location: location, cta_text: text };

        if (isCommercialWhatsAppLink(link, href)) {
            return trackGenerateLead({
                lead_channel: 'whatsapp',
                lead_type: 'commercial_contact',
                service_name: 'general',
                cta_location: location,
                cta_text: text
            });
        }

        if (isCommercialEmailLink(link, href)) {
            return trackGenerateLead({
                lead_channel: 'email',
                lead_type: 'commercial_contact',
                service_name: 'general',
                cta_location: location,
                cta_text: text
            });
        }

        if (isCommercialPhoneLink(link, href)) {
            return trackGenerateLead({
                lead_channel: 'phone',
                lead_type: 'commercial_contact',
                service_name: 'general',
                cta_location: location,
                cta_text: text
            });
        }

        return false;
    }

    function trackLeadFormSubmit(formId, options) {
        options = options || {};
        suppressCommercialClicks();

        var serviceParams = mapServiceToLeadParams(options.service_value);
        var leadType = options.lead_type || serviceParams.lead_type;
        var serviceName = options.service_name || serviceParams.service_name;

        if (formId === 'leadForm') {
            leadType = 'contact_request';
            serviceName = 'general';
        }

        return trackGenerateLead({
            lead_channel: 'form',
            lead_type: leadType,
            service_name: serviceName,
            form_id: formId,
            form_location: options.form_location || (formId === 'leadForm' ? 'lead_capture' : 'contact_section'),
            cta_text: options.cta_text || 'form_submit'
        });
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

    global.CyberShieldLeadTracking = {
        getGaClientId: getGaClientId,
        mapServiceToLeadParams: mapServiceToLeadParams,
        resolveCtaLocation: resolveCtaLocation,
        isScrollOnlyContactLink: isScrollOnlyContactLink,
        sanitizeCtaText: sanitizeCtaText,
        suppressCommercialClicks: suppressCommercialClicks,
        trackGenerateLead: trackGenerateLead,
        trackCommercialLinkClick: trackCommercialLinkClick,
        trackLeadFormSubmit: trackLeadFormSubmit,
        initDelegatedLeadClickTracking: initDelegatedLeadClickTracking
    };
})(window);
