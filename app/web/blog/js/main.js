// Smooth scrolling para âncoras (exclui links externos como redes sociais)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.hasAttribute('data-copy-share')) {
            e.preventDefault();
            return;
        }
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
    if (!header) return;
    if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

function normalizePrimaryNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const logo = document.querySelector('.logo');
    const homeUrl = logo
        ? new URL(logo.getAttribute('href') || './', document.baseURI)
        : new URL('./', document.baseURI);
    const siteArea = document.body?.getAttribute('data-site-area') || '';
    const serviceAreas = [
        'services', 'pentest', 'pentest-api', 'pentest-web', 'pentest-network',
        'red-team', 'red-team-exercise', 'security-review',
        'security-review-cloud', 'security-review-active-directory'
    ];
    const items = [
        { label: 'Serviços', path: 'servicos/', current: serviceAreas.includes(siteArea) },
        { label: 'Soluções', path: 'solucoes/', current: siteArea === 'solutions' },
        { label: 'AB Scan', path: 'ab-scan/', className: 'nav-product', current: siteArea === 'ab-scan' },
        { label: 'Como trabalhamos', path: 'metodologia/', current: siteArea === 'methodology' },
        { label: 'Conteúdos', path: 'conteudos/', current: siteArea === 'content' || siteArea === 'blog' },
        { label: 'Sobre', path: 'sobre/', current: siteArea === 'about' },
        { label: 'Solicitar avaliação', path: 'solicitar-proposta/', className: 'nav-cta', current: siteArea === 'proposal' }
    ];

    nav.replaceChildren();
    items.forEach(item => {
        const link = document.createElement('a');
        link.href = new URL(item.path, homeUrl).href;
        link.textContent = item.label;
        if (item.className) link.className = item.className;
        if (item.current) link.setAttribute('aria-current', 'page');
        nav.appendChild(link);
    });
}

// Mobile menu toggle
normalizePrimaryNavigation();
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');

if (mobileMenu && nav) {
    mobileMenu.addEventListener('click', () => {
        const isActive = nav.classList.toggle('active');
        mobileMenu.classList.toggle('active', isActive);
        mobileMenu.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        });
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

function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.className = 'clipboard-fallback';
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
            submitBtn.classList.add('is-complete');
            
            // Reset após 3 segundos
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-complete');
                this.reset();
            }, 3000);
        }, 2000);
    });
}

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

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

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
                    card.classList.remove('is-filtered-out');
                } else {
                    // Verifica se alguma tag do card corresponde à categoria
                    const tags = Array.from(card.querySelectorAll('.blog-tag')).map(t => t.textContent.trim());
                    if (tags.includes(categoria)) {
                        card.classList.remove('is-filtered-out');
                    } else {
                        card.classList.add('is-filtered-out');
                    }
                }
            });
        });
    });
});


