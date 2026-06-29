/**
 * 理学院 - Kimi Platform Style
 * Main JavaScript
 */
(function () {
    'use strict';

    // ============ DOM Elements ============
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');
    const researchTabs = document.getElementById('researchTabs');
    const contactForm = document.getElementById('contactForm');

    // ============ Navbar Scroll Effect ============
    let lastScroll = 0;
    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar shadow on scroll
        if (scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link highlight
        updateActiveNavLink();

        lastScroll = scrollY;
    }

    // ============ Active Nav Link ============
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Home active when at top
        if (window.scrollY < 200) {
            document.querySelectorAll('.nav-link').forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === 'index.html') {
                    link.classList.add('active');
                }
            });
        }
    }

    // ============ Mobile Menu ============
    mobileMenuBtn.addEventListener('click', function () {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ============ Back to Top ============
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============ Counter Animation ============
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(function (counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function update() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            update();
        });
    }

    // Use IntersectionObserver for counter animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroStats);
    }

    // ============ Research Tabs ============
    if (researchTabs) {
        researchTabs.addEventListener('click', function (e) {
            const tab = e.target.closest('.research-tab');
            if (!tab) return;

            // Update active tab
            document.querySelectorAll('.research-tab').forEach(function (t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');

            // Show corresponding content
            const tabId = 'tab-' + tab.getAttribute('data-tab');
            document.querySelectorAll('.research-content').forEach(function (content) {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    }

    // ============ Contact Form ============
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation
            const inputs = contactForm.querySelectorAll('[required]');
            let valid = true;

            inputs.forEach(function (input) {
                if (!input.value.trim()) {
                    input.style.borderColor = '#EF4444';
                    valid = false;
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!valid) {
                showToast('请填写所有必填字段', 'error');
                return;
            }

            // Simulate submission
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '发送中...';
            btn.disabled = true;

            setTimeout(function () {
                btn.textContent = '✓ 发送成功';
                btn.style.background = '#059669';
                showToast('消息已成功发送！我们会尽快回复您。', 'success');
                contactForm.reset();

                setTimeout(function () {
                    btn.innerHTML = '发送消息 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 2l12 6-12 6 3-6-3-6z"/></svg>';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2500);
            }, 1200);
        });

        // Clear error state on input
        contactForm.querySelectorAll('input, textarea').forEach(function (input) {
            input.addEventListener('input', function () {
                input.style.borderColor = '';
            });
        });
    }

    // ============ Toast Notification ============
    function showToast(message, type) {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(function (t) { t.remove(); });

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        toast.style.cssText = [
            'position: fixed',
            'bottom: 32px',
            'left: 50%',
            'transform: translateX(-50%) translateY(100px)',
            'padding: 12px 24px',
            'background: ' + (type === 'success' ? '#059669' : '#EF4444'),
            'color: white',
            'font-size: 14px',
            'font-weight: 600',
            'border-radius: 10px',
            'box-shadow: 0 10px 25px rgba(0,0,0,0.15)',
            'z-index: 9999',
            'transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            'white-space: nowrap'
        ].join(';');

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(function () {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Auto remove
        setTimeout(function () {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 3000);
    }

    // ============ Smooth Scroll for Anchor Links ============
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - navbar.offsetHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ Reveal on Scroll Animation ============
    function setupRevealAnimations() {
        const cards = document.querySelectorAll('.about-card, .news-card, .major-card, .faculty-card, .research-item');

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index % 4 * 60);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        cards.forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            revealObserver.observe(card);
        });
    }

    // ============ Keyboard Navigation ============
    document.addEventListener('keydown', function (e) {
        // Escape to close mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            mobileMenuBtn.focus();
        }
    });

    // ============ Init ============
    function init() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        setupRevealAnimations();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
