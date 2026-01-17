// HiredAI.ca JavaScript

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('.faq-icon');

        // Close other open FAQs
        document.querySelectorAll('.faq-answer').forEach(item => {
            if (item !== answer) {
                item.classList.remove('active');
            }
        });

        document.querySelectorAll('.faq-icon').forEach(item => {
            if (item !== icon) {
                item.classList.remove('active');
            }
        });

        // Toggle current FAQ
        answer.classList.toggle('active');
        icon.classList.toggle('active');
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Smooth scroll to anchors
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
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Contact Form Modal
const contactModal = document.getElementById('contactModal');
const openContactBtn = document.getElementById('openContactBtn');
const closeModalBtn = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');

// Open modal when clicking any contact button
function openContactModal(e) {
    e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Track modal open event in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_modal_opened', {
            'event_category': 'engagement',
            'event_label': 'Contact Form'
        });
    }
}

// Close modal
function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    contactForm.reset(); // Clear form
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

    // Get form values
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // Get the submit button for loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Check if EmailJS is configured
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        // Fallback to mailto
        fallbackToMailto(name, email, message);
        return;
    }

    // SETUP REQUIRED: Replace these with your EmailJS service, template, and public key
    // Service ID: Get from https://dashboard.emailjs.com/admin
    // Template ID: Create a template with variables: from_name, reply_to, message
    const serviceID = 'service_wdbvfs9';  // Replace with your EmailJS service ID
    const templateID = 'template_gn0ql9h';  // Replace with your EmailJS template ID

    // Send email using EmailJS
    emailjs.send(serviceID, templateID, {
        from_name: name,
        reply_to: email,
        message: message,
        to_email: 'tech@hiredai.ca'
    })
    .then(function(response) {
        console.log('Email sent successfully!', response.status, response.text);

        // Track successful submission in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submitted', {
                'event_category': 'conversion',
                'event_label': 'Contact Form - Email Sent'
            });
        }

        // Show success message
        alert('Thank you! Your message has been sent successfully. We\'ll get back to you shortly.');

        // Close modal and reset form
        closeContactModal();

        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    })
    .catch(function(error) {
        console.error('Failed to send email:', error);

        // Track error in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_error', {
                'event_category': 'error',
                'event_label': 'EmailJS Error',
                'error_details': error.text || error.message
            });
        }

        // Fallback to mailto if EmailJS fails
        alert('There was an issue sending your message directly. Opening your email client instead...');
        fallbackToMailto(name, email, message);

        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
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
        alert('Your email client has been opened. Please send the email to complete your message.');
    }, 500);
}
