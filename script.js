document.addEventListener('DOMContentLoaded', function() {
    console.log('🖤 NOIR BLVNK — Playeras flotando');
    console.log('✨ Efecto 3D activado');

    // ========== SPOTLIGHT ==========
    const spot = document.getElementById('spotlight');
    if (spot) {
        window.addEventListener('pointermove', function(e) {
            spot.style.setProperty('--mx', e.clientX + 'px');
            spot.style.setProperty('--my', e.clientY + 'px');
        });
    }

    // ========== REVEAL ON SCROLL ==========
    const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
            if (en.isIntersecting) {
                en.target.classList.add('in');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function(el) {
        io.observe(el);
    });

    // ========== PAUSE MARQUEE ==========
    const marquee = document.querySelector('.marquee');
    if (marquee) {
        marquee.addEventListener('mouseenter', function() {
            marquee.style.animationPlayState = 'paused';
        });
        marquee.addEventListener('mouseleave', function() {
            marquee.style.animationPlayState = 'running';
        });
    }

    // ========== CARRUSEL LOOKBOOK ==========
    const carousel = document.getElementById('carousel3d');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 324;
        
        prevBtn.addEventListener('click', function() {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        let autoScroll = setInterval(function() {
            if (!carousel.matches(':hover')) {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 4000);
        
        carousel.addEventListener('scroll', function() {
            clearInterval(autoScroll);
            autoScroll = setInterval(function() {
                if (!carousel.matches(':hover')) {
                    carousel.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }, 4000);
        });
        
        carousel.addEventListener('mouseenter', function() {
            clearInterval(autoScroll);
        });
        
        carousel.addEventListener('mouseleave', function() {
            autoScroll = setInterval(function() {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }, 4000);
        });
    }

    // ============================================================
    // ========== THEME TOGGLE (Modo Claro / Oscuro) ==============
    // ============================================================

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        const icon = isLight ? '☀️' : '🌙';
        if (themeIcon) themeIcon.textContent = icon;
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    function applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else if (savedTheme === 'dark') {
            document.body.classList.remove('light-mode');
            if (themeIcon) themeIcon.textContent = '🌙';
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!prefersDark) {
                document.body.classList.add('light-mode');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                document.body.classList.remove('light-mode');
                if (themeIcon) themeIcon.textContent = '🌙';
            }
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    applyTheme();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.remove('light-mode');
                if (themeIcon) themeIcon.textContent = '🌙';
            } else {
                document.body.classList.add('light-mode');
                if (themeIcon) themeIcon.textContent = '☀️';
            }
        }
    });

    // ============================================================
    // ========== HERO CARRUSEL ====================================
    // ============================================================

    const heroCarousel = document.getElementById('heroCarousel');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    const heroDots = document.getElementById('heroDots');

    if (heroCarousel && heroPrevBtn && heroNextBtn) {
        const scrollAmount = 300;
        
        const items = heroCarousel.querySelectorAll('.hero-carousel-item');
        const totalItems = items.length;
        
        items.forEach((item, index) => {
            const dot = document.createElement('button');
            dot.classList.add('hero-dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                heroCarousel.scrollTo({
                    left: index * scrollAmount,
                    behavior: 'smooth'
                });
            });
            heroDots.appendChild(dot);
        });
        
        function updateDots() {
            const scrollLeft = heroCarousel.scrollLeft;
            const activeIndex = Math.round(scrollLeft / scrollAmount);
            document.querySelectorAll('.hero-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }
        
        heroCarousel.addEventListener('scroll', updateDots);
        
        heroPrevBtn.addEventListener('click', function() {
            heroCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        heroNextBtn.addEventListener('click', function() {
            heroCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        let heroAutoScroll = setInterval(function() {
            if (!heroCarousel.matches(':hover')) {
                heroCarousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 4500);
        
        heroCarousel.addEventListener('mouseenter', function() {
            clearInterval(heroAutoScroll);
        });
        
        heroCarousel.addEventListener('mouseleave', function() {
            heroAutoScroll = setInterval(function() {
                heroCarousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }, 4500);
        });
        
        heroCarousel.addEventListener('scroll', function() {
            clearInterval(heroAutoScroll);
            heroAutoScroll = setInterval(function() {
                if (!heroCarousel.matches(':hover')) {
                    heroCarousel.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }, 4500);
        });
    }

    console.log('✅ NOIR BLVNK — Listo');
});

// ============================================================
// ========== CONTACTO — FORMULARIO (Formspree) ===============
// ============================================================

const $form = document.getElementById('form-noir');
const $status = document.getElementById('form-status');
const $btnText = document.getElementById('btn-submit-text');

if ($form) {
    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        $btnText.innerText = "ENVIANDO...";
        $btnText.style.opacity = "0.7";
        $btnText.style.pointerEvents = "none";
        
        $status.classList.remove('success', 'error');
        $status.innerText = "";

        const formData = new FormData($form);

        try {
            const response = await fetch('https://formspree.io/f/moeqeqbv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                $form.reset();
                $status.classList.add('success');
                $status.innerText = "✦ ENVIADO CORRECTAMENTE. RESPONDEREMOS ANTES DE LAS 6AM.";
            } else {
                throw new Error();
            }
        } catch (error) {
            $status.classList.add('error');
            $status.innerText = "✕ ERROR DE CONEXIÓN. INTÉNTALO DE NUEVO.";
        } finally {
            $btnText.innerText = "ENVIAR MENSAJE";
            $btnText.style.opacity = "1";
            $btnText.style.pointerEvents = "auto";
        }
    });

    // ============================================================
// ========== HERO CARRUSEL PREMIUM ============================
// ============================================================

const heroPremiumCarousel = document.getElementById('heroPremiumCarousel');
const heroPremiumPrev = document.getElementById('heroPremiumPrev');
const heroPremiumNext = document.getElementById('heroPremiumNext');
const heroPremiumDots = document.getElementById('heroPremiumDots');
const heroPremiumCounter = document.getElementById('heroPremiumCounter');

if (heroPremiumCarousel && heroPremiumPrev && heroPremiumNext) {
    const premiumSlides = heroPremiumCarousel.querySelectorAll('.hero-premium-slide');
    const totalPremium = premiumSlides.length;
    let currentPremium = 0;
    
    // Crear dots
    premiumSlides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-premium-dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dot.addEventListener('click', () => {
            currentPremium = index;
            heroPremiumCarousel.scrollTo({
                left: index * heroPremiumCarousel.offsetWidth,
                behavior: 'smooth'
            });
            updatePremiumUI();
        });
        heroPremiumDots.appendChild(dot);
    });
    
    function updatePremiumUI() {
        const scrollLeft = heroPremiumCarousel.scrollLeft;
        const width = heroPremiumCarousel.offsetWidth;
        const activeIndex = Math.round(scrollLeft / width);
        currentPremium = activeIndex;
        
        document.querySelectorAll('.hero-premium-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
        
        if (heroPremiumCounter) {
            const current = String(activeIndex + 1).padStart(2, '0');
            const total = String(totalPremium).padStart(2, '0');
            heroPremiumCounter.textContent = `${current} / ${total}`;
        }
    }
    
    heroPremiumCarousel.addEventListener('scroll', updatePremiumUI);
    
    // Botones
    heroPremiumPrev.addEventListener('click', () => {
        if (currentPremium > 0) {
            currentPremium--;
        } else {
            currentPremium = totalPremium - 1;
        }
        heroPremiumCarousel.scrollTo({
            left: currentPremium * heroPremiumCarousel.offsetWidth,
            behavior: 'smooth'
        });
        updatePremiumUI();
    });
    
    heroPremiumNext.addEventListener('click', () => {
        if (currentPremium < totalPremium - 1) {
            currentPremium++;
        } else {
            currentPremium = 0;
        }
        heroPremiumCarousel.scrollTo({
            left: currentPremium * heroPremiumCarousel.offsetWidth,
            behavior: 'smooth'
        });
        updatePremiumUI();
    });
    
    // Auto-scroll
    let premiumAutoScroll = setInterval(() => {
        if (!heroPremiumCarousel.matches(':hover')) {
            currentPremium = (currentPremium + 1) % totalPremium;
            heroPremiumCarousel.scrollTo({
                left: currentPremium * heroPremiumCarousel.offsetWidth,
                behavior: 'smooth'
            });
            updatePremiumUI();
        }
    }, 5000);
    
    heroPremiumCarousel.addEventListener('mouseenter', () => {
        clearInterval(premiumAutoScroll);
    });
    
    heroPremiumCarousel.addEventListener('mouseleave', () => {
        premiumAutoScroll = setInterval(() => {
            currentPremium = (currentPremium + 1) % totalPremium;
            heroPremiumCarousel.scrollTo({
                left: currentPremium * heroPremiumCarousel.offsetWidth,
                behavior: 'smooth'
            });
            updatePremiumUI();
        }, 5000);
    });
    
    window.addEventListener('resize', () => {
        heroPremiumCarousel.scrollTo({
            left: currentPremium * heroPremiumCarousel.offsetWidth,
            behavior: 'auto'
        });
    });
    
    // Inicializar
    updatePremiumUI();
}
}