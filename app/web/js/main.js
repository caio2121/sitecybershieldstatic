// Smooth scrolling para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
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
    const animateElements = document.querySelectorAll('.service-card, .target-item, .team-member, .stat-item, .value-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Formulários temporariamente desativados para publicação estática no GitHub Pages.
const FORMS_TEMP_DISABLED_MESSAGE = 'Canal de envio temporariamente indisponível. Fale conosco por WhatsApp ou e-mail.';

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

    console.log('Lead form found, modo estático (envio desativado).');

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

    leadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
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

        showLeadMessage(FORMS_TEMP_DISABLED_MESSAGE, 'info');
        return;

        try {
            // Preparar dados para API
            const apiData = {
                nome: data.nome,
                email: data.email,
                empresa: data.empresa,
                cargo: data.cargo,
                tipo: 'lead-capture',
                servico: 'checklist-gratuito'
            };

            const result = await mailSender.sendEmail(apiData);
            
            if (result.success) {
                showLeadMessage('Checklist enviado para seu e-mail! Em breve entraremos em contato.', 'success');
                leadForm.reset();
                clearLeadFormErrors();
                
                // Download simulado do arquivo (será implementado com arquivo real posteriormente)
                // TODO: Implementar download real do checklist
                console.log('Download do checklist seria executado aqui');
                
                // Analytics tracking (opcional)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'download', {
                        'event_category': 'resource',
                        'event_label': 'checklist_ciberseguranca'
                    });
                }
                
                // Focar no primeiro campo após sucesso
                const firstField = leadForm.querySelector('input, select');
                if (firstField) {
                    firstField.focus();
                }
            } else {
                showLeadMessage(result.message, 'error');
            }
        } catch (error) {
            showLeadMessage('Erro inesperado. Tente novamente mais tarde.', 'error');
        } finally {
            setLeadLoading(false);
        }
    });

    // Navegação por teclado melhorada
    leadForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            const nextField = e.target.parentElement.nextElementSibling?.querySelector('input, select');
            if (nextField) {
                nextField.focus();
            }
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

// MailSender API Integration via Email Proxy
class MailSenderAPI {
    constructor() {
        // Determinar a URL da API baseada no ambiente
        const hostname = window.location.hostname;
        const branch = this.getBranchFromHostname(hostname);
        
        if (branch === 'www' || branch === 'main') {
            // Produção - usar subdomínio api
            this.apiUrl = 'https://api.www.cybershieldgroup.com.br/send-email';
        } else {
            // Branch específica - usar subdomínio da branch
            this.apiUrl = `https://api.${branch}.www.cybershieldgroup.com.br/send-email`;
        }
        
        this.clientKey = window.MAILSENDER_CLIENT_KEY || 'CYBERSHIELD_WEBSITE';
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        console.log('MailSenderAPI initialized with URL:', this.apiUrl);
    }

    getBranchFromHostname(hostname) {
        // Extrair branch do hostname (ex: dev.cybershieldgroup.com.br -> dev)
        const parts = hostname.split('.');
        if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'api') {
            return parts[0];
        }
        return 'main';
    }

    async sendEmail(formData) {
        console.log('MailSenderAPI.sendEmail called with:', formData);
        console.log('API URL:', this.apiUrl);
        
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                // Preparar dados para API baseado no tipo de formulário
                let requestBody;
                
                if (formData.tipo === 'lead-capture') {
                    // Formulário de lead capture
                    requestBody = {
                        name: formData.nome,
                        email: formData.email,
                        company: formData.empresa || '',
                        role: formData.cargo || '',
                        service: formData.servico || 'checklist-gratuito',
                        message: `Lead capture: ${formData.nome} da empresa ${formData.empresa} solicitou o checklist gratuito.`,
                        clientKey: this.clientKey
                    };
                } else {
                    // Formulário de contato
                    requestBody = {
                        name: formData.nome,
                        email: formData.email,
                        company: formData.empresa || '',
                        service: this.getServiceName(formData.servico),
                        message: formData.mensagem,
                        clientKey: this.clientKey
                    };
                }
                
                console.log(`Tentativa ${attempt}: Enviando para ${this.apiUrl}`);
                console.log('Request body:', requestBody);
                
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('Response status:', response.status);
                const result = await response.json();
                console.log('Response body:', result);
                
                if (response.ok && result.success) {
                    return { success: true, message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' };
                } else {
                    throw new Error(result.message || 'Erro ao enviar mensagem');
                }
                
            } catch (error) {
                lastError = error;
                console.error(`Tentativa ${attempt} falhou:`, error);
                
                if (attempt < this.retryAttempts) {
                    console.warn(`Tentativa ${attempt} falhou, tentando novamente em ${this.retryDelay * attempt}ms...`);
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }
        
        console.error('Todas as tentativas falharam:', lastError);
        return { success: false, message: 'Erro de conexão. Verifique sua internet e tente novamente.' };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatMessage(formData) {
        let message = '';
        
        if (formData.tipo === 'lead-capture') {
            message = `Novo lead capturado através do site CyberShield:

Nome: ${formData.nome}
E-mail: ${formData.email}
Empresa: ${formData.empresa}
Cargo: ${formData.cargo}
Tipo: ${formData.servico}

---
Enviado através do formulário de lead capture do site CyberShield
Data: ${new Date().toLocaleString('pt-BR')}`;
        } else {
            message = `Novo contato através do site CyberShield:

Nome: ${formData.nome}
E-mail: ${formData.email}`;

            if (formData.empresa) {
                message += `\nEmpresa: ${formData.empresa}`;
            }

            message += `\nServiço de interesse: ${this.getServiceName(formData.servico)}

Mensagem:
${formData.mensagem}

---
Enviado através do formulário de contato do site CyberShield
Data: ${new Date().toLocaleString('pt-BR')}`;
        }

        return message;
    }

    getServiceName(serviceKey) {
        const services = {
            'diagnostico': 'Diagnóstico de Segurança',
            'pentest': 'Pentest',
            'hardening': 'Hardening Técnico',
            'consultoria': 'Consultoria Contínua',
            'checklist-gratuito': 'Checklist de Cibersegurança Gratuito'
        };
        return services[serviceKey] || serviceKey;
    }
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - MailSender Integration via Email Proxy');
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const messageDiv = document.getElementById('contact-message');
    const messageTextarea = document.getElementById('contact-message-text');
    const messageCounter = document.getElementById('message-counter');

    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }

    console.log('Contact form found, modo estático (envio desativado).');

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

    contactForm.addEventListener('submit', async function(e) {
        console.log('Form submit event triggered');
        e.preventDefault();
        console.log('Default form submission prevented');
        
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

        showMessage(FORMS_TEMP_DISABLED_MESSAGE, 'info');
        return;

        try {
            const result = await mailSender.sendEmail(data);
            
            if (result.success) {
                showMessage(result.message, 'success');
                contactForm.reset();
                clearFormErrors();
                
                // Resetar contador
                if (messageCounter) {
                    messageCounter.textContent = '0 / 2000 caracteres';
                    messageCounter.className = 'form-counter';
                }
                
                // Focar no primeiro campo após sucesso
                const firstField = contactForm.querySelector('input, select, textarea');
                if (firstField) {
                    firstField.focus();
                }
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Erro inesperado. Tente novamente mais tarde.', 'error');
        } finally {
            setLoading(false);
        }
    });

    // Navegação por teclado melhorada
    contactForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            const nextField = e.target.parentElement.nextElementSibling?.querySelector('input, select, textarea');
            if (nextField) {
                nextField.focus();
            }
        }
    });
});
