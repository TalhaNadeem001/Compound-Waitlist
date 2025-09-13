// Waitlist functionality
class WaitlistManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupScrollEffects();
        this.setupAnimations();
    }

    bindEvents() {
        // Waitlist form submissions
        const waitlistForms = document.querySelectorAll('.waitlist-form, .cta-form');
        waitlistForms.forEach(form => {
            const button = form.querySelector('.join-waitlist-btn');
            const emailInput = form.querySelector('.email-input');
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleWaitlistSignup(emailInput, button);
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleWaitlistSignup(emailInput, button);
                }
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle (if needed)
        this.setupMobileMenu();
    }

    handleWaitlistSignup(emailInput, button) {
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError(emailInput, 'Please enter a valid email address');
            return;
        }

        this.setButtonLoading(button, true);
        
        // Submit to email service
        this.submitToEmailService(email, emailInput, button);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            const originalText = button.querySelector('span').textContent;
            button.setAttribute('data-original-text', originalText);
            button.querySelector('span').textContent = 'Joining...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.querySelector('span').textContent = originalText;
            }
        }
    }

    showError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error styling
        input.style.borderColor = '#ef4444';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '8px';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);

        // Remove error after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
            input.style.borderColor = '';
        }, 3000);
    }

    showSuccess(input, message) {
        // Remove existing messages
        const existingMessage = input.parentNode.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add success styling
        input.style.borderColor = '#10b981';
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.color = '#10b981';
        successDiv.style.fontSize = '14px';
        successDiv.style.marginTop = '8px';
        successDiv.textContent = message;
        
        input.parentNode.appendChild(successDiv);

        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
            input.style.borderColor = '';
        }, 5000);
    }

    async submitToEmailService(email, emailInput, button) {
        try {
            // Using Formspree for simple email notifications
            // This is a free service that sends form submissions to your email
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xldwvvyk';
            
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'Compound Waitlist Landing Page',
                    message: `New waitlist signup from Compound landing page`
                })
            });

            if (response.ok) {
                this.setButtonLoading(button, false);
                this.showSuccess(emailInput, 'Successfully joined the waitlist!');
                emailInput.value = '';
                
                // Track conversion
                this.trackConversion(email);
            } else {
                throw new Error('Failed to submit');
            }
            
        } catch (error) {
            console.error('Error sending email notification:', error);
            this.setButtonLoading(button, false);
            this.showError(emailInput, 'Something went wrong. Please try again.');
        }
    }

    trackConversion(email) {
        // Track conversion for analytics
        console.log('Waitlist signup:', email);
        
        // You can integrate with analytics services here
        // Example: gtag('event', 'waitlist_signup', { email: email });
        
        // Update waitlist count
        this.updateWaitlistCount();
    }

    updateWaitlistCount() {
        const countElements = document.querySelectorAll('.stat-number');
        countElements.forEach(element => {
            if (element.textContent.includes(',')) {
                const currentCount = parseInt(element.textContent.replace(',', ''));
                element.textContent = (currentCount + 1).toLocaleString();
            }
        });
    }

    setupScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Intersection Observer for animations
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

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .step, .stat').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupAnimations() {
        // Counter animation for stats
        const animateCounter = (element, target, duration = 2000) => {
            let start = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start).toLocaleString();
                }
            }, 16);
        };

        // Animate counters when they come into view
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
                    animateCounter(element, target);
                    counterObserver.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number').forEach(el => {
            counterObserver.observe(el);
        });
    }

    setupMobileMenu() {
        // Add mobile menu functionality if needed
        const navLinks = document.querySelector('.nav-links');
        const navCta = document.querySelector('.nav-cta');
        
        // For now, we'll keep it simple since the design is responsive
        // You can add a hamburger menu here if needed
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WaitlistManager();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
