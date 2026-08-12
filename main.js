/**
 * ==========================================================================
 * MAIN JAVASCRIPT ARCHITECTURE (js/main.js)
 * Author: Abishek Bhusal
 * Title: Web & App Developer
 * Description: Core logic, UI events, interactive modules, and handlers.
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Application State Management
    const APP = {
        init() {
            this.initPreloader();
            this.initNavbar();
            this.initMobileMenu();
            this.initScrollProgress();
            this.initBackToTop();
            this.initCounters();
            this.initButtonRipple();
            this.initTypingEffect();
            this.initLazyLoading();
            this.initFormValidation();
            this.initCopyEmail();
            this.initCurrentYear();
            this.initAccordion();
            this.initKeyboardAccessibility();
            this.initDebouncedResize();
        }
    };

    /**
     * ----------------------------------------------------------------------
     * 1. PRELOADER & LOADING SCREEN
     * ----------------------------------------------------------------------
     */
    APP.initPreloader = function () {
        const loader = document.getElementById('loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 600);
            }, 1000);
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 2. STICKY NAVBAR & SCROLL BLUR
     * ----------------------------------------------------------------------
     */
    APP.initNavbar = function () {
        const header = document.querySelector('.header');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!header) return;

        const handleScroll = () => {
            // Navbar blur & background transition
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Active Link Highlighting based on scroll position
            let current = '';
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 120;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    current = sectionId;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}` || link.getAttribute('href') === `${current}.html`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', APP.debounce(handleScroll, 10));
    };

    /**
     * ----------------------------------------------------------------------
     * 3. MOBILE NAVIGATION TOGGLE
     * ----------------------------------------------------------------------
     */
    APP.initMobileMenu = function () {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        const closeMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };

        hamburger.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 4. SCROLL PROGRESS BAR
     * ----------------------------------------------------------------------
     */
    APP.initScrollProgress = function () {
        let progressBar = document.querySelector('.scroll-progress-bar');

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #00d2ff, #8a2be2);
                z-index: 10001;
                width: 0%;
                transition: width 0.1s ease-out;
            `;
            document.body.appendChild(progressBar);
        }

        const updateProgress = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', APP.debounce(updateProgress, 10));
    };

    /**
     * ----------------------------------------------------------------------
     * 5. BACK TO TOP BUTTON
     * ----------------------------------------------------------------------
     */
    APP.initBackToTop = function () {
        let backToTopBtn = document.querySelector('.back-to-top');

        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.setAttribute('aria-label', 'Back to top');
            backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: rgba(18, 18, 24, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
                z-index: 999;
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(backToTopBtn);
        }

        const toggleBtn = () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        };

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        backToTopBtn.addEventListener('mouseenter', () => {
            backToTopBtn.style.transform = 'translateY(-4px)';
        });

        backToTopBtn.addEventListener('mouseleave', () => {
            backToTopBtn.style.transform = 'translateY(0)';
        });

        window.addEventListener('scroll', APP.debounce(toggleBtn, 20));
    };

    /**
     * ----------------------------------------------------------------------
     * 6. ANIMATED COUNTERS
     * ----------------------------------------------------------------------
     */
    APP.initCounters = function () {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        let animated = false;

        const startCounting = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const speed = 200; // lower is faster
                const increment = target / speed;

                let count = 0;
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
            });
        };

        const checkScroll = () => {
            const statsSection = document.querySelector('.stats-section');
            if (!statsSection) return;

            const position = statsSection.getBoundingClientRect();
            if (position.top < window.innerHeight && position.bottom >= 0 && !animated) {
                animated = true;
                startCounting();
            }
        };

        window.addEventListener('scroll', APP.debounce(checkScroll, 50));
        checkScroll();
    };

    /**
     * ----------------------------------------------------------------------
     * 7. BUTTON RIPPLE EFFECT
     * ----------------------------------------------------------------------
     */
    APP.initButtonRipple = function () {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 8. TYPING EFFECT INITIALIZATION
     * ----------------------------------------------------------------------
     */
    APP.initTypingEffect = function () {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const words = JSON.parse(typingElement.getAttribute('data-words') || '["Web & App Developer", "UI/UX Specialist", "Problem Solver"]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();
    };

    /**
     * ----------------------------------------------------------------------
     * 9. LAZY LOADING IMAGES
     * ----------------------------------------------------------------------
     */
    APP.initLazyLoading = function () {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.getAttribute('data-src');
                        image.removeAttribute('data-src');
                        imageObserver.unobserve(image);
                    }
                });
            });

            lazyImages.forEach(image => imageObserver.observe(image));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(image => {
                image.src = image.getAttribute('data-src');
                image.removeAttribute('data-src');
            });
        }
    };

    /**
     * ----------------------------------------------------------------------
     * 10. CONTACT FORM VALIDATION & HANDLING
     * ----------------------------------------------------------------------
     */
    APP.initFormValidation = function () {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const nameInput = form.querySelector('[name="name"]');
            const emailInput = form.querySelector('[name="email"]');
            const messageInput = form.querySelector('[name="message"]');
            const submitBtn = form.querySelector('button[type="submit"]');

            // Reset status
            form.querySelectorAll('.error-message').forEach(el => el.remove());

            // Validate Name
            if (nameInput && nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            }

            // Validate Email
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    showError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                }
            }

            // Validate Message
            if (messageInput && messageInput.value.trim() === '') {
                showError(messageInput, 'Message cannot be empty');
                isValid = false;
            }

            if (isValid) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

                // Simulate Form Submission Delay
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
                    submitBtn.style.background = '#10b981';
                    form.reset();

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 3000);
                }, 1500);
            }
        });

        function showError(input, message) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 0.25rem; display: block;';
            error.innerText = message;
            input.parentNode.appendChild(error);
        }
    };

    /**
     * ----------------------------------------------------------------------
     * 11. COPY EMAIL TO CLIPBOARD
     * ----------------------------------------------------------------------
     */
    APP.initCopyEmail = function () {
        const copyBtns = document.querySelectorAll('.js-copy-email');

        copyBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const email = this.getAttribute('data-email') || 'abishek@example.com';
                navigator.clipboard.writeText(email).then(() => {
                    const originalTooltip = this.innerText;
                    this.innerText = 'Copied!';
                    setTimeout(() => {
                        this.innerText = originalTooltip;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 12. DYNAMIC CURRENT YEAR
     * ----------------------------------------------------------------------
     */
    APP.initCurrentYear = function () {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 13. FAQ ACCORDION
     * ----------------------------------------------------------------------
     */
    APP.initAccordion = function () {
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (!header) return;

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const content = otherItem.querySelector('.accordion-content');
                    if (content) content.style.maxHeight = null;
                });

                // Toggle current item
                if (!isOpen) {
                    item.classList.add('active');
                    const content = item.querySelector('.accordion-content');
                    if (content) content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 14. KEYBOARD ACCESSIBILITY
     * ----------------------------------------------------------------------
     */
    APP.initKeyboardAccessibility = function () {
        const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="email"], input[type="number"], input[type="submit"], [tabindex]:not([tabindex="-1"])';

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.addEventListener('mousedown', function () {
            document.body.classList.remove('user-is-tabbing');
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 15. UTILITIES: DEBOUNCE & RESIZE
     * ----------------------------------------------------------------------
     */
    APP.debounce = function (func, wait = 20, immediate = false) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    APP.initDebouncedResize = function () {
        const handleResize = () => {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');

            if (window.innerWidth > 992) {
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        };

        window.addEventListener('resize', APP.debounce(handleResize, 100));
    };

    // Initialize Application
    APP.init();
});