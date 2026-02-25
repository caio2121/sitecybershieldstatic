/**
 * Configurações centralizadas da CyberShield
 * Arquivo para gerenciar dados da empresa, contatos e configurações
 */

window.CyberShieldConfig = {
    // Informações da empresa
    company: {
        name: 'CyberShield',
        fullName: 'CyberShield Consultoria em Segurança Digital',
        cnpj: '61.952.290/0001-68',
        description: 'Consultoria especializada em infraestrutura, segurança da informação e privacidade',
        founded: '2024',
        website: 'https://cybershieldgroup.com.br'
    },

    // Dados de contato
    contact: {
        email: {
            primary: 'contato@cybershieldgroup.com.br',
            support: 'suporte@cybershieldgroup.com.br',
            commercial: 'comercial@cybershieldgroup.com.br'
        },
        phone: {
            primary: '+5521920137715',
            formatted: '(21) 92013-7715',
            whatsapp: '5521920137715'
        },
        address: {
            city: 'Rio de Janeiro',
            state: 'RJ',
            country: 'Brasil'
        }
    },

    // Links de redes sociais
    social: {
        linkedin: 'https://linkedin.com/company/cybershield-brasil',
        twitter: 'https://twitter.com/cybershieldbr',
        github: 'https://github.com/cybershield-brasil',
        youtube: 'https://youtube.com/@cybershieldbrasil',
        whatsapp: {
            number: '5521920137715',
            message: 'Olá! Gostaria de saber mais sobre os serviços de cibersegurança da CyberShield.'
        }
    },

    // Métricas da empresa
    metrics: {
        uptimePercentage: '99.9%',
        securityTools: '25+',
        responseTimeMinutes: '15 min',
        clientsProtected: '150+',
        incidentsBlocked: 2500,
        yearsExperience: 15
    },

    // Configurações de recursos
    features: {
        liveChat: true,
        downloadTracking: true,
        formValidation: true,
        analytics: true,
        cookieConsent: false,
        formsSubmissionEnabled: false
    }
};

/**
 * Utilitários para formatação e links
 */
window.CyberShieldUtils = {
    // Formatar telefone para link tel:
    formatPhoneLink: function(phone) {
        return `tel:${phone}`;
    },

    // Formatar email para link mailto:
    formatEmailLink: function(email, subject = '') {
        return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
    },

    // Gerar link do WhatsApp
    generateWhatsAppLink: function(number, message = '') {
        const cleanNumber = number.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ''}`;
    },

    // Formatar CNPJ
    formatCNPJ: function(cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },

    // Validar email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar telefone brasileiro
    validatePhone: function(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }
};

/**
 * Aplicar configurações automaticamente quando o DOM carregar
 */
document.addEventListener('DOMContentLoaded', function() {
    applyConfig();
});

/**
 * Função principal para aplicar as configurações na página
 */
function applyConfig() {
    const config = window.CyberShieldConfig;
    const utils = window.CyberShieldUtils;

    // Atualizar dados de contato
    updateContactInfo(config, utils);
    
    // Atualizar métricas
    updateMetrics(config);
    
    // Atualizar links de redes sociais
    updateSocialLinks(config, utils);
    
    // Adicionar informações da empresa
    updateCompanyInfo(config);

    console.log('✅ CyberShield Config aplicado com sucesso!');
}

/**
 * Atualizar informações de contato
 */
function updateContactInfo(config, utils) {
    // Email links
    const emailLinks = document.querySelectorAll('[data-contact="email"]');
    emailLinks.forEach(link => {
        const emailType = link.getAttribute('data-email-type') || 'primary';
        const email = config.contact.email[emailType] || config.contact.email.primary;
        link.href = utils.formatEmailLink(email, 'Contato via Site CyberShield');
        if (link.textContent.includes('@') || link.textContent === '') {
            link.textContent = email;
        }
    });

    // Phone links
    const phoneLinks = document.querySelectorAll('[data-contact="phone"]');
    phoneLinks.forEach(link => {
        link.href = utils.formatPhoneLink(config.contact.phone.primary);
        if (link.textContent.includes('(') || link.textContent === '') {
            link.textContent = config.contact.phone.formatted;
        }
    });

    // WhatsApp links
    const whatsappLinks = document.querySelectorAll('[data-contact="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.href = utils.generateWhatsAppLink(
            config.contact.phone.whatsapp, 
            config.social.whatsapp.message
        );
        if (link.textContent === '' || link.textContent === '#') {
            link.textContent = 'WhatsApp Business';
        }
    });
}

/**
 * Atualizar métricas da empresa
 */
function updateMetrics(config) {
    const metrics = config.metrics;
    
    Object.keys(metrics).forEach(metric => {
        const elements = document.querySelectorAll(`[data-metric="${metric}"]`);
        elements.forEach(element => {
            element.textContent = metrics[metric];
        });
    });
}

/**
 * Atualizar links de redes sociais
 */
function updateSocialLinks(config, utils) {
    const socialLinks = document.querySelectorAll('[data-social]');
    socialLinks.forEach(link => {
        const platform = link.getAttribute('data-social');
        if (config.social[platform]) {
            link.href = config.social[platform];
        }
    });
}

/**
 * Atualizar informações da empresa
 */
function updateCompanyInfo(config) {
    // Adicionar CNPJ onde necessário
    const cnpjElements = document.querySelectorAll('[data-company="cnpj"]');
    cnpjElements.forEach(element => {
        element.textContent = config.company.cnpj;
    });

    // Atualizar nome da empresa
    const nameElements = document.querySelectorAll('[data-company="name"]');
    nameElements.forEach(element => {
        element.textContent = config.company.name;
    });

    // Atualizar nome completo
    const fullNameElements = document.querySelectorAll('[data-company="fullName"]');
    fullNameElements.forEach(element => {
        element.textContent = config.company.fullName;
    });
}
