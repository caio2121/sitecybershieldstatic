// Formulários usam type="button" para evitar qualquer redirecionamento; o envio é via clique.

// Smooth scrolling para âncoras (exclui links externos como redes sociais)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Não interceptar: links externos ou placeholders (atualizados depois pelo applyRealSocialLinks)
        if (!href || href === '#' || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');

if (mobileMenu && nav) {
    mobileMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Intersection Observer para animações de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .target-item, .team-member, .differentiator-card, .value-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    applyRealSocialLinks();
});

function applyRealSocialLinks() {
    const socialMap = {
        linkedin: 'https://www.linkedin.com/company/cybershieldgroup/',
        instagram: 'https://www.instagram.com/cybershieldltda/',
        facebook: 'https://www.facebook.com/people/Cyber-Shield-Group/61578838183639/'
    };

    document.querySelectorAll('.social-links a[data-social]').forEach(link => {
        const platform = link.getAttribute('data-social');
        if (socialMap[platform]) {
            link.href = socialMap[platform];
            link.target = '_blank';
            link.rel = 'noopener';
        }
    });

    // Fallback para páginas legadas sem data-social.
    document.querySelectorAll('.social-links a').forEach(link => {
        const icon = link.querySelector('i');
        if (!icon) return;

        if (icon.classList.contains('fa-linkedin')) {
            link.href = socialMap.linkedin;
        } else if (
            icon.classList.contains('fa-instagram') ||
            icon.classList.contains('fa-twitter')
        ) {
            link.href = socialMap.instagram;
            if (icon.classList.contains('fa-twitter')) {
                icon.classList.remove('fa-twitter');
                icon.classList.add('fa-instagram');
            }
        } else if (
            icon.classList.contains('fa-facebook') ||
            icon.classList.contains('fa-github') ||
            icon.classList.contains('fa-youtube')
        ) {
            link.href = socialMap.facebook;
            if (icon.classList.contains('fa-github') || icon.classList.contains('fa-youtube')) {
                icon.classList.remove('fa-github', 'fa-youtube');
                icon.classList.add('fa-facebook');
            }
        }

        link.target = '_blank';
        link.rel = 'noopener';
    });
}

function getCompanyWhatsAppNumber() {
    const config = window.CyberShieldConfig || {};
    const number = config?.contact?.phone?.whatsapp || config?.social?.whatsapp?.number || '5521920137715';
    return String(number).replace(/\D/g, '');
}

function buildWhatsAppMessage(formType, data) {
    if (formType === 'lead') {
        return [
            'Novo lead via site CyberShield',
            '',
            `Nome: ${data.nome}`,
            `E-mail: ${data.email}`,
            `Empresa: ${data.empresa}`,
            `Cargo: ${data.cargo}`,
            'Interesse: Checklist de Ciberseguranca Gratuito'
        ].join('\n');
    }

    return [
        'Novo contato via site CyberShield',
        '',
        `Nome: ${data.nome}`,
        `E-mail: ${data.email}`,
        `Empresa: ${data.empresa || 'Nao informado'}`,
        `Servico de interesse: ${data.servico}`,
        '',
        'Mensagem:',
        data.mensagem
    ].join('\n');
}

function openWhatsAppWithFormData(formType, data) {
    const number = getCompanyWhatsAppNumber();
    const message = buildWhatsAppMessage(formType, data);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    return !!w;
}

function triggerChecklistDownload() {
    const config = window.CyberShieldConfig || {};
    const pdfUrl = config?.downloads?.checklistPdf || 'assets/checklists/checklist-ciberseguranca.pdf';
    const filename = config?.downloads?.checklistPdfFilename || 'Checklist-Ciberseguranca-Empresas-CyberShield.pdf';
    const fullUrl = new URL(pdfUrl, window.location.href).href;
    const a = document.createElement('a');
    a.download = filename;
    a.style.display = 'none';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    fetch(fullUrl, { credentials: 'same-origin' })
        .then(r => r.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        })
        .catch(() => {
            a.href = fullUrl;
            a.download = filename;
            a.target = '_blank';
            a.click();
        })
        .finally(() => { if (a.parentNode) a.parentNode.removeChild(a); });
    return true;
}

