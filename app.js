// Enhanced Portfolio JavaScript with Modern Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializePortfolio();
});

// Main initialization function
function initializePortfolio() {
    // Core features
    initNavigation();
    initScrollEffects();
    initTypewriter();
    initAnimations();
    initSkillBars();
    initContactForm();
    initInteractions();
    initPerformanceOptimizations();
    
    // Welcome user
    setTimeout(() => {
        showNotification('Welcome to Ajay Mondal\'s Portfolio! 🚀', 'success');
    }, 1500);
    
    console.log('🎉 Portfolio initialized successfully!');
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', !isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight || 80;
                    const offsetTop = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    setTimeout(() => {
                        updateActiveNavLink();
                    }, 100);
                }
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll effects and navbar behavior
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top');
    const scrollDown = document.querySelector('.scroll-down');
    
    let ticking = false;
    let lastScrollTop = 0;

    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset;
                
                // Navbar effects
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Scroll to top button
                if (scrollTop > 400) {
                    scrollTopBtn.classList.add('show');
                } else {
                    scrollTopBtn.classList.remove('show');
                }

                // Update active navigation
                updateActiveNavLink();
                
                // Parallax effect for hero background
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    const heroHeight = heroSection.offsetHeight;
                    if (scrollTop < heroHeight) {
                        const parallaxSpeed = scrollTop * 0.5;
                        const heroBg = document.querySelector('.hero-bg-animation');
                        if (heroBg) {
                            heroBg.style.transform = `translateY(${parallaxSpeed}px)`;
                        }
                    }
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hero scroll button
    if (scrollDown) {
        scrollDown.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const navbarHeight = navbar.offsetHeight || 80;
                const offsetTop = aboutSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.pageYOffset + 100;

    let activeSectionId = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            activeSectionId = sectionId;
        }
    });

    // Update active states
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (activeSectionId && link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced typewriter effect
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    const cursor = document.querySelector('.cursor');
    
    if (!typewriterElement) return;

    const texts = [
        'Ajay Mondal',
        'BCA Student', 
        'Web Developer',
        'Content Creator',
        'Python Programmer',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typeSpeed);
    }

    // Start typewriter after delay
    setTimeout(type, 1000);

    // Animate cursor
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
}

// Initialize scroll-triggered animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special handling for staggered animations
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .detail-card, .skills-category, .project-card, .achievement-item,
        .category-item, .youtube-visual, .contact-item
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Add stagger class to containers
    const staggerContainers = document.querySelectorAll(`
        .about-details, .skills-grid, .projects-grid, .achievements-grid
    `);
    
    staggerContainers.forEach(container => {
        container.classList.add('stagger-children');
        observer.observe(container);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillsSection = document.getElementById('skills');
    
    if (!skillsSection) return;

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                        
                        // Add counter animation
                        const skillItem = bar.closest('.skill-item');
                        const percentageElement = skillItem.querySelector('.skill-percentage');
                        if (percentageElement) {
                            animateCounter(percentageElement, 0, parseInt(width), 1500);
                        }
                    }, index * 200);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillObserver.observe(skillsSection);
}

// Counter animation helper
function animateCounter(element, start, end, duration) {
    const startTimestamp = performance.now();
    
    function step(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.textContent = value + '%';
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim()
        };

        // Validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showNotification(`Thank you ${data.name}! Your message has been received. I'll get back to you soon! 🎉`, 'success');
            contactForm.reset();
            
            // Track interaction
            console.log('Contact form submitted:', {
                subject: data.subject,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    const emailField = contactForm.querySelector('#email');
    if (emailField) {
        emailField.addEventListener('blur', () => {
            const email = emailField.value.trim();
            if (email && !isValidEmail(email)) {
                emailField.style.borderColor = 'var(--error-color)';
                showNotification('Please enter a valid email address.', 'warning');
            } else {
                emailField.style.borderColor = 'var(--primary-color)';
            }
        });
    }
}

// Interactive features
function initInteractions() {
    // Contact info clipboard functionality
    const contactItems = document.querySelectorAll('[data-clipboard]');
    contactItems.forEach(item => {
        item.addEventListener('click', async () => {
            const text = item.getAttribute('data-clipboard');
            try {
                await navigator.clipboard.writeText(text);
                showNotification(`${text} copied to clipboard! 📋`, 'success');
                
                // Visual feedback
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 150);
                
            } catch (err) {
                showNotification(`Contact info: ${text}`, 'info');
            }
        });
        
        item.style.cursor = 'pointer';
        item.title = 'Click to copy';
    });

    // Tech tags interaction
    const techTags = document.querySelectorAll('.tech-tag, .objective-tag, .company-tag, .achievement-tag');
    techTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skill = tag.textContent.trim();
            showNotification(`💪 ${skill} - One of my key areas of expertise!`, 'info');
        });
    });

    // Project links enhancement
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const projectCard = link.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            
            if (link.classList.contains('demo') && !link.href.startsWith('http')) {
                e.preventDefault();
                showNotification(`🚀 ${projectTitle} demo will be available soon!`, 'info');
            } else if (link.classList.contains('github')) {
                showNotification(`🔗 Opening ${projectTitle} on GitHub!`, 'success');
            }
        });
    });

    // Social links tracking
    const socialLinks = document.querySelectorAll('.social-icon, .social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = getPlatformFromLink(link);
            showNotification(`🔗 Opening ${platform}! Thanks for connecting!`, 'success');
        });
    });

    // YouTube channel specific handling
    const youtubeLinks = document.querySelectorAll('[href*="youtube"], [href*="bcadaysandgetways"]');
    youtubeLinks.forEach(link => {
        link.addEventListener('click', () => {
            showNotification('🎬 Opening "BCA days and getways" - Educational content for aspiring developers!', 'success');
        });
    });

    // Floating animation for hero particles
    createFloatingParticles();

    // Enhanced hover effects
    addEnhancedHoverEffects();
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getPlatformFromLink(link) {
    const href = link.href || link.getAttribute('href') || '';
    const classes = link.className || '';
    
    if (href.includes('github') || classes.includes('github')) return 'GitHub';
    if (href.includes('youtube') || classes.includes('youtube')) return 'YouTube';
    if (href.includes('mailto') || classes.includes('email')) return 'Email';
    if (href.includes('linkedin')) return 'LinkedIn';
    if (href.includes('twitter')) return 'Twitter';
    
    return 'external link';
}

function createFloatingParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create animated particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.7;
            animation: floatParticle ${6 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            z-index: 1;
        `;
        heroSection.appendChild(particle);
    }
    
    // Add keyframes for particle animation
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
                33% { transform: translateY(-30px) translateX(20px); opacity: 1; }
                66% { transform: translateY(-10px) translateX(-15px); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}

function addEnhancedHoverEffects() {
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.detail-card, .project-card, .achievement-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tech items pulse effect
    const techItems = document.querySelectorAll('.tech-item, .soft-skill-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.color = 'var(--secondary-color)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = 'var(--primary-color)';
            }
        });
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy loading for heavy content
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.getAttribute('data-lazy');
                    if (src) {
                        element.src = src;
                        element.removeAttribute('data-lazy');
                    }
                    lazyObserver.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    // Optimize scroll performance
    let ticking = false;
    function optimizedScroll(callback) {
        if (!ticking) {
            requestAnimationFrame(callback);
            ticking = true;
        }
    }

    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });

    // Cache DOM queries
    const DOM_CACHE = {
        navbar: document.getElementById('navbar'),
        scrollTopBtn: document.getElementById('scroll-top'),
        navLinks: document.querySelectorAll('.nav-link')
    };

    // Store frequently used elements
    window.portfolioDOM = DOM_CACHE;
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Icons for different types
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    // Colors for different types
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#1FB8CD'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1001;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 400px;
        min-width: 300px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    `;

    // Content styles
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    const icon = notification.querySelector('.notification-icon');
    icon.style.cssText = `
        font-size: 20px;
        opacity: 0.9;
    `;

    const messageEl = notification.querySelector('.notification-message');
    messageEl.style.cssText = `
        flex: 1;
        font-weight: 500;
        line-height: 1.4;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 14px;
        cursor: pointer;
        padding: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
        border-radius: 4px;
    `;

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
        closeBtn.style.background = 'rgba(255,255,255,0.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.7';
        closeBtn.style.background = 'none';
    });

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto hide
    const autoHideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, duration);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimeout);
        hideNotification(notification);
    });

    // Add click to close
    notification.addEventListener('click', () => {
        clearTimeout(autoHideTimeout);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible again
        setTimeout(updateActiveNavLink, 100);
    }
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
    updateActiveNavLink();
    
    // Recalculate positions for mobile menu
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}, 250));

// Error handling
window.addEventListener('error', function(e) {
    console.warn('Portfolio error handled:', e.message);
    // Could send error reports to analytics here
});

// Add smooth scroll behavior polyfill for older browsers
if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function
                    const ease = percentage < 0.5 
                        ? 2 * percentage * percentage 
                        : -1 + (4 - 2 * percentage) * percentage;
                    
                    window.scrollTo(0, startPosition + distance * ease);
                    
                    if (progress < duration) {
                        requestAnimationFrame(step);
                    }
                }
                
                requestAnimationFrame(step);
            }
        });
    });
}

// Initialize page loading animation
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Prevent zoom on double-tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Console message for developers
console.log(`
🚀 Welcome to Ajay Mondal's Portfolio!
📧 Email: itsajaym91@gmail.com
📱 Phone: +91 7550801182
🎬 YouTube: BCA days and getways
💻 GitHub: https://github.com/ajay01p

Built with ❤️ using vanilla HTML, CSS, and JavaScript
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePortfolio,
        showNotification,
        isValidEmail,
        updateActiveNavLink
    };
}