/**
 * ==========================================================================
 * HIGH-PERFORMANCE INTERACTIVE PARTICLE SYSTEM (js/particles.js)
 * Author: Abishek Bhusal
 * Title: Web & App Developer
 * Description: Lightweight HTML5 Canvas interactive particle engine featuring
 * constrained physics, spatial link connections, mouse repulsion, shooting stars,
 * responsive density scaling, and automatic tab visibility pausing.
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    class ParticleSystem {
        constructor() {
            // Find target canvas or dynamically create one
            this.canvas = document.getElementById('particles-canvas');
            
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'particles-canvas';
                this.canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.7;
                `;
                document.body.prepend(this.canvas);
            }

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.shootingStars = [];
            this.animFrameId = null;
            this.isPaused = false;

            // Mouse State Physics
            this.mouse = {
                x: null,
                y: null,
                radius: 140
            };

            // Color Palette Setup
            this.colors = [
                'rgba(0, 210, 255, ',   // Accent Blue
                'rgba(138, 43, 226, ',  // Accent Purple
                'rgba(58, 123, 213, '   // Cyan Accent
            ];

            this.init();
        }

        init() {
            this.resizeCanvas();
            this.bindEvents();
            this.createParticles();
            this.initShootingStars();
            this.animate();
        }

        /**
         * ------------------------------------------------------------------
         * 1. RESPONSIVE DENSITY & CANVAS RESIZING
         * ------------------------------------------------------------------
         */
        resizeCanvas() {
            this.dpr = window.devicePixelRatio || 1;
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
            this.ctx.scale(this.dpr, this.dpr);

            // Re-calculate particle density based on screen resolution
            if (this.particles.length > 0) {
                this.createParticles();
            }
        }

        getParticleCount() {
            const area = this.width * this.height;
            if (this.width < 576) return Math.floor(area / 18000); // Mobile
            if (this.width < 992) return Math.floor(area / 14000); // Tablet
            return Math.floor(area / 10000);                      // Desktop
        }

        /**
         * ------------------------------------------------------------------
         * 2. PARTICLE INITIALIZATION & FACTORY
         * ------------------------------------------------------------------
         */
        createParticles() {
            this.particles = [];
            const count = this.getParticleCount();

            for (let i = 0; i < count; i++) {
                const colorPrefix = this.colors[Math.floor(Math.random() * this.colors.length)];
                const alpha = (Math.random() * 0.5 + 0.25).toFixed(2);

                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 2 + 1,
                    color: `${colorPrefix}${alpha})`,
                    baseColor: colorPrefix,
                    alpha: parseFloat(alpha),
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    pulse: Math.random() * 0.05
                });
            }
        }

        /**
         * ------------------------------------------------------------------
         * 3. SHOOTING STARS FEATURE
         * ------------------------------------------------------------------
         */
        initShootingStars() {
            const createStar = () => {
                if (this.isPaused) return;

                this.shootingStars.push({
                    x: Math.random() * this.width * 0.8,
                    y: Math.random() * (this.height * 0.4),
                    length: Math.random() * 80 + 40,
                    speed: Math.random() * 8 + 6,
                    angle: Math.PI / 4, // 45 degrees down
                    alpha: 1
                });

                // Schedule next shooting star
                setTimeout(createStar, Math.random() * 6000 + 4000);
            };

            setTimeout(createStar, 3000);
        }

        /**
         * ------------------------------------------------------------------
         * 4. EVENT LISTENER BINDINGS
         * ------------------------------------------------------------------
         */
        bindEvents() {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            window.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });

            window.addEventListener('resize', () => {
                this.resizeCanvas();
            });

            // Pause animations when tab is inactive to preserve CPU/GPU battery
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.isPaused = true;
                    cancelAnimationFrame(this.animFrameId);
                } else {
                    this.isPaused = false;
                    this.animate();
                }
            });
        }

        /**
         * ------------------------------------------------------------------
         * 5. PHYSICS & DRAWING LOOP
         * ------------------------------------------------------------------
         */
        animate() {
            if (this.isPaused) return;

            this.ctx.clearRect(0, 0, this.width, this.height);

            this.updateParticles();
            this.drawLinks();
            this.updateShootingStars();

            this.animFrameId = requestAnimationFrame(() => this.animate());
        }

        updateParticles() {
            for (let p of this.particles) {
                // Movement
                p.x += p.vx;
                p.y += p.vy;

                // Screen Edge Bounce Mechanics
                if (p.x < 0 || p.x > this.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.height) p.vy *= -1;

                // Mouse Repulsion & Interactive Physics
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = this.mouse.x - p.x;
                    const dy = this.mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.mouse.radius) {
                        const force = (this.mouse.radius - distance) / this.mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        
                        p.x -= Math.cos(angle) * force * 3;
                        p.y -= Math.sin(angle) * force * 3;
                    }
                }

                // Render Individual Particle with Glow
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();
                this.ctx.shadowBlur = 0; // Reset blur for performance
            }
        }

        drawLinks() {
            const maxDistance = 120;

            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p1 = this.particles[i];
                    const p2 = this.particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.25;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
                        this.ctx.lineWidth = 0.75;
                        this.ctx.stroke();
                    }
                }
            }
        }

        updateShootingStars() {
            for (let i = this.shootingStars.length - 1; i >= 0; i--) {
                const star = this.shootingStars[i];

                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.alpha -= 0.012;

                if (star.alpha <= 0) {
                    this.shootingStars.splice(i, 1);
                    continue;
                }

                const tailX = star.x - Math.cos(star.angle) * star.length;
                const tailY = star.y - Math.sin(star.angle) * star.length;

                const gradient = this.ctx.createLinearGradient(star.x, star.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
                gradient.addColorStop(0.3, `rgba(0, 210, 255, ${star.alpha * 0.8})`);
                gradient.addColorStop(1, `rgba(138, 43, 226, 0)`);

                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y);
                this.ctx.lineTo(tailX, tailY);
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }

    // Initialize Interactive Particle System
    new ParticleSystem();
});