// HiredLine - Modern Dark Mode JavaScript

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger to X
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Navbar scroll effect with enhanced transitions
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// FAQ Accordion with smooth animations
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('.faq-icon');
        const item = button.closest('.faq-item');

        // Close other open FAQs
        document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
            if (otherAnswer !== answer && otherAnswer.classList.contains('active')) {
                otherAnswer.classList.remove('active');
                otherAnswer.previousElementSibling.querySelector('.faq-icon').classList.remove('active');
            }
        });

        // Toggle current FAQ
        answer.classList.toggle('active');
        icon.classList.toggle('active');
    });
});

// Enhanced Intersection Observer for staggered fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay based on element position
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

// Observe all fade-in elements with staggered delays
document.querySelectorAll('.fade-in').forEach((element, index) => {
    // Set stagger delay based on siblings
    const parent = element.parentElement;
    const siblings = parent.querySelectorAll('.fade-in');
    const siblingIndex = Array.from(siblings).indexOf(element);
    element.dataset.delay = siblingIndex * 100;

    fadeInObserver.observe(element);
});

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration = 1200) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function for smooth deceleration
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Smooth scroll to anchors with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's the contact button
        if (this.id === 'openContactBtn' || this.classList.contains('open-contact-btn')) {
            return;
        }

        // Only prevent default if there's a valid target
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                // Use custom smooth scroll with 1.2 second duration
                smoothScrollTo(targetPosition, 1200);
            }
        }
    });
});

// Contact Form Modal
const contactModal = document.getElementById('contactModal');
const openContactBtn = document.getElementById('openContactBtn');
const closeModalBtn = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');

// Open modal with animation
function openContactModal(e) {
    e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track modal open event in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_modal_opened', {
            'event_category': 'engagement',
            'event_label': 'Contact Form'
        });
    }
}

// Close modal with animation
function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
    contactForm.reset();
}

// Event listeners for opening modal
openContactBtn.addEventListener('click', openContactModal);

// Also add listener for all elements with open-contact-btn class
document.querySelectorAll('.open-contact-btn').forEach(btn => {
    btn.addEventListener('click', openContactModal);
});

// Event listener for closing modal
closeModalBtn.addEventListener('click', closeContactModal);

// Close modal when clicking outside
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeContactModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeContactModal();
    }
});

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Check if EmailJS is configured
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        fallbackToMailto(name, email, message);
        return;
    }

    const serviceID = 'service_wdbvfs9';
    const templateID = 'template_gn0ql9h';

    // Send email using EmailJS
    emailjs.send(serviceID, templateID, {
        from_name: name,
        reply_to: email,
        message: message,
        to_email: 'tech@hiredai.ca'
    })
    .then(function(response) {
        console.log('Email sent successfully!', response.status, response.text);

        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submitted', {
                'event_category': 'conversion',
                'event_label': 'Contact Form - Email Sent'
            });
        }

        // Show success message
        showNotification('Message sent successfully!', 'success');

        closeContactModal();

        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    })
    .catch(function(error) {
        console.error('Failed to send email:', error);

        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_error', {
                'event_category': 'error',
                'event_label': 'EmailJS Error',
                'error_details': error.text || error.message
            });
        }

        showNotification('Opening your email client instead...', 'info');
        fallbackToMailto(name, email, message);

        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    });
});

// Fallback function to open email client
function fallbackToMailto(name, email, message) {
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:tech@hiredai.ca?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
        closeContactModal();
    }, 500);
}

// Modern notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        background: type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(99, 102, 241, 0.9)',
        color: '#fff',
        fontWeight: '500',
        zIndex: '3000',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Parallax effect for hero section
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const hero = document.querySelector('.hero');
            if (hero) {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;
                hero.style.backgroundPosition = `center ${rate}px`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Add hover effect for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Button ripple effect
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');

        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for animations
    document.body.classList.add('loaded');

    // Trigger initial animations for visible elements
    document.querySelectorAll('.fade-in').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});

// Preloader (if needed)
window.addEventListener('load', () => {
    document.body.classList.add('fully-loaded');
});