// Lead capture form
document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('leadForm');
    const leadSubmitBtn = document.getElementById('leadSubmitBtn');
    const leadBtnText = document.getElementById('leadBtnText');
    const leadBtnLoading = document.getElementById('leadBtnLoading');
    
    if (!leadForm) {
        console.error('Lead form not found!');
        return;
    }

    console.log('Lead form found, envio via WhatsApp.');

    function showLeadMessage(text, type = 'success') {
        const messageDiv = document.getElementById('lead-message');
        if (!messageDiv) {
            console.error('Lead message div not found!');
            return;
        }
        
        messageDiv.textContent = text;
        messageDiv.className = `contact-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll para a mensagem
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide após 10 segundos para mensagens de sucesso
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 10000);
        }
    }

    function setLeadLoading(isLoading) {
        leadSubmitBtn.disabled = isLoading;
        leadBtnText.style.display = isLoading ? 'none' : 'inline';
        leadBtnLoading.style.display = isLoading ? 'inline' : 'none';
        
        // Atualizar aria-label para acessibilidade
        if (isLoading) {
            leadSubmitBtn.setAttribute('aria-label', 'Processando solicitação, aguarde...');
        } else {
            leadSubmitBtn.setAttribute('aria-label', 'Baixar checklist gratuito');
        }
    }

    function clearLeadFormErrors() {
        // Remover classes de erro de todos os campos
        leadForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    }

    function showLeadFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            const formGroup = field.closest('.form-group');
            formGroup.classList.add('error');
            
            // Atualizar texto de ajuda
            const helpElement = formGroup.querySelector('.form-help');
            if (helpElement) {
                helpElement.textContent = message;
                helpElement.style.color = '#dc2626';
            }
        }
    }

    function validateLeadForm(formData) {
        clearLeadFormErrors();
        let isValid = true;

        // Validar nome
        if (formData.nome.trim().length < 2) {
            showLeadFieldError('lead-name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        // Validar email
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showLeadFieldError('lead-email', 'Digite um e-mail válido');
            isValid = false;
        }

        // Validar empresa
        if (formData.empresa.trim().length < 2) {
            showLeadFieldError('lead-company', 'Nome da empresa deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        // Validar cargo
        if (!formData.cargo) {
            showLeadFieldError('lead-role', 'Por favor, selecione um cargo');
            isValid = false;
        }

        // Validar política de privacidade
        if (!formData.privacy) {
            showLeadFieldError('lead-privacy', 'É necessário aceitar a política de privacidade');
            isValid = false;
        }

        if (!isValid) {
            showLeadMessage('Por favor, corrija os erros no formulário', 'error');
            // Focar no primeiro campo com erro
            const firstError = leadForm.querySelector('.form-group.error input, .form-group.error select');
            if (firstError) {
                firstError.focus();
            }
        }

        return isValid;
    }

    // Validação em tempo real
    function setupLeadRealTimeValidation() {
        const fields = ['lead-name', 'lead-email', 'lead-company', 'lead-role'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', function() {
                    const formData = new FormData(leadForm);
                    const value = formData.get(field.name);
                    
                    // Validar campo específico
                    if (field.name === 'nome' && value.trim().length < 2 && value.trim().length > 0) {
                        showLeadFieldError(fieldId, 'Nome deve ter pelo menos 2 caracteres');
                    } else if (field.name === 'email' && value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                        showLeadFieldError(fieldId, 'Digite um e-mail válido');
                    } else if (field.name === 'empresa' && value.trim().length < 2 && value.trim().length > 0) {
                        showLeadFieldError(fieldId, 'Nome da empresa deve ter pelo menos 2 caracteres');
                    } else if (field.name === 'cargo' && !value) {
                        showLeadFieldError(fieldId, 'Por favor, selecione um cargo');
                    } else {
                        // Remover erro se válido
                        const formGroup = field.closest('.form-group');
                        formGroup.classList.remove('error');
                        const helpElement = formGroup.querySelector('.form-help');
                        if (helpElement) {
                            helpElement.style.color = '#6b7280';
                        }
                    }
                });
            }
        });
    }

    setupLeadRealTimeValidation();

    leadSubmitBtn.addEventListener('click', function() {
        const formData = new FormData(leadForm);
        const data = {
            nome: formData.get('nome').trim(),
            email: formData.get('email').trim(),
            empresa: formData.get('empresa').trim(),
            cargo: formData.get('cargo'),
            privacy: formData.get('privacy') === 'on'
        };

        if (!validateLeadForm(data)) {
            return;
        }

        setLeadLoading(true);
        const downloadOk = triggerChecklistDownload();
        openWhatsAppWithFormData('lead', data);

        if (downloadOk) {
            showLeadMessage('Checklist enviado para download e WhatsApp aberto em nova aba. Confira e envie a mensagem para registrar seu lead.', 'success');
        } else {
            showLeadMessage('Ocorreu um erro no download. Tente novamente ou entre em contato pelo WhatsApp.', 'error');
        }
        setLeadLoading(false);
    });

    // Navegação por teclado: Enter vai para o próximo campo ou dispara o envio
    leadForm.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const nextField = e.target.parentElement.nextElementSibling?.querySelector('input, select');
        if (nextField) {
            nextField.focus();
        } else {
            leadSubmitBtn.click();
        }
    });
});

// Função para mostrar mensagem de agradecimento
function showThankYouMessage() {
    const message = document.createElement('div');
    message.className = 'thank-you-message';
    message.innerHTML = `
        <div class="thank-you-content">
            <i class="fas fa-check-circle"></i>
            <h3>Obrigado!</h3>
            <p>Seu checklist foi enviado para seu e-mail. Em breve entraremos em contato para uma avaliação personalizada.</p>
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Remover automaticamente após 10 segundos
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 10000);
}

