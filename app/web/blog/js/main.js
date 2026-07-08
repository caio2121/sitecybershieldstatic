// Smooth scrolling para Ã¢ncoras (exclui links externos como redes sociais)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.hasAttribute('data-copy-share')) {
            e.preventDefault();
            return;
        }
        const href = this.getAttribute('href');
        // NÃ£o interceptar: links externos ou placeholders (atualizados depois pelo applyRealSocialLinks)
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
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 10px 30px rgba(1, 34, 77, 0.08)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.96)';
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

function applyRealSocialLinks() {
    const socialMap = {
        linkedin: 'mailto:contato@abreuebrum.com.br',
        instagram: 'tel:+5521920137715',
        facebook: '../politica-privacidade.html'
    };

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

        if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
            link.removeAttribute('target');
            link.removeAttribute('rel');
        } else {
            link.target = '_blank';
            link.rel = 'noopener';
        }
    });
}

// Intersection Observer para animaÃ§Ãµes de entrada
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

function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const copied = document.execCommand('copy');
            document.body.removeChild(textarea);
            copied ? resolve() : reject(new Error('copy failed'));
        } catch (error) {
            document.body.removeChild(textarea);
            reject(error);
        }
    });
}

function showShareToast(message) {
    let toast = document.querySelector('.post-share-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'post-share-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showShareToast._timer);
    showShareToast._timer = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 3200);
}

function initPostShareCopy() {
    document.querySelectorAll('[data-copy-share]').forEach(link => {
        if (link.dataset.shareBound === 'true') return;
        link.dataset.shareBound = 'true';

        link.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const url = link.getAttribute('data-copy-share');
            if (!url) return;

            const title = document.querySelector('.post-header h1')?.textContent?.trim() || 'ABREU & BRUM';
            const defaultLabel = link.getAttribute('aria-label') || 'Compartilhar no Instagram';

            if (navigator.share) {
                try {
                    await navigator.share({ title, text: title, url });
                    return;
                } catch (error) {
                    if (error && error.name === 'AbortError') return;
                }
            }

            try {
                await copyTextToClipboard(url);
                link.setAttribute('aria-label', 'Link copiado!');
                link.classList.add('post-share-link--copied');
                showShareToast('Link copiado! Cole no Instagram para compartilhar.');
                setTimeout(() => {
                    link.setAttribute('aria-label', defaultLabel);
                    link.classList.remove('post-share-link--copied');
                }, 2000);
            } catch (error) {
                window.prompt('Copie o link para compartilhar no Instagram:', url);
            }
        });
    });
}

function bootBlogUi() {
    const animateElements = document.querySelectorAll('.service-card, .target-item, .team-member, .stat-item, .value-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    applyRealSocialLinks();
    initPostShareCopy();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBlogUi);
} else {
    bootBlogUi();
}

// Form validation e feedback
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular envio
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
            submitBtn.style.background = '#c79933';
            
            // Reset apÃ³s 3 segundos
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                this.reset();
            }, 3000);
        }, 2000);
    });
}

// Lead capture form
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validar campos
        const nome = this.querySelector('input[name="nome"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const empresa = this.querySelector('input[name="empresa"]').value;
        const cargo = this.querySelector('select[name="cargo"]').value;
        
        if (!nome || !email || !empresa || !cargo) {
            alert('Por favor, preencha todos os campos obrigatÃ³rios.');
            return;
        }
        
        // Simular envio
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitBtn.disabled = true;
        
        // Simular download do checklist
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-download"></i> Download Iniciado!';
            submitBtn.style.background = '#c79933';
            
            // Simular download do arquivo
            const link = document.createElement('a');
            link.href = '../assets/checklists/checklist-ciberseguranca.html';
            link.download = 'checklist-seguranca-web-abscan.html';
            link.click();
            
            // Reset apÃ³s 5 segundos
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                this.reset();
                
                // Mostrar agradecimento
                showThankYouMessage();
            }, 5000);
        }, 2000);
    });
}

// FunÃ§Ã£o para mostrar mensagem de agradecimento
function showThankYouMessage() {
    const message = document.createElement('div');
    message.className = 'thank-you-message';
    message.innerHTML = `
        <div class="thank-you-content">
            <i class="fas fa-check-circle"></i>
            <h3>Obrigado!</h3>
            <p>Seu checklist foi enviado para seu e-mail. Em breve entraremos em contato para uma avaliaÃ§Ã£o personalizada.</p>
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Remover automaticamente apÃ³s 10 segundos
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

// Animar contadores quando visÃ­veis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            
            if (text === '100%' || text === '0' || text === '24/7' || text === 'âˆž') {
                // Para valores especiais, apenas adicionar classe de animaÃ§Ã£o
                statNumber.classList.add('animate-pulse');
            } else {
                // Para nÃºmeros, animar contador
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

// Adicionar CSS para animaÃ§Ãµes
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
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 16px 36px rgba(1, 34, 77, 0.12);
        border-top: 1px solid rgba(1, 34, 77, 0.08);
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

// Filtro de categorias do blog

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove classe active de todos
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const categoria = this.textContent.trim();
            blogCards.forEach(card => {
                if (categoria === 'Todos') {
                    card.style.display = '';
                } else {
                    // Verifica se alguma tag do card corresponde Ã  categoria
                    const tags = Array.from(card.querySelectorAll('.blog-tag')).map(t => t.textContent.trim());
                    if (tags.includes(categoria)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
});


