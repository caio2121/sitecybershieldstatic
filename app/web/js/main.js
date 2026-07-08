function trackGAEvent(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({
        site_area: document.body && document.body.getAttribute('data-site-area') || 'main_site'
    }, params || {}));
}

function getConsentStorageKey() {
    return (window.ABConfig && window.ABConfig.analytics && window.ABConfig.analytics.consentStorageKey) || 'ab_cookie_consent';
}

function updateAnalyticsConsent(value) {
    try {
        localStorage.setItem(getConsentStorageKey(), value);
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

function readAnalyticsConsent() {
    try {
        var current = localStorage.getItem(getConsentStorageKey());
        if (current === 'granted' || current === 'denied') return current;
    } catch (e) {}
    return null;
}

function injectCookieConsentStyles() {
    if (document.getElementById('ab-cookie-consent-style')) return;
    var style = document.createElement('style');
    style.id = 'ab-cookie-consent-style';
    style.textContent = ''
        + '.cookie-consent{position:fixed;right:1.25rem;bottom:5.25rem;z-index:2200;width:min(480px,calc(100vw - 2rem));display:flex;align-items:center;gap:1rem;padding:1rem;color:var(--color-ink,#0b1f3a);background:rgba(255,255,255,.98);border:1px solid rgba(1,34,77,.16);border-radius:8px;box-shadow:0 18px 45px rgba(1,34,77,.18);}'
        + '.cookie-consent__text{display:grid;gap:.25rem;flex:1;font-size:.9rem;line-height:1.45}.cookie-consent__text span{color:var(--color-muted,#43546a)}.cookie-consent__link{color:var(--color-primary,#01224d);font-weight:700;text-decoration:underline;width:fit-content}.cookie-consent__actions{display:flex;gap:.5rem;flex-shrink:0}.cookie-consent__actions .btn{min-height:40px;padding:.65rem .9rem;font-size:.9rem}@media (max-width:640px){.cookie-consent{left:1rem;right:1rem;bottom:1rem;width:auto;flex-direction:column;align-items:stretch}.cookie-consent__actions{justify-content:stretch}.cookie-consent__actions .btn{flex:1}}';
    document.head.appendChild(style);
}

function initCookieConsent() {
    if (window.ABConfig && window.ABConfig.features && window.ABConfig.features.cookieConsent === false) return;

    var currentConsent = readAnalyticsConsent();
    if (currentConsent === 'granted' || currentConsent === 'denied') {
        updateAnalyticsConsent(currentConsent);
        return;
    }

    injectCookieConsentStyles();
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
        + '<button type="button" class="btn btn-outline" data-cookie-consent="denied">Recusar</button>'
        + '<button type="button" class="btn btn-primary" data-cookie-consent="granted">Aceitar</button>'
        + '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function(event) {
        var button = event.target.closest('[data-cookie-consent]');
        if (!button) return;
        var value = button.getAttribute('data-cookie-consent');
        updateAnalyticsConsent(value);
        trackGAEvent('cookie_consent_update', { consent_value: value });
        banner.remove();
    });
}

function getSectionContext(element) {
    var section = element.closest('section, header, footer');
    return section && (section.id || section.className || section.tagName.toLowerCase()) || 'unknown';
}

function initGAEventTracking() {
    if (window.ABLeadTracking) {
        window.ABLeadTracking.initDelegatedLeadClickTracking();
    }

    document.addEventListener('click', function(event) {
        var link = event.target.closest('a');
        if (!link) return;

        var href = link.getAttribute('href') || '';
        var text = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 120);
        var context = getSectionContext(link);
        var leadTracking = window.ABLeadTracking;
        var isScrollContact = leadTracking
            ? leadTracking.isScrollOnlyContactLink(href)
            : (href === '#contato' || href.indexOf('#contato') !== -1);

        if (link.classList.contains('btn')) {
            trackGAEvent('cta_click', {
                link_text: text,
                link_url: isScrollContact ? '#contato' : href,
                page_section: context
            });
        }

        if (href.indexOf('#relatorio-exemplo') !== -1) {
            trackGAEvent('sample_report_viewed', { page_section: context });
        }
    });

    var serviceField = document.getElementById('contact-service');
    if (serviceField) {
        serviceField.addEventListener('change', function() {
            trackGAEvent('service_interest', {
                service_value: serviceField.value,
                service_label: getServiceLabel(serviceField.value)
            });
        });
    }

    ['contactForm'].forEach(function(formId) {
        var form = document.getElementById(formId);
        if (!form) return;
        var hasStarted = false;
        form.addEventListener('input', function() {
            if (hasStarted) return;
            hasStarted = true;
            trackGAEvent('form_start', { form_id: formId });
        }, { once: true });
    });
}

