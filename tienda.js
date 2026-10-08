// ============================================================
// ========== TIENDA NOIR BLVNK ===============================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🛍️ NOIR BLVNK inicializada');

    // ============================================================
    // ========== ESTADO GLOBAL ===================================
    // ============================================================

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // Guardia: compartido.js debe cargarse antes que tienda.js
    if (!window.NB) {
        console.error('⚠️ Falta compartido.js (cargarlo antes que tienda.js)');
        return;
    }

    const state = {
        favorites: NB.loadArray('nb_favs').map(f => String(f)),
        activeFilter: 'todo',
        activeSort: 'default'
    };

    // ============================================================
    // ========== UTILIDADES (de compartido.js) ===================
    // ============================================================

    const formatPrice = NB.formatPrice;
    const normalize = NB.normalize;

    function toast(msg, type = 'success') {
        NB.toast(msg, type);
    }

    // ============================================================
    // ========== ORDENAMIENTO ====================================
    // ============================================================

    const grid = document.getElementById('productGrid') || document.querySelector('.shop-grid');
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
                case 'alpha':      return nameA.localeCompare(nameB);
                case 'alpha-desc': return nameB.localeCompare(nameA);
                case 'price-asc':  return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                default:           return 0;
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
            state.activeSort = this.value;
            sortProducts(this.value);
        });
    }

    // ============================================================
    // ========== FILTROS POR CHIP ================================
    // ============================================================

    function applyFilter(filter) {
        state.activeFilter = filter;
        if (!grid) return;

        const cards = $$('.shop-card', grid);

        cards.forEach(card => {
            const meta = normalize(card.querySelector('.shop-card-meta')?.textContent || '');
            const title = normalize(card.querySelector('.shop-card-title')?.textContent || '');
            const haystack = meta + ' ' + title;

            const match = filter === 'todo' || haystack.includes(normalize(filter));

            if (match) {
                card.style.display = '';
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = 'cardFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards';
            } else {
                card.style.display = 'none';
            }
        });

        updateCount();
    }

    // ============================================================
    // ========== FILTROS POR NAV =================================
    // ============================================================

    document.querySelectorAll('.shop-nav-bottom a').forEach(link => {
        link.addEventListener('click', function (e) {
            const filter = this.dataset.filter;

            // Si NO tiene data-filter, es un link normal (#newdrop)
            if (!filter) return;

            e.preventDefault();

            document.querySelectorAll('.shop-nav-bottom a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');

            if (filter === 'todo') {
                applyFilter('todo');
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            applyFilter(filter);
            document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ============================================================
    // ========== CONTADOR ========================================
    // ============================================================

    function updateCount() {
        if (!grid || !productCount) return;
        const visible = $$('.shop-card', grid).filter(c => c.style.display !== 'none').length;
        productCount.textContent = visible + ' producto' + (visible !== 1 ? 's' : '');
    }
    updateCount();

    // ============================================================
    // ========== FAVORITOS =======================================
    // ============================================================

    function syncFavoritesUI() {
        $$('.shop-card-fav').forEach(btn => {
            const card = btn.closest('.shop-card');
            if (!card) return;
            const id = card.dataset.name || '';
            if (state.favorites.includes(id)) {
                btn.classList.add('active');
                btn.textContent = '♥';
            }
        });
    }

    $$('.shop-card-fav').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.shop-card');
            const id = card?.dataset.name || 'generic-' + Math.random();

            const idx = state.favorites.indexOf(id);
            if (idx === -1) {
                state.favorites.push(id);
                this.classList.add('active');
                this.textContent = '♥';
                toast('Añadido a favoritos', 'success');
            } else {
                state.favorites.splice(idx, 1);
                this.classList.remove('active');
                this.textContent = '♡';
                toast('Quitado de favoritos', 'info');
            }
            NB.saveArray('nb_favs', state.favorites);
        });
    });

    syncFavoritesUI();

    // ============================================================
    // ========== CARRITO (vía compartido.js) =====================
    // ============================================================

    // Añadir rápido desde la tarjeta del catálogo
    $$('.shop-card-hover span').forEach(span => {
        span.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.shop-card');
            if (!card) return;

            // id unificado: data-id del catálogo + color por defecto + talla M
            const key = card.dataset.id || normalize(card.dataset.name || 'producto');
            const color = card.dataset.color || NB.DEFAULT_COLORS[key] || 'Negro';

            NB.addToCart({
                productId: key,
                color: color,
                size: NB.DEFAULT_SIZE,
                name: card.dataset.name || 'Producto',
                price: parseFloat(card.dataset.price) || 0,
                img: card.querySelector('img')?.src || '',
                qty: 1
            });

            const original = this.textContent;
            this.textContent = '✓ Añadido';
            setTimeout(() => { this.textContent = original; }, 1400);
        });
    });

    // Click en botón carrito del nav
    $$('.shop-icon-btn').forEach(btn => {
        if (btn.getAttribute('aria-label') === 'Carrito') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                NB.openDrawer();
            });
        }
    });

    NB.renderBadge();

    // ============================================================
    // ========== BUSCADOR ========================================
    // ============================================================

    function buildSearch() {
        if (document.getElementById('nb-search')) return;
        const html = `
            <div class="nb-modal" id="nb-search">
                <div class="nb-modal-inner">
                    <button class="nb-modal-close" id="nbSearchClose" aria-label="Cerrar">✕</button>
                    <span class="nb-modal-eyebrow">Búsqueda</span>
                    <h3 class="nb-modal-title">¿Qué buscas?</h3>
                    <input type="text" id="nbSearchInput" class="nb-modal-input" placeholder="Escribe un nombre…" autocomplete="off">
                    <div class="nb-search-results" id="nbSearchResults"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        const modal = document.getElementById('nb-search');
        const input = document.getElementById('nbSearchInput');
        const results = document.getElementById('nbSearchResults');

        document.getElementById('nbSearchClose')?.addEventListener('click', () => {
            modal?.classList.remove('is-open');
        });
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('is-open');
        });

        input?.addEventListener('input', () => {
            if (!results) return;
            const q = normalize(input.value.trim());
            if (!q) {
                results.innerHTML = '<p class="nb-search-hint">Empieza a escribir para ver resultados…</p>';
                return;
            }
            if (!grid) {
                results.innerHTML = '<p class="nb-search-hint">El catálogo está en el <a href="index.html">inicio</a></p>';
                return;
            }
            const matches = $$('.shop-card', grid).filter(card => {
                const name = normalize(card.dataset.name || '');
                return name.includes(q);
            });
            if (!matches.length) {
                results.innerHTML = '<p class="nb-search-hint">Sin resultados</p>';
                return;
            }
            results.innerHTML = matches.map(card => {
                const name = card.dataset.name || 'Producto';
                const price = parseFloat(card.dataset.price) || 0;
                const img = card.querySelector('img')?.src || '';
                // Se conserva el ?id= del enlace original para abrir el detalle correcto
                const href = card.querySelector('a[href*="producto.html"]')?.getAttribute('href') || 'producto.html';
                return `<a href="${href}" class="nb-search-item">
                    <img src="${img}" alt="${name}">
                    <div>
                        <strong>${name}</strong>
                        <span>${formatPrice(price)}</span>
                    </div>
                </a>`;
            }).join('');
        });

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal?.classList.remove('is-open');
        });
    }

    $$('.shop-icon-btn').forEach(btn => {
        if (btn.getAttribute('aria-label') === 'Buscar') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                buildSearch();
                const modal = document.getElementById('nb-search');
                modal?.classList.add('is-open');
                setTimeout(() => document.getElementById('nbSearchInput')?.focus(), 100);
            });
        }
    });

    // ============================================================
    // ========== SELECTOR DE PAÍS ================================
    // ============================================================

    const countryBtn = $('.shop-country-btn');
    if (countryBtn) {
        const countries = [
            { code: 'MX', label: 'México', currency: 'MXN' },
            { code: 'US', label: 'Estados Unidos', currency: 'USD' },
            { code: 'EU', label: 'Europa', currency: 'EUR' }
        ];

        const menu = document.createElement('div');
        menu.className = 'nb-country-menu';
        menu.innerHTML = countries.map(c =>
            `<button data-code="${c.code}" data-label="${c.label}">${c.label} <span>${c.code}</span></button>`
        ).join('');
        const countryWrap = countryBtn.parentElement;
        if (countryWrap) {
            countryWrap.style.position = 'relative';
            countryWrap.appendChild(menu);
        }

        countryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('is-open');
        });

        menu.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const labelNode = countryBtn.childNodes[0];
            if (labelNode) labelNode.nodeValue = btn.dataset.code + ' ';
            menu.classList.remove('is-open');
            toast('País cambiado a ' + btn.dataset.label, 'info');
        });

        document.addEventListener('click', () => menu.classList.remove('is-open'));
    }

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
            return firstCard.offsetWidth + 20;
        };

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        function updateCarouselUI() {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            const scrollLeft = carousel.scrollLeft;

            prevBtn.disabled = scrollLeft <= 5;
            nextBtn.disabled = scrollLeft >= maxScroll - 5;

            if (progressBar) {
                const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
                const widthPct = Math.max(20, (carousel.clientWidth / carousel.scrollWidth) * 100);
                progressBar.style.width = widthPct + '%';
                progressBar.style.transform = `translateX(${ratio * (100 - widthPct) / widthPct * 100}%)`;
            }
        }

        carousel.addEventListener('scroll', updateCarouselUI);
        window.addEventListener('resize', updateCarouselUI);
        setTimeout(updateCarouselUI, 100);

        let isDown = false, startX = 0, scrollStart = 0;

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
            if (!button) return;
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
                    if (input) input.value = '';
                    toast('Suscripción confirmada', 'success');
                } else {
                    throw new Error('Respuesta no válida');
                }
            } catch (error) {
                button.textContent = '✕ ERROR';
                toast('Error al suscribir', 'error');
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
    // ========== MENÚ LATERAL ====================================
    // ============================================================

    const menuToggle = document.querySelector('.shop-menu-toggle');
    const menuEl = document.getElementById('nbMenu');
    const menuOverlay = document.getElementById('nbMenuOverlay');
    const menuClose = document.getElementById('nbMenuClose');

    function openMenu() {
        menuEl?.classList.add('is-open');
        menuOverlay?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuEl?.classList.remove('is-open');
        menuOverlay?.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (menuToggle && menuEl) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            openMenu();
        });

        menuOverlay?.addEventListener('click', closeMenu);
        menuClose?.addEventListener('click', closeMenu);

        menuEl.querySelectorAll('.nb-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 150);
            });
        });
    }

    // ============================================================
    // ========== CURSOR PERSONALIZADO ============================
    // ============================================================

    // Solo en desktop (no en móvil)
    if (window.matchMedia('(min-width: 769px)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-dot';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('.shop-card, .carousel-card, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
        });
    }

    // ============================================================
    // ========== KEYBOARD SHORTCUTS ==============================
    // ============================================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const checkoutOpen = document.getElementById('nb-checkout')?.classList.contains('is-open');
            NB.closeCheckout();
            if (!checkoutOpen) NB.closeDrawer();
            closeMenu();
            $$('.nb-modal').forEach(m => m.classList.remove('is-open'));
            $$('.nb-country-menu').forEach(m => m.classList.remove('is-open'));
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $$('.shop-icon-btn').forEach(btn => {
                if (btn.getAttribute('aria-label') === 'Buscar') btn.click();
            });
        }
    });

    // ============================================================
    // ========== LOG FINAL =======================================
    // ============================================================

    console.log('✅ Listo con ' + (grid ? grid.querySelectorAll('.shop-card').length : 0) + ' productos');
});