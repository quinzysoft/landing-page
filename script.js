document.addEventListener('DOMContentLoaded', () => {
    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Scroll lock helper (prevents menu/modal overflow conflicts) =====
    let scrollLockCount = 0;
    function lockScroll() {
        scrollLockCount++;
        if (scrollLockCount === 1) document.body.style.overflow = 'hidden';
    }
    function unlockScroll() {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
        if (scrollLockCount === 0) document.body.style.overflow = '';
    }

    // ===== Custom Cursor Glow =====
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        if (window.matchMedia('(hover: hover)').matches) {
            document.addEventListener('mousemove', (e) => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        } else {
            cursorGlow.style.display = 'none';
        }
    }

    // ===== Mobile Menu Toggle =====
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navToggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        mobileMenu.setAttribute('aria-hidden', String(!isMenuOpen));
        if (isMenuOpen) {
            lockScroll();
        } else {
            unlockScroll();
        }
    }

    if (navToggle && mobileMenu) {
        mobileMenu.setAttribute('aria-hidden', 'true');
        navToggle.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }

    // ===== Navbar Scrolled State (rAF-throttled) =====
    const navbar = document.getElementById('navbar');
    let scrollTicking = false;
    let lastScrollY = 0;

    function onScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        scrollTicking = false;
    }

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(onScroll);
                scrollTicking = true;
            }
        }, { passive: true });
    }

    // ===== Terminal Typing Animation =====
    if (!prefersReducedMotion) {
        const termCmd1 = document.getElementById('termCmd1');
        const cursor1 = document.getElementById('cursor1');
        const termCmd2 = document.getElementById('termCmd2');

        const commandToType = 'konsultasi --gratis';
        let charIndex = 0;

        function typeCommand() {
            if (charIndex < commandToType.length) {
                termCmd1.textContent += commandToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeCommand, 50);
            } else {
                cursor1.classList.remove('blink');
                cursor1.style.opacity = '0';
                setTimeout(showTerminalOutput, 300);
            }
        }

        function showTerminalOutput() {
            const lines = [
                document.getElementById('termLine2'),
                document.getElementById('termLine3'),
                document.getElementById('termLine4'),
                document.getElementById('termLine5'),
                document.getElementById('termLine6')
            ];

            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.remove('hidden');
                    if (index === lines.length - 1) {
                        typeSecondCommand();
                    }
                }, line.dataset.delay * 400);
            });
        }

        function typeSecondCommand() {
            const secondCmd = 'hasil';
            let idx = 0;

            function type() {
                if (idx < secondCmd.length) {
                    termCmd2.textContent += secondCmd.charAt(idx);
                    idx++;
                    setTimeout(type, 100);
                } else {
                    const cursor2 = document.getElementById('cursor2');
                    if (cursor2) {
                        cursor2.classList.remove('blink');
                        cursor2.style.opacity = '0';
                    }
                    setTimeout(showSecondOutput, 300);
                }
            }
            setTimeout(type, 500);
        }

        function showSecondOutput() {
            const lines2 = [
                document.getElementById('termLine7'),
                document.getElementById('termLine8'),
                document.getElementById('termLine9')
            ];

            lines2.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.remove('hidden');
                }, (index + 1) * 400);
            });
        }

        setTimeout(typeCommand, 1000);
    }

    // ===== Form submission handling (WhatsApp integration) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const projectSelect = document.getElementById('form-project');
            const project = projectSelect.options[projectSelect.selectedIndex].text.replace(/"/g, '');
            const message = document.getElementById('form-message').value;

            const waNumber = "6285159205633";
            const waText = `Halo QuinzySoft, saya ingin mendiskusikan proyek baru.\n\n*Nama:* ${name}\n*Email:* ${email}\n*Layanan:* ${project}\n*Pesan:* ${message}`;
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

            window.open(waUrl, '_blank', 'noopener,noreferrer');

            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span class="btn-icon">✓</span> message --sent';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            btn.style.borderColor = 'var(--terminal-green)';
            btn.style.color = 'var(--terminal-green)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-secondary');
                btn.style.borderColor = '';
                btn.style.color = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ===== Email CTA Copy to Clipboard =====
    const ctaEmail = document.getElementById('cta-email');
    if (ctaEmail) {
        ctaEmail.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'quinzysoft@gmail.com';

            navigator.clipboard.writeText(email).then(() => {
                const textSpan = ctaEmail.querySelector('.cta-link-text');
                if (textSpan) {
                    const originalText = textSpan.textContent;
                    textSpan.textContent = 'Email disalin!';
                    ctaEmail.style.borderColor = 'var(--terminal-green)';
                    ctaEmail.style.color = 'var(--terminal-green)';

                    setTimeout(() => {
                        textSpan.textContent = originalText;
                        ctaEmail.style.borderColor = '';
                        ctaEmail.style.color = '';
                    }, 2000);
                }
            }).catch(err => {
                window.location.href = `mailto:${email}`;
            });
        });
    }

    // ===== Smooth scrolling for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ===== Binary Matrix Animation (rAF + visibility API) =====
    const canvas = document.getElementById('binaryCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let columns = 0;
        let drops = [];
        let animRunning = !prefersReducedMotion;
        let rafId = null;

        const isMobile = window.innerWidth < 768;
        const fontSize = isMobile ? 10 : 14;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = [];
            for (let x = 0; x < columns; x++) drops[x] = 1;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        const characters = '01';

        const draw = () => {
            ctx.fillStyle = 'rgba(34, 34, 34, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#f97316';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            if (animRunning) rafId = requestAnimationFrame(draw);
        };

        const startAnim = () => {
            animRunning = true;
            if (rafId === null) rafId = requestAnimationFrame(draw);
        };
        const stopAnim = () => {
            animRunning = false;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        if (prefersReducedMotion) {
            // One static frame, no loop
            draw();
        } else {
            startAnim();
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAnim();
                } else {
                    startAnim();
                }
            });
        }
    }

    // ===== Lazy-load demo preview iframes via IntersectionObserver =====
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    if (lazyIframes.length > 0 && 'IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    obs.unobserve(iframe);
                }
            });
        }, { rootMargin: '200px' });
        lazyIframes.forEach(f => iframeObserver.observe(f));
    } else {
        // Fallback: load all immediately
        lazyIframes.forEach(f => {
            f.src = f.dataset.src;
            f.removeAttribute('data-src');
        });
    }

    // ===== Demo Modal Logic =====
    const demoModal = document.getElementById('demoModal');
    const demoModalIframe = document.getElementById('demoModalIframe');
    const demoModalTitle = document.getElementById('demoModalTitle');
    const demoModalClose = document.getElementById('demoModalClose');
    const demoModalLoader = document.getElementById('demoModalLoader');
    const demoPlayBtns = document.querySelectorAll('.demo-play-btn');

    function openDemoModal(src, title) {
        demoModalTitle.textContent = title;
        demoModalLoader.classList.remove('hidden');
        demoModal.classList.add('active');
        lockScroll();

        // Attach onload BEFORE setting src to avoid race condition
        demoModalIframe.onload = () => {
            demoModalLoader.classList.add('hidden');
        };
        // Use rAF instead of setTimeout — ensures paint completes first
        requestAnimationFrame(() => {
            demoModalIframe.src = src;
        });
    }

    function closeDemoModal() {
        demoModal.classList.remove('active');
        unlockScroll();
        setTimeout(() => {
            demoModalIframe.src = '';
            demoModalIframe.onload = null;
            demoModalLoader.classList.remove('hidden');
        }, 400);
    }

    demoPlayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const src = btn.getAttribute('data-demo');
            const title = btn.getAttribute('data-title');
            openDemoModal(src, title);
        });
    });

    if (demoModalClose) {
        demoModalClose.addEventListener('click', closeDemoModal);
    }

    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                closeDemoModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal && demoModal.classList.contains('active')) {
            closeDemoModal();
        }
    });

    // ===== Package toggle collapsible =====
    const packageToggles = document.querySelectorAll('.package-toggle');
    packageToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const collapsible = btn.nextElementSibling;
            const isOpen = collapsible.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(isOpen));
        });
    });
});
