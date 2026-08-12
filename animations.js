/**
 * ==========================================================================
 * ADVANCED GSAP & SCROLL ANIMATIONS ARCHITECTURE (js/animations.js)
 * Author: Abishek Bhusal
 * Title: Web & App Developer
 * Description: GSAP, ScrollTrigger, AOS initialization, Magnetic Buttons,
 * Text reveals, and high-performance visual mechanics.
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Animation Controller Object
    const ANIM = {
        hasGSAP: typeof gsap !== 'undefined',
        hasScrollTrigger: typeof ScrollTrigger !== 'undefined',
        hasAOS: typeof AOS !== 'undefined',

        init() {
            if (this.hasGSAP && this.hasScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);
            }
            
            this.initAOS();
            this.initPageLoadReveal();
            this.initNavbarAnimation();
            this.initHeroAnimations();
            this.initMagneticButtons();
            this.initSplitText();
            this.initCardsHover();
            this.initFloatingElements();
            this.initBackgroundGlow();
            this.initTimelineReveal();
            this.initScrollReveals();
        }
    };

    /**
     * ----------------------------------------------------------------------
     * 1. AOS (ANIMATE ON SCROLL) INITIALIZATION
     * ----------------------------------------------------------------------
     */
    ANIM.initAOS = function () {
        if (!this.hasAOS) return;
        AOS.init({
            duration: 800,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            once: true,
            offset: 50,
            delay: 0,
            disable: window.innerWidth < 768
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 2. PAGE LOAD REVEAL
     * ----------------------------------------------------------------------
     */
    ANIM.initPageLoadReveal = function () {
        if (!this.hasGSAP) {
            document.body.classList.add('is-ready');
            return;
        }

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out', duration: 1 }
        });

        tl.to('body', { opacity: 1, duration: 0.2 })
          .from('.header', { y: -80, opacity: 0, duration: 0.8 }, '-=0.1');
    };

    /**
     * ----------------------------------------------------------------------
     * 3. NAVBAR ENTRANCE & BLUR SCRIPT
     * ----------------------------------------------------------------------
     */
    ANIM.initNavbarAnimation = function () {
        const logo = document.querySelector('.logo');
        const navItems = document.querySelectorAll('.nav-item');

        if (!this.hasGSAP || !logo) return;

        gsap.from(logo, {
            x: -30,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });

        if (navItems.length > 0) {
            gsap.from(navItems, {
                y: -20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                delay: 0.3,
                ease: 'power3.out'
            });
        }
    };

    /**
     * ----------------------------------------------------------------------
     * 4. HERO SECTION ANIMATIONS
     * ----------------------------------------------------------------------
     */
    ANIM.initHeroAnimations = function () {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCta = document.querySelector('.hero-cta-group');
        const badgePill = document.querySelector('.badge-pill');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        if (!this.hasGSAP) return;

        const heroTl = gsap.timeline({
            defaults: { ease: 'power4.out', duration: 1.2 },
            delay: 0.4
        });

        if (badgePill) {
            heroTl.from(badgePill, { y: 20, opacity: 0, scale: 0.9 }, 0);
        }

        if (heroTitle) {
            heroTl.from(heroTitle, { y: 40, opacity: 0, filter: 'blur(10px)' }, 0.2);
        }

        if (heroSubtitle) {
            heroTl.from(heroSubtitle, { y: 30, opacity: 0 }, 0.4);
        }

        if (heroCta) {
            heroTl.from(heroCta, { y: 20, opacity: 0, stagger: 0.15 }, 0.6);
        }

        if (scrollIndicator) {
            heroTl.from(scrollIndicator, { y: -10, opacity: 0 }, 0.8);
        }
    };

    /**
     * ----------------------------------------------------------------------
     * 5. MAGNETIC BUTTONS EFFECT
     * ----------------------------------------------------------------------
     */
    ANIM.initMagneticButtons = function () {
        const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .logo');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                if (ANIM.hasGSAP) {
                    gsap.to(btn, {
                        x: x * 0.25,
                        y: y * 0.25,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (ANIM.hasGSAP) {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: 'elastic.out(1, 0.3)'
                    });
                } else {
                    btn.style.transform = 'translate(0px, 0px)';
                }
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 6. SPLIT TEXT & CHARACTER REVEAL
     * ----------------------------------------------------------------------
     */
    ANIM.initSplitText = function () {
        const textElements = document.querySelectorAll('.js-split-text');

        textElements.forEach(el => {
            const text = el.textContent.trim();
            el.innerHTML = '';

            [...text].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                span.style.transition = `all 0.4s ease ${index * 0.02}s`;
                el.appendChild(span);
            });

            if (ANIM.hasScrollTrigger && ANIM.hasGSAP) {
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    onEnter: () => {
                        el.querySelectorAll('span').forEach(s => {
                            s.style.opacity = '1';
                            s.style.transform = 'translateY(0)';
                        });
                    }
                });
            }
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 7. PROJECT, SERVICE, & SKILL CARDS HOVER 3D TILT
     * ----------------------------------------------------------------------
     */
    ANIM.initCardsHover = function () {
        const cards = document.querySelectorAll('.project-card-featured, .service-card, .stat-card, .cta-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 8. FLOATING ELEMENTS & BACKGROUND PARTICLES
     * ----------------------------------------------------------------------
     */
    ANIM.initFloatingElements = function () {
        const floatables = document.querySelectorAll('.js-float');

        if (!this.hasGSAP) return;

        floatables.forEach((el, i) => {
            gsap.to(el, {
                y: i % 2 === 0 ? -15 : 15,
                duration: 2.5 + i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 9. BACKGROUND GLOW ANIMATION
     * ----------------------------------------------------------------------
     */
    ANIM.initBackgroundGlow = function () {
        const glow = document.querySelector('.mouse-glow');
        if (!glow) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const renderGlow = () => {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;

            glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderGlow);
        };

        renderGlow();
    };

    /**
     * ----------------------------------------------------------------------
     * 10. TIMELINE REVEAL
     * ----------------------------------------------------------------------
     */
    ANIM.initTimelineReveal = function () {
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (!this.hasGSAP || !this.hasScrollTrigger) return;

        timelineItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: index % 2 === 0 ? -40 : 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    };

    /**
     * ----------------------------------------------------------------------
     * 11. GENERAL SCROLL REVEALS
     * ----------------------------------------------------------------------
     */
    ANIM.initScrollReveals = function () {
        if (!this.hasGSAP || !this.hasScrollTrigger) return;

        // Reveal Section Headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Footer Stagger Animation
        const footerCols = document.querySelectorAll('.footer-links-column, .footer-brand');
        if (footerCols.length > 0) {
            gsap.from(footerCols, {
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top 90%'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }
    };

    // Initialize Animations Architecture
    ANIM.init();
});