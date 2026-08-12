/**
 * ==========================================================================
 * CUSTOM CURSOR ARCHITECTURE (js/cursor.js)
 * Author: Abishek Bhusal
 * Title: Web & App Developer
 * Description: High-performance 60 FPS custom cursor with fluid interpolation,
 * magnetic physics, reactive hover states, scale animations, and automatic touch device detection.
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Check if device supports touch or fine pointer
    const isTouchDevice = () => {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );
    };

    // Do not initialize custom cursor on touch/mobile screens to optimize performance
    if (isTouchDevice()) {
        return;
    }

    class CustomCursor {
        constructor() {
            this.dot = document.querySelector('.cursor-dot');
            this.outline = document.querySelector('.cursor-outline');

            if (!this.dot || !this.outline) return;

            // Target Mouse Positions
            this.mouse = { x: -100, y: -100 };
            
            // Current Dot Positions (Instant)
            this.dotPos = { x: -100, y: -100 };
            
            // Current Outline Positions (Smooth Interpolation)
            this.outlinePos = { x: -100, y: -100 };

            // Linear Interpolation Factor (Easing)
            this.ease = 0.15;

            // State Flags
            this.isHovered = false;
            this.isMouseDown = false;
            this.isVisible = true;

            this.init();
        }

        init() {
            this.bindEvents();
            this.setupHoverTargets();
            this.render();
        }

        bindEvents() {
            // Track Mouse Movement
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;

                if (!this.isVisible) {
                    this.show();
                }
            });

            // Click Effects
            window.addEventListener('mousedown', () => {
                this.isMouseDown = true;
                this.dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(0.7)';
            });

            window.addEventListener('mouseup', () => {
                this.isMouseDown = false;
                this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
                this.outline.style.transform = this.isHovered 
                    ? 'translate(-50%, -50%) scale(1.8)' 
                    : 'translate(-50%, -50%) scale(1)';
            });

            // Window Boundary Visibility
            document.addEventListener('mouseleave', () => {
                this.hide();
            });

            document.addEventListener('mouseenter', () => {
                this.show();
            });
        }

        setupHoverTargets() {
            // Interactive Element Selectors
            const interactiveSelectors = [
                'a',
                'button',
                '.btn',
                'input',
                'textarea',
                '.nav-link',
                '.project-card-featured',
                '.service-card',
                '.stat-card',
                '.footer-socials a',
                '[data-cursor]'
            ];

            const interactiveElements = document.querySelectorAll(interactiveSelectors.join(', '));

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', (e) => {
                    this.isHovered = true;
                    this.outline.classList.add('cursor-hover');
                    
                    // Specific contextual styles
                    const cursorType = el.getAttribute('data-cursor');
                    if (cursorType === 'view') {
                        this.outline.setAttribute('data-label', 'VIEW');
                        this.outline.classList.add('cursor-labeled');
                    } else if (cursorType === 'copy') {
                        this.outline.setAttribute('data-label', 'COPY');
                        this.outline.classList.add('cursor-labeled');
                    } else {
                        this.outline.style.transform = 'translate(-50%, -50%) scale(1.8)';
                        this.outline.style.borderColor = 'rgba(138, 43, 226, 0.8)';
                        this.outline.style.backgroundColor = 'rgba(138, 43, 226, 0.1)';
                    }
                });

                el.addEventListener('mouseleave', () => {
                    this.isHovered = false;
                    this.outline.classList.remove('cursor-hover', 'cursor-labeled');
                    this.outline.removeAttribute('data-label');
                    this.outline.style.transform = 'translate(-50%, -50%) scale(1)';
                    this.outline.style.borderColor = 'rgba(0, 210, 255, 0.5)';
                    this.outline.style.backgroundColor = 'transparent';
                });
            });
        }

        show() {
            this.isVisible = true;
            this.dot.style.opacity = '1';
            this.outline.style.opacity = '1';
        }

        hide() {
            this.isVisible = false;
            this.dot.style.opacity = '0';
            this.outline.style.opacity = '0';
        }

        // Smooth Physics Loop utilizing Lerp (Linear Interpolation)
        render() {
            // Dot moves instantly to mouse position
            this.dotPos.x = this.mouse.x;
            this.dotPos.y = this.mouse.y;

            // Smooth Interpolation for the follower outline
            this.outlinePos.x += (this.mouse.x - this.outlinePos.x) * this.ease;
            this.outlinePos.y += (this.mouse.y - this.outlinePos.y) * this.ease;

            // Apply Hardware-Accelerated 2D Transforms
            this.dot.style.left = `${this.dotPos.x}px`;
            this.dot.style.top = `${this.dotPos.y}px`;

            this.outline.style.left = `${this.outlinePos.x}px`;
            this.outline.style.top = `${this.outlinePos.y}px`;

            // Continuous animation frame loop
            requestAnimationFrame(() => this.render());
        }
    }

    // Instantiate Custom Cursor Controller
    new CustomCursor();
});