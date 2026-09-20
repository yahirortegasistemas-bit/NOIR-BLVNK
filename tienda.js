// ============================================================
// ========== TIENDA NOIR BLVNK ===============================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🛍️ NOIR BLVNK inicializada');

    // ============================================================
    // ========== ORDENAMIENTO ====================================
    // ============================================================

    const grid = document.getElementById('productGrid');
    const sortSelect = document.getElementById('sortSelect');
    const productCount = document.getElementById('productCount');

    function sortProducts(criteria) {
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll('.shop-card'));

        cards.forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });

        cards.sort((a, b) => {
            const nameA = (a.dataset.name || '').toLowerCase();
            const nameB = (b.dataset.name || '').toLowerCase();
            const priceA = parseFloat(a.dataset.price) || 0;
            const priceB = parseFloat(b.dataset.price) || 0;

            switch (criteria) {
                case 'alpha':       return nameA.localeCompare(nameB);
                case 'alpha-desc':  return nameB.localeCompare(nameA);
                case 'price-asc':   return priceA - priceB;
                case 'price-desc':  return priceB - priceA;
                default:            return 0;
            }
        });

        cards.forEach(card => grid.appendChild(card));

        requestAnimationFrame(() => {
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.animation = `cardFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards`;
                }, i * 50);
            });
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortProducts(this.value);
        });
    }

    // ============================================================
    // ========== CONTADOR ========================================
    // ============================================================

    function updateCount() {
        if (!grid || !productCount) return;
        const count = grid.querySelectorAll('.shop-card').length;
        productCount.textContent = count + ' producto' + (count !== 1 ? 's' : '');
    }
    updateCount();

    // ============================================================
    // ========== CHIPS DE FILTRO =================================
    // ============================================================

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ============================================================
    // ========== FAVORITOS =======================================
    // ============================================================

    document.querySelectorAll('.shop-card-fav, .price-card__fav, .product-fav').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            this.textContent = this.classList.contains('active') ? '♥' : '♡';
        });
    });

    // ============================================================
    // ========== AÑADIR RÁPIDO ===================================
    // ============================================================

    const cartBadge = document.querySelector('.shop-cart-badge');
    let cartCount = 0;

    function bumpCart() {
        cartCount++;
        if (cartBadge) cartBadge.textContent = cartCount;

        if (cartBadge) {
            cartBadge.style.transform = 'scale(1.4)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 220);
        }
    }

    document.querySelectorAll('.shop-card-hover span').forEach(span => {
        span.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            bumpCart();
            const original = this.textContent;
            this.textContent = '✓ Añadido';
            setTimeout(() => { this.textContent = original; }, 1400);
        });
    });

    // ============================================================
    // ========== CARRUSEL ========================================
    // ============================================================

    const carousel = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const progressBar = document.getElementById('carouselProgress');

    if (carousel && prevBtn && nextBtn) {
        const getScrollAmount = () => {
            const firstCard = carousel.querySelector('.carousel-card');
            if (!firstCard) return 320;
            const gap = 20;
            return firstCard.offsetWidth + gap;
        };

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        // Actualizar barra de progreso y estados de botones
        function updateCarouselUI() {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            const scrollLeft = carousel.scrollLeft;

            // Botones
            prevBtn.disabled = scrollLeft <= 5;
            nextBtn.disabled = scrollLeft >= maxScroll - 5;

            // Progreso
            if (progressBar) {
                const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
                const widthPct = Math.max(20, (carousel.clientWidth / carousel.scrollWidth) * 100);
                progressBar.style.width = widthPct + '%';
                progressBar.style.transform = `translateX(${ratio * (100 - widthPct) / widthPct * 100}%)`;
            }
        }

        carousel.addEventListener('scroll', updateCarouselUI);
        window.addEventListener('resize', updateCarouselUI);

        // Estado inicial
        setTimeout(updateCarouselUI, 100);

        // Arrastrar con mouse (desktop)
        let isDown = false;
        let startX = 0;
        let scrollStart = 0;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollStart = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5;
            carousel.scrollLeft = scrollStart - walk;
        });

        carousel.style.cursor = 'grab';
    }

    // ============================================================
    // ========== NEWSLETTER ======================================
    // ============================================================

    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const button = this.querySelector('button');
            const originalText = button.textContent;

            button.textContent = 'ENVIANDO...';
            button.disabled = true;

            try {
                const response = await fetch('https://formspree.io/f/moeqeqbv', {
                    method: 'POST',
                    body: new FormData(this),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    button.textContent = '✓ SUSCRITO';
                    input.value = '';
                } else {
                    throw new Error();
                }
            } catch (error) {
                button.textContent = '✕ ERROR';
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2500);
        });
    }

    // ============================================================
    // ========== LAZY LOAD =======================================
    // ============================================================

    const images = document.querySelectorAll('.shop-card-image img, .carousel-card-image img');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.7s ease';

                    if (img.complete) {
                        img.style.opacity = '1';
                    } else {
                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        });
                    }

                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.05 });

        images.forEach(img => imageObserver.observe(img));
    }

    // ============================================================
    // ========== PAGINACIÓN ======================================
    // ============================================================

    document.querySelectorAll('.shop-page-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled || this.textContent === '‹' || this.textContent === '›') return;
            document.querySelectorAll('.shop-page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    console.log('✅ Listo con ' + (grid ? grid.querySelectorAll('.shop-card').length : 0) + ' productos');
});