function initMobileMenu() {
    var mobileMenu = document.querySelector('.mobile-menu');
    var nav = document.querySelector('.nav');
    if (!mobileMenu || !nav) return;
    mobileMenu.addEventListener('click', function() {
        var isActive = nav.classList.toggle('active');
        mobileMenu.classList.toggle('active', isActive);
        mobileMenu.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
}

function getCompanyWhatsAppNumber() {
    var config = window.ABConfig || {};
    var number = config.contact && config.contact.phone && (config.contact.phone.whatsapp || config.contact.phone.primary) || '5521920137715';
    return String(number).replace(/\D/g, '');
}

var CONTACT_SERVICE_VALUES = ['abscan', 'relatorio', 'pentest', 'fornecedor'];

function getServiceLabel(serviceValue) {
    var serviceMap = {
        abscan: 'AB Scan',
        relatorio: 'Relatorio de seguranca web',
        pentest: 'PenTest manual sob demanda',
        fornecedor: 'Homologacao de fornecedor ou contrato'
    };
    return serviceMap[serviceValue] || serviceValue || 'Nao informado';
}

function normalizePhoneDigits(phone) {
    return String(phone || '').replace(/\D/g, '');
}

function hasValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function hasValidWhatsApp(whatsapp) {
    return normalizePhoneDigits(whatsapp).length >= 10;
}

function hasPentestDetails(data) {
    return Boolean(data.pentestTipo || data.pentestAlvo || data.pentestDominios || data.pentestEndpoints || data.pentestDocumentacao);
}

function getContactServiceFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var servico = params.get('servico');
    return CONTACT_SERVICE_VALUES.indexOf(servico) !== -1 ? servico : null;
}

function buildWhatsAppMessage(data) {
    var pentestLines = data.servico === 'pentest' && hasPentestDetails(data)
        ? [
            'Contexto opcional para PenTest:',
            data.pentestTipo ? '- Tipo de escopo: ' + data.pentestTipo : '',
            data.pentestAlvo ? '- Alvo principal: ' + data.pentestAlvo : '',
            data.pentestDominios ? '- Dominios/subdominios: ' + data.pentestDominios : '',
            data.pentestEndpoints ? '- Endpoints de API: ' + data.pentestEndpoints : '',
            data.pentestDocumentacao ? '- Documentacao tecnica: ' + data.pentestDocumentacao : '',
            ''
        ].filter(Boolean)
        : [];

    return [
        'Novo contato via site ABREU & BRUM',
        '',
        'Nome: ' + data.nome,
        'E-mail: ' + (data.email || 'Nao informado'),
        'WhatsApp: ' + (data.whatsapp || 'Nao informado'),
        'Empresa: ' + (data.empresa || 'Nao informado'),
        'Interesse: ' + getServiceLabel(data.servico),
        '',
        pentestLines.join('\n'),
        'Mensagem:',
        data.mensagem || 'Nao informada'
    ].filter(function(line) { return line !== ''; }).join('\n');
}

function openWhatsAppWithFormData(data) {
    var number = getCompanyWhatsAppNumber();
    var message = buildWhatsAppMessage(data);
    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
    var w = window.open(url, '_blank', 'noopener,noreferrer');
    return !!w;
}

function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    var formGroup = field.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.add('error');
    var helpElement = formGroup.querySelector('.form-help');
    if (helpElement) {
        helpElement.textContent = message;
        helpElement.style.color = '#b42318';
    }
}

function clearFieldError(fieldId) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    var formGroup = field.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.remove('error');
    var helpElement = formGroup.querySelector('.form-help');
    if (helpElement) {
        helpElement.style.color = '';
    }
}