// Parallax effect para hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (hero && heroParticles) {
        heroParticles.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation para stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animar contadores quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            
            if (text === '100%' || text === '0' || text === '24/7' || text === '∞') {
                // Para valores especiais, apenas adicionar classe de animação
                statNumber.classList.add('animate-pulse');
            } else {
                // Para números, animar contador
                const target = parseInt(text);
                animateCounter(statNumber, target);
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// Hover effects para cards
document.querySelectorAll('.service-card, .target-item, .team-member').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-pulse {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .nav.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(15, 23, 42, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(30, 41, 59, 0.3);
    }
    
    body.loaded .hero {
        animation: fadeIn 1s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Contact form via WhatsApp');
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const messageDiv = document.getElementById('contact-message');
    const messageTextarea = document.getElementById('contact-message-text');
    const messageCounter = document.getElementById('message-counter');

    if (!contactForm || !submitBtn) {
        console.error('Contact form or submit button not found!');
        return;
    }

    console.log('Contact form found, envio via WhatsApp.');

    // Contador de caracteres para a mensagem
    if (messageTextarea && messageCounter) {
        function updateCounter() {
            const length = messageTextarea.value.length;
            const maxLength = 2000;
            const remaining = maxLength - length;
            
            messageCounter.textContent = `${length} / ${maxLength} caracteres`;
            
            // Atualizar classes CSS baseado no limite
            messageCounter.className = 'form-counter';
            if (length > maxLength * 0.9) {
                messageCounter.classList.add('warning');
            }
            if (length > maxLength) {
                messageCounter.classList.add('error');
            }
        }

        messageTextarea.addEventListener('input', updateCounter);
        updateCounter(); // Inicializar contador
    }

    function showMessage(text, type = 'success') {
        messageDiv.textContent = text;
        messageDiv.className = `contact-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll para a mensagem
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide após 10 segundos para mensagens de sucesso
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 10000);
        }
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoading.style.display = isLoading ? 'inline' : 'none';
        
        // Atualizar aria-label para acessibilidade
        if (isLoading) {
            submitBtn.setAttribute('aria-label', 'Enviando mensagem, aguarde...');
        } else {
            submitBtn.setAttribute('aria-label', 'Enviar mensagem');
        }
    }

    function clearFormErrors() {
        // Remover classes de erro de todos os campos
        contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            const formGroup = field.closest('.form-group');
            formGroup.classList.add('error');
            
            // Atualizar texto de ajuda
            const helpElement = formGroup.querySelector('.form-help');
            if (helpElement) {
                helpElement.textContent = message;
                helpElement.style.color = '#dc2626';
            }
        }
    }

    function validateForm(formData) {
        clearFormErrors();
        let isValid = true;

        // Validar nome
        if (formData.nome.trim().length < 2) {
            showFieldError('contact-name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        // Validar email
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showFieldError('contact-email', 'Digite um e-mail válido');
            isValid = false;
        }

        // Validar serviço
        if (!formData.servico) {
            showFieldError('contact-service', 'Por favor, selecione um serviço');
            isValid = false;
        }

        // Validar mensagem
        if (formData.mensagem.trim().length < 10) {
            showFieldError('contact-message-text', 'Mensagem deve ter pelo menos 10 caracteres');
            isValid = false;
        }

        // Validar política de privacidade
        if (!formData.privacy) {
            showFieldError('contact-privacy', 'É necessário aceitar a política de privacidade');
            isValid = false;
        }

        if (!isValid) {
            showMessage('Por favor, corrija os erros no formulário', 'error');
            // Focar no primeiro campo com erro
            const firstError = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstError) {
                firstError.focus();
            }
        }

        return isValid;
    }

    // Validação em tempo real
    function setupRealTimeValidation() {
        const fields = ['contact-name', 'contact-email', 'contact-service', 'contact-message-text'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', function() {
                    const formData = new FormData(contactForm);
                    const value = formData.get(field.name);
                    
                    // Validar campo específico
                    if (field.name === 'nome' && value.trim().length < 2 && value.trim().length > 0) {
                        showFieldError(fieldId, 'Nome deve ter pelo menos 2 caracteres');
                    } else if (field.name === 'email' && value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                        showFieldError(fieldId, 'Digite um e-mail válido');
                    } else if (field.name === 'servico' && !value) {
                        showFieldError(fieldId, 'Por favor, selecione um serviço');
                    } else if (field.name === 'mensagem' && value.trim().length < 10 && value.trim().length > 0) {
                        showFieldError(fieldId, 'Mensagem deve ter pelo menos 10 caracteres');
                    } else {
                        // Remover erro se válido
                        const formGroup = field.closest('.form-group');
                        formGroup.classList.remove('error');
                        const helpElement = formGroup.querySelector('.form-help');
                        if (helpElement) {
                            helpElement.style.color = '#6b7280';
                        }
                    }
                });
            }
        });
    }

    setupRealTimeValidation();

    submitBtn.addEventListener('click', function() {
        const formData = new FormData(contactForm);
        const data = {
            nome: formData.get('nome').trim(),
            email: formData.get('email').trim(),
            empresa: formData.get('empresa').trim(),
            servico: formData.get('servico'),
            mensagem: formData.get('mensagem').trim(),
            privacy: formData.get('privacy') === 'on'
        };
        
        console.log('Form data extracted:', data);

        if (!validateForm(data)) {
            return;
        }

        setLoading(true);
        openWhatsAppWithFormData('contact', data);
        showMessage('Abrindo WhatsApp com sua mensagem preenchida em nova aba...', 'success');
        setLoading(false);
    });

    // Navegação por teclado: Enter vai para o próximo campo ou dispara o envio (exceto em textarea)
    contactForm.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;
        if (e.target.tagName === 'TEXTAREA') return; // Enter em textarea quebra linha
        e.preventDefault();
        const nextField = e.target.parentElement.nextElementSibling?.querySelector('input, select, textarea');
        if (nextField) {
            nextField.focus();
        } else {
            submitBtn.click();
        }
    });
});
