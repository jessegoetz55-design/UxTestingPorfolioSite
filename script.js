// ===================================
// Navigation Scroll Effect
// ===================================

const nav = document.getElementById('nav');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// ===================================
// Mobile Menu Toggle
// ===================================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        
        // Toggle mobile menu (you'd need to add CSS for this)
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = 'var(--nav-height)';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.backgroundColor = 'var(--color-background)';
            navMenu.style.padding = 'var(--space-lg)';
            navMenu.style.borderBottom = '1px solid var(--color-border)';
        }
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            if (window.innerWidth < 768) {
                navMenu.style.display = 'none';
            }
        });
    });
    
    // Reset menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'row';
            navMenu.style.position = 'static';
            navMenu.style.padding = '0';
            navMenu.style.border = 'none';
        } else {
            navMenu.style.display = 'none';
        }
    });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for non-section links
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed nav
            
            if (prefersReducedMotion) {
                window.scrollTo(0, offsetTop);
            } else {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Intersection Observer for Fade-in Animations
// ===================================

// Only apply if user doesn't prefer reduced motion
if (!prefersReducedMotion) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll(
        '.capability-card, .industry-card, .feedback-card, .why-card, .tool-tag'
    );
    
    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s ease-out ${index * 0.05}s`;
        
        // Observe
        observer.observe(el);
    });
}

// ===================================
// Contact Form Handling
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // In a real implementation, you would send this to a backend
        console.log('Form submitted:', data);
        
        // Show success message (simple alert for demo)
        alert('Thank you for your message! This is a demo form. In production, this would be connected to an email service or form handler.');
        
        // Reset form
        contactForm.reset();
        
        // In production, you might do something like:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Show success message
            alert('Message sent successfully!');
            contactForm.reset();
        })
        .catch(error => {
            // Show error message
            alert('Sorry, there was an error sending your message. Please try again.');
            console.error('Error:', error);
        });
        */
    });
}

// ===================================
// Capability Cards Hover Effect
// ===================================

const capabilityCards = document.querySelectorAll('.capability-card');

capabilityCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
            const icon = card.querySelector('.capability-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.capability-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ===================================
// Stats Counter Animation (Hero Section)
// ===================================

const stats = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        }
    };
    
    updateCounter();
};

// Trigger counter animation when hero section is visible
if (!prefersReducedMotion) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => animateCounter(stat));
                heroObserver.disconnect(); // Only animate once
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
}

// ===================================
// Keyboard Navigation Enhancement
// ===================================

// Add visible focus indicators for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus-visible styles dynamically
const style = document.createElement('style');
style.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid var(--color-accent) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

// ===================================
// Performance: Lazy Load Images (if any added later)
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// Console Message
// ===================================

console.log('%c👋 Welcome to Jesse G.\'s Portfolio', 'font-size: 16px; font-weight: bold; color: #2563eb;');
console.log('%cInterested in the code? Check out the GitHub repository or get in touch!', 'font-size: 12px; color: #525252;');