function initContactForm() {
    var contactForm = document.getElementById('contactForm');
    var submitBtn = document.getElementById('submitBtn');
    var btnText = document.getElementById('btnText');
    var btnLoading = document.getElementById('btnLoading');
    var messageDiv = document.getElementById('contact-message');
    var messageTextarea = document.getElementById('contact-message-text');
    var messageCounter = document.getElementById('message-counter');
    var serviceField = document.getElementById('contact-service');
    var pentestQuestionnaire = document.getElementById('pentest-questionnaire');

    if (!contactForm || !submitBtn) return;

    function showMessage(text, type) {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = 'contact-message ' + (type || 'success');
        messageDiv.style.display = 'block';
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (type !== 'error') {
            window.setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 10000);
        }
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
        if (btnLoading) btnLoading.style.display = isLoading ? 'inline' : 'none';
        submitBtn.setAttribute('aria-label', isLoading ? 'Preparando mensagem, aguarde' : 'Enviar contato');
    }

    function clearFormErrors() {
        contactForm.querySelectorAll('.form-group').forEach(function(group) {
            group.classList.remove('error');
            var helpElement = group.querySelector('.form-help');
            if (helpElement) helpElement.style.color = '';
        });
    }

    function validateContactFields(email, whatsapp) {
        var emailTrim = String(email || '').trim();
        var whatsappTrim = String(whatsapp || '').trim();
        var emailOk = emailTrim && hasValidEmail(emailTrim);
        var whatsappOk = whatsappTrim && hasValidWhatsApp(whatsappTrim);

        if (emailOk || whatsappOk) return true;

        if (!emailTrim && !whatsappTrim) {
            showFieldError('contact-email', 'Informe e-mail ou WhatsApp para contato');
            showFieldError('contact-whatsapp', 'Informe e-mail ou WhatsApp para contato');
            return false;
        }

        if (emailTrim && !emailOk) showFieldError('contact-email', 'Digite um e-mail valido');
        if (whatsappTrim && !whatsappOk) showFieldError('contact-whatsapp', 'WhatsApp deve ter pelo menos 10 digitos');
        return false;
    }

    function validateOptionalPentestFields(data) {
        var isValid = true;
        if (data.pentestDominios && (!/^\d+$/.test(data.pentestDominios) || Number(data.pentestDominios) < 1)) {
            showFieldError('pentest-domains', 'Informe uma quantidade valida');
            isValid = false;
        }
        if (data.pentestEndpoints && (!/^\d+$/.test(data.pentestEndpoints) || Number(data.pentestEndpoints) < 0)) {
            showFieldError('pentest-endpoints', 'Informe uma quantidade valida');
            isValid = false;
        }
        return isValid;
    }

    function validateForm(data) {
        clearFormErrors();
        var isValid = true;

        if (data.nome.trim().length < 2) {
            showFieldError('contact-name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        if (!validateContactFields(data.email, data.whatsapp)) isValid = false;

        if (!data.servico) {
            showFieldError('contact-service', 'Selecione um interesse');
            isValid = false;
        }

        if (!validateOptionalPentestFields(data)) isValid = false;

        if (!data.privacy) {
            showFieldError('contact-privacy', 'E necessario aceitar a politica de privacidade');
            isValid = false;
        }

        if (!isValid) {
            showMessage('Por favor, corrija os campos destacados.', 'error');
            var firstError = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstError) firstError.focus();
        }

        return isValid;
    }

    function updateCounter() {
        if (!messageTextarea || !messageCounter) return;
        messageCounter.textContent = messageTextarea.value.length + ' / 2000 caracteres';
    }

    function togglePentestQuestionnaire() {
        if (!serviceField || !pentestQuestionnaire) return;
        var isPentest = serviceField.value === 'pentest';
        pentestQuestionnaire.hidden = !isPentest;
        if (!isPentest) {
            ['pentest-type', 'pentest-target', 'pentest-domains', 'pentest-endpoints', 'pentest-docs'].forEach(function(id) {
                var field = document.getElementById(id);
                if (!field) return;
                if (field.tagName === 'SELECT') field.selectedIndex = 0;
                else field.value = '';
                clearFieldError(id);
            });
        }
    }

    function initContactFormFromQuery() {
        if (!serviceField) return;
        var servico = getContactServiceFromUrl();
        if (!servico) return;
        serviceField.value = servico;
        togglePentestQuestionnaire();
        trackGAEvent('service_interest', {
            service_value: servico,
            service_label: getServiceLabel(servico),
            source: 'url_prefill'
        });
    }

    if (messageTextarea) {
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    if (serviceField) {
        serviceField.addEventListener('change', togglePentestQuestionnaire);
        togglePentestQuestionnaire();
        initContactFormFromQuery();
    }

    contactForm.addEventListener('blur', function(event) {
        var field = event.target;
        if (!field || !field.id) return;
        clearFieldError(field.id);
    }, true);

    submitBtn.addEventListener('click', function() {
        var formData = new FormData(contactForm);
        var data = {
            nome: String(formData.get('nome') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            whatsapp: String(formData.get('whatsapp') || '').trim(),
            empresa: String(formData.get('empresa') || '').trim(),
            servico: String(formData.get('servico') || '').trim(),
            mensagem: String(formData.get('mensagem') || '').trim(),
            pentestTipo: String(formData.get('pentestTipo') || '').trim(),
            pentestAlvo: String(formData.get('pentestAlvo') || '').trim(),
            pentestDominios: String(formData.get('pentestDominios') || '').trim(),
            pentestEndpoints: String(formData.get('pentestEndpoints') || '').trim(),
            pentestDocumentacao: String(formData.get('pentestDocumentacao') || '').trim(),
            privacy: formData.get('privacy') === 'on'
        };

        if (!validateForm(data)) return;

        setLoading(true);
        if (window.ABLeadTracking) {
            window.ABLeadTracking.trackLeadFormSubmit('contactForm', {
                form_location: 'contact_section',
                service_value: data.servico,
                cta_text: 'Enviar contato'
            });
        }

        openWhatsAppWithFormData(data);
        showMessage('Abrindo WhatsApp com sua mensagem preenchida. Revise antes de enviar.', 'success');
        setLoading(false);
    });

    contactForm.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter') return;
        if (event.target.tagName === 'TEXTAREA') return;
        event.preventDefault();
        var fields = Array.from(contactForm.querySelectorAll('input:not([type="hidden"]), select, textarea, button'));
        var index = fields.indexOf(event.target);
        var next = fields[index + 1];
        if (next) next.focus();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initCookieConsent();
    initGAEventTracking();
    initMobileMenu();
    initContactForm();
    document.body.classList.add('loaded');
});


