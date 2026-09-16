document.addEventListener('DOMContentLoaded', function() {
    console.log('🖤 NOIR BLVNK — Iniciado');

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

    // ============================================================
    // ========== THEME TOGGLE ====================================
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
    // ========== MENÚ MÓVIL ======================================
    // ============================================================

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('active');
            if (isOpen) closeMobileMenu();
            else openMobileMenu();
        });

        mobileMenu.querySelectorAll('.mobile-menu-link').forEach(function(link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Cierra el menú si la pantalla vuelve a tamaño desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ============================================================
    // ========== LOOKBOOK CARRUSEL ==============================
    // ============================================================

    const carousel = document.getElementById('lookbookCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 324;
        prevBtn.addEventListener('click', function() {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', function() {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        let autoScroll = setInterval(function() {
            if (!carousel.matches(':hover')) {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 4000);
        carousel.addEventListener('scroll', function() {
            clearInterval(autoScroll);
            autoScroll = setInterval(function() {
                if (!carousel.matches(':hover')) {
                    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 4000);
        });
        carousel.addEventListener('mouseenter', function() {
            clearInterval(autoScroll);
        });
        carousel.addEventListener('mouseleave', function() {
            autoScroll = setInterval(function() {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }, 4000);
        });
    }

    // ============================================================
    // ========== CARRUSEL 3D (HERO) ==============================
    // ============================================================

    const products = [
        {
            id: 'feardeath',
            number: '✦ N°05',
            title: 'I HAVE NO',
            subtitle: 'FEAR OF DEATH',
            price: '$890 MXN',
            size: 'Oversized 280g',
            image: 'feardeath.jpg',
            badge: '✦ EDICIÓN LIMITADA',
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Fear%20Of%20Death%20Tee*%20%F0%9F%96%A4%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24890%20MXN%0A%F0%9F%93%A6%20N%C2%B005%20%E2%80%94%20HIELO',
            detail: 'producto.html?id=feardeath'
        },
        {
            id: 'run',
            number: '✦ N°01',
            title: 'I JUST',
            subtitle: 'WANNA RUN',
            price: '$780 MXN',
            size: 'Oversized 280g',
            image: 'run.jpg',
            badge: '✦ BEST SELLER',
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Solo%20Run%20Tee*%20%F0%9F%8F%83%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24780%20MXN%0A%F0%9F%93%A6%20N%C2%B001%20%E2%80%94%20MADRUGADA',
            detail: 'producto.html?id=run'
        },
        {
            id: 'race',
            number: '✦ N°02',
            title: 'RACES ARE WON',
            subtitle: 'IN THE CORNERS',
            price: '$780 MXN',
            size: 'Oversized 280g',
            image: 'race.jpg',
            badge: '✦ NUEVO DROP',
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Corners%20Tee*%20%F0%9F%8F%8E%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24780%20MXN%0A%F0%9F%93%A6%20N%C2%B002%20%E2%80%94%20PISTA',
            detail: 'producto.html?id=race'
        },
        {
            id: 'noirclub',
            number: '✦ N°03',
            title: '1989 · PARIS',
            subtitle: 'FRANCE',
            price: '$820 MXN',
            size: 'Oversized 280g',
            image: 'noirclub.jpg',
            badge: '✦ EDICIÓN ESPECIAL',
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Noir%20Club%20Tee*%20%F0%9F%97%BC%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24820%20MXN%0A%F0%9F%93%A6%20N%C2%B003%20%E2%80%94%20MEDIANOCHE',
            detail: 'producto.html?id=noirclub'
        },
        {
            id: 'boxing',
            number: '✦ N°04',
            title: 'FALL DOWN.',
            subtitle: 'GET UP. AGAIN.',
            price: '$780 MXN',
            size: 'Oversized 280g',
            image: 'boxing.jpg',
            badge: '✦ BEST SELLER',
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Keep%20Fighting%20Tee*%20%F0%9F%A5%8A%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24780%20MXN%0A%F0%9F%93%A6%20N%C2%B004%20%E2%80%94%20CUADRIL%C3%81TERO',
            detail: 'producto.html?id=boxing'
        }
    ];

    const track = document.getElementById('carousel3dTrack');
    const prev3d = document.getElementById('carousel3dPrev');
    const next3d = document.getElementById('carousel3dNext');
    const counter = document.getElementById('carousel3dCounter');
    const progressFill = document.getElementById('carousel3dProgress');

    const productNumber = document.getElementById('productNumber');
    const productTitle = document.getElementById('productTitle');
    const productSubtitle = document.getElementById('productSubtitle');
    const productPrice = document.getElementById('productPrice');
    const productSize = document.getElementById('productSize');
    const productWhatsapp = document.getElementById('productWhatsapp');
    const productDetail = document.getElementById('productDetail');

    if (track && prev3d && next3d) {
        let currentIndex = 0;
        const total = products.length;
        let isAnimating = false;

        products.forEach((product, index) => {
            const slide = document.createElement('div');
            slide.className = 'hero-premium-carousel-3d-slide';
            slide.dataset.index = index;
            slide.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <span class="slide-badge">${product.badge}</span>
            `;
            track.appendChild(slide);
        });

        const slides = track.querySelectorAll('.hero-premium-carousel-3d-slide');

        function updateCarousel(index) {
            if (isAnimating) return;
            isAnimating = true;

            const totalSlides = slides.length;

            slides.forEach((slide, i) => {
                slide.className = 'hero-premium-carousel-3d-slide';
                let diff = i - index;
                if (diff > totalSlides / 2) diff -= totalSlides;
                if (diff < -totalSlides / 2) diff += totalSlides;

                if (diff === 0) {
                    slide.classList.add('active');
                } else if (diff === -1) {
                    slide.classList.add('prev');
                } else if (diff === 1) {
                    slide.classList.add('next');
                } else if (diff === -2) {
                    slide.classList.add('prev-2');
                } else if (diff === 2) {
                    slide.classList.add('next-2');
                }
            });

            const product = products[index];
            if (product) {
                if (productNumber) productNumber.textContent = product.number;
                if (productTitle) {
                    const titleSpan = productTitle.querySelector('span:first-child');
                    if (titleSpan) titleSpan.textContent = product.title;
                }
                if (productSubtitle) productSubtitle.textContent = product.subtitle;
                if (productPrice) productPrice.textContent = product.price;
                if (productSize) productSize.textContent = product.size;
                if (productWhatsapp) productWhatsapp.href = product.whatsapp;
                if (productDetail) productDetail.href = product.detail;
            }

            if (counter) {
                const current = String(index + 1).padStart(2, '0');
                const totalStr = String(totalSlides).padStart(2, '0');
                counter.textContent = `${current} / ${totalStr}`;
            }

            currentIndex = index;
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % total;
            updateCarousel(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + total) % total;
            updateCarousel(prevIndex);
        }

        function restartProgress() {
            if (!progressFill) return;
            progressFill.classList.remove('running');
            progressFill.classList.add('paused');
            // Forzamos reflow para poder reiniciar la animación de 0%
            void progressFill.offsetWidth;
            progressFill.classList.remove('paused');
            progressFill.classList.add('running');
        }

        function stopProgress() {
            if (!progressFill) return;
            const computedWidth = getComputedStyle(progressFill).width;
            progressFill.style.width = computedWidth;
            progressFill.classList.remove('running');
            progressFill.classList.add('paused');
        }

        prev3d.addEventListener('click', function() { prevSlide(); restartProgress(); });
        next3d.addEventListener('click', function() { nextSlide(); restartProgress(); });

        let autoPlay = setInterval(function() { nextSlide(); restartProgress(); }, 4500);
        const container = document.querySelector('.hero-premium-carousel-3d');
        if (container) {
            container.addEventListener('mouseenter', () => {
                clearInterval(autoPlay);
                stopProgress();
            });
            container.addEventListener('mouseleave', () => {
                restartProgress();
                autoPlay = setInterval(function() { nextSlide(); restartProgress(); }, 4500);
            });
        }

        updateCarousel(0);
        restartProgress();
        console.log('✅ Carrusel 3D inicializado con ' + total + ' productos');
    }

    // ============================================================
    // ========== MODAL TÉRMINOS ==================================
    // ============================================================

    const termsModal = document.getElementById('termsModal');
    const openTermsBtn = document.getElementById('openTerms');
    const closeTermsBtn = document.getElementById('closeTerms');

    function openModal() {
        termsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openTermsBtn) {
        openTermsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }

    if (closeTermsBtn) {
        closeTermsBtn.addEventListener('click', closeModal);
    }

    termsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && termsModal.classList.contains('active')) {
            closeModal();
        }
    });

    const privacyLink = document.getElementById('privacyLink');
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Política de Privacidad - Próximamente disponible.');
        });
    }

    const openPrivacyBtn = document.getElementById('openPrivacy');
    if (openPrivacyBtn) {
        openPrivacyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Política de Privacidad - Próximamente disponible.');
        });
    }

    // ============================================================
    // ========== CONTACTO - FORMULARIO ===========================
    // ============================================================

    const $form = document.getElementById('form-noir');
    const $status = document.getElementById('form-status');
    const $btnText = document.getElementById('btn-submit-text');

    if ($form) {
        $form.addEventListener('submit', async function(event) {
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
                    headers: { 'Accept': 'application/json' }
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
    }

    // ============================================================
// ========== REFLEJO DE LUZ EN TARJETAS ======================
// ============================================================

const collectionCards = document.querySelectorAll('.collection-noir-card');

collectionCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
        
        // Efecto de inclinación 3D (opcional)
        const rotateX = ((y - 50) / 50) * -3;
        const rotateY = ((x - 50) / 50) * 3;
        
        card.style.transform = `translateY(-20px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

    console.log('✅ NOIR BLVNK — Listo');
});

// ============================================================
// ========== TOQUES EN MÓVIL =================================
// ============================================================

const collectionCards = document.querySelectorAll('.collection-noir-card');
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (isTouchDevice) {
    console.log('📱 Dispositivo táctil detectado — activando modo touch');
    
    collectionCards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            // Quitar "touched" de todas las tarjetas
            collectionCards.forEach(c => c.classList.remove('touched'));
            
            // Agregar "touched" a la tarjeta tocada
            this.classList.add('touched');
            
            // Vibración sutil (si el dispositivo lo soporta)
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }, { passive: true });
    });
    
    // Quitar "touched" al tocar fuera
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('.collection-noir-card')) {
            collectionCards.forEach(c => c.classList.remove('touched'));
        }
    }, { passive: true });
}

// ============================================================
// ========== ANIMACIONES SCROLL COLECCIÓN ====================
// ============================================================

(function() {
    const collectionCards = document.querySelectorAll('.collection-noir-card');
    
    if (collectionCards.length === 0) return;
    
    // ===== ELIGE LA ANIMACIÓN =====
    // Opciones: 'anim-blur', 'anim-rotate', 'anim-slide', 'anim-clip',
    //           'anim-glow', 'anim-float', 'anim-flip', 'anim-zoom'
    const ANIMATION = 'anim-glow'; // ← Cambia esto por la que quieras
    
    // Aplicar la clase de animación a todas las tarjetas
    collectionCards.forEach(card => {
        card.classList.add(ANIMATION);
    });
    
    // ===== INTERSECTION OBSERVER =====
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });
    
    collectionCards.forEach(card => {
        cardObserver.observe(card);
    });
    
    console.log('🎨 Animación aplicada:', ANIMATION);
})();

