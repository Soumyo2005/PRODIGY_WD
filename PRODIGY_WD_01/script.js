document.addEventListener('DOMContentLoaded', function() {
    // Navigation Scroll Effect
    const nav = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tab System for Tea Types
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
        });
    });

    // Add to Cart Animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Scroll Reveal Animation
    const scrollReveal = ScrollReveal({
        origin: 'bottom',
        distance: '50px',
        duration: 1000,
        reset: true
    });
    
    scrollReveal.reveal('.product-card, .benefit-card, .step, .category-card, .faq-item', {
        interval: 200
    });
    
    scrollReveal.reveal('.hero-content, .section-title, .tab-content, .temperature-chart', {
        delay: 300
    });

    // Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                // Here you would typically send the data to your server
                alert('Thank you for subscribing!');
                emailInput.value = '';
            }
        });
    }
});