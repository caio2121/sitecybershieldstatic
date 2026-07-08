window.ABConfig = {
    company: {
        name: 'ABREU & BRUM',
        fullName: 'ABREU & BRUM Cybersecurity, PenTest e Consultoria',
        cnpj: '61.952.290/0001-68',
        description: 'AB Scan: avaliação de segurança web com relatórios profissionais e PenTest manual complementar.',
        website: 'https://abreuebrum.com.br'
    },
    product: {
        name: 'AB Scan',
        primaryCta: 'Solicitar avaliação'
    },
    contact: {
        email: {
            primary: 'contato@abreuebrum.com.br',
            privacy: 'privacidade@abreuebrum.com.br'
        },
        phone: {
            primary: '+5521920137715',
            formatted: '(21) 92013-7715',
            whatsapp: '5521920137715'
        },
        address: {
            city: 'Sao Paulo',
            state: 'SP',
            country: 'Brasil'
        }
    },
    social: {
        linkedin: '',
        instagram: '',
        facebook: '',
        whatsapp: {
            number: '5521920137715',
            message: 'Olá! Quero solicitar uma avaliação de segurança web, receber um relatório ou entender o PenTest manual.'
        }
    },
    features: {
        analytics: true,
        cookieConsent: true,
        formsSubmissionEnabled: true
    },
    analytics: {
        measurementId: 'G-K46VQ6H8MS',
        adsConversionId: 'AW-18216339237',
        adsConversionLabel: '',
        consentStorageKey: 'ab_cookie_consent'
    }
};

window.ABUtils = {
    formatPhoneLink: function(phone) {
        return 'tel:' + phone;
    },
    formatEmailLink: function(email, subject) {
        return 'mailto:' + email + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    },
    generateWhatsAppLink: function(number, message) {
        var cleanNumber = String(number || '').replace(/\D/g, '');
        var encodedMessage = encodeURIComponent(message || '');
        return 'https://wa.me/' + cleanNumber + (message ? '?text=' + encodedMessage : '');
    },
    validateEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
    },
    validatePhone: function(phone) {
        var cleanPhone = String(phone || '').replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 13;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var config = window.ABConfig;
    var utils = window.ABUtils;

    document.querySelectorAll('[data-company="cnpj"]').forEach(function(element) {
        element.textContent = config.company.cnpj;
    });

    document.querySelectorAll('[data-company="name"]').forEach(function(element) {
        element.textContent = config.company.name;
    });

    document.querySelectorAll('[data-contact="email"]').forEach(function(link) {
        var emailType = link.getAttribute('data-email-type') || 'primary';
        var email = config.contact.email[emailType] || config.contact.email.primary;
        link.href = utils.formatEmailLink(email, 'Contato via site ABREU & BRUM');
        if (!link.textContent.trim() || link.textContent.indexOf('@') !== -1) {
            link.textContent = email;
        }
    });

    document.querySelectorAll('[data-contact="phone"]').forEach(function(link) {
        link.href = utils.formatPhoneLink(config.contact.phone.primary);
        if (!link.textContent.trim() || link.textContent.indexOf('(') !== -1) {
            link.textContent = config.contact.phone.formatted;
        }
    });

    document.querySelectorAll('[data-contact="whatsapp"]').forEach(function(link) {
        link.href = utils.generateWhatsAppLink(config.contact.phone.whatsapp, config.social.whatsapp.message);
        if (!link.textContent.trim() || link.textContent === '#') {
            link.textContent = 'WhatsApp Business';
        }
    });

    document.querySelectorAll('[data-social]').forEach(function(link) {
        var platform = link.getAttribute('data-social');
        var href = config.social[platform];
        if (href) {
            link.href = href;
            link.hidden = false;
        } else {
            link.removeAttribute('href');
            link.hidden = true;
        }
    });
});


