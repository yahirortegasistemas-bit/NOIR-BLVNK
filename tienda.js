// ============================================================
// ========== TIENDA NOIR BLVNK ===============================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🛍️ NOIR BLVNK inicializada');

    // ============================================================
    // ========== ESTADO GLOBAL ===================================
    // ============================================================

    const state = {
        cart: JSON.parse(localStorage.getItem('nb_cart') || '[]'),
        favorites: JSON.parse(localStorage.getItem('nb_favs') || '[]'),
        activeFilter: 'todo',
        activeSort: 'default'
    };

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const cartBadge = $('.shop-cart-badge');

    // ============================================================
    // ========== UTILIDADES ======================================
    // ============================================================

    function persist() {
        localStorage.setItem('nb_cart', JSON.stringify(state.cart));
        localStorage.setItem('nb_favs', JSON.stringify(state.favorites));
    }

    function formatPrice(n) {
        return '$' + Number(n).toLocaleString('es-MX') + ' MXN';
    }

    // ============================================================
    // ========== TOAST ===========================================
    // ============================================================

    function toast(msg, type = 'success') {
        let el = document.getElementById('nb-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'nb-toast';
            el.className = 'nb-toast';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.className = 'nb-toast nb-toast--' + type + ' is-visible';

        clearTimeout(el._t);
        el._t = setTimeout(() => {
            el.classList.remove('is-visible');
        }, 2200);
    }

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

    function normalize(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function applyFilter(filter) {
        state.activeFilter = filter;
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

    $$('.chip').forEach(chip => {
        chip.addEventListener('click', function () {
            $$('.chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const filter = normalize(this.textContent.trim());
            applyFilter(filter === 'todo' ? 'todo' : filter);
        });
    });

    // ============================================================
    // ========== FILTROS POR CATEGORÍA (NAV) =====================
    // ============================================================

    $$('.shop-nav-bottom a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            $$('.shop-nav-bottom a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');

            const filter = normalize(this.textContent.trim());
            applyFilter(filter === 'todo' ? 'todo' : filter);

            // Sync chip
            $$('.chip').forEach(chip => {
                const chipText = normalize(chip.textContent.trim());
                chip.classList.toggle('active', chipText === filter || (filter === 'todo' && chipText === 'todo'));
            });

            // Scroll al catálogo
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

    $$('.shop-card-fav, .price-card__fav, .product-fav').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.shop-card');
            const id = card?.dataset.name || this.dataset.id || 'generic-' + Math.random();

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
            persist();
        });
    });

    syncFavoritesUI();

    // ============================================================
    // ========== CARRITO =========================================
    // ============================================================

    function cartTotal() {
        return state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    }

    function cartItemCount() {
        return state.cart.reduce((s, i) => s + i.qty, 0);
    }

    function renderCartBadge() {
        if (!cartBadge) return;
        cartBadge.textContent = cartItemCount();
        cartBadge.style.transform = 'scale(1.4)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 220);
    }

    function buildCartDrawer() {
        if (document.getElementById('nb-cart-drawer')) return;

        const html = `
            <div class="nb-cart-overlay" id="nbCartOverlay"></div>
            <aside class="nb-cart-drawer" id="nb-cart-drawer" aria-label="Carrito">
                <header class="nb-cart-header">
                    <h3>Carrito <span id="nbCartCount">0</span></h3>
                    <button class="nb-cart-close" id="nbCartClose" aria-label="Cerrar">✕</button>
                </header>
                <div class="nb-cart-body" id="nbCartBody"></div>
                <footer class="nb-cart-footer">
                    <div class="nb-cart-total">
                        <span>Total</span>
                        <strong id="nbCartTotal">$0 MXN</strong>
                    </div>
                    <button class="nb-cart-checkout" id="nbCartCheckout">Finalizar compra</button>
                    <button class="nb-cart-clear" id="nbCartClear">Vaciar carrito</button>
                </footer>
            </aside>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        document.getElementById('nbCartOverlay').addEventListener('click', closeCart);
        document.getElementById('nbCartClose').addEventListener('click', closeCart);
        document.getElementById('nbCartClear').addEventListener('click', clearCart);
        document.getElementById('nbCartCheckout').addEventListener('click', () => {
            toast('Redirigiendo al checkout...', 'info');
        });

        // Delegación para quitar items
        document.getElementById('nbCartBody').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-remove]');
            if (!btn) return;
            removeFromCart(btn.dataset.remove);
        });
    }

    function renderCart() {
        buildCartDrawer();
        const body = document.getElementById('nbCartBody');
        const countEl = document.getElementById('nbCartCount');
        const totalEl = document.getElementById('nbCartTotal');

        if (!body) return;

        if (state.cart.length === 0) {
            body.innerHTML = `<div class="nb-cart-empty">
                <span class="nb-cart-empty-icon">◇</span>
                <p>Tu carrito está vacío</p>
                <button class="nb-cart-empty-cta" id="nbCartEmptyCta">Ver catálogo</button>
            </div>`;
            document.getElementById('nbCartEmptyCta')?.addEventListener('click', () => {
                closeCart();
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            });
        } else {
            body.innerHTML = state.cart.map(item => `
                <div class="nb-cart-item">
                    <div class="nb-cart-item-image">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="nb-cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="nb-cart-item-price">${formatPrice(item.price)}</span>
                        <div class="nb-cart-item-qty">
                            <button data-remove="${item.id}" aria-label="Quitar">−</button>
                            <span>${item.qty}</span>
                            <button data-add="${item.id}" aria-label="Añadir">+</button>
                        </div>
                    </div>
                    <span class="nb-cart-item-subtotal">${formatPrice(item.price * item.qty)}</span>
                </div>
            `).join('');

            // Delegación + para sumar
            body.querySelectorAll('[data-add]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.add;
                    const item = state.cart.find(i => i.id === id);
                    if (item) {
                        item.qty++;
                        persist();
                        renderCart();
                        renderCartBadge();
                    }
                });
            });
        }

        if (countEl) countEl.textContent = cartItemCount();
        if (totalEl) totalEl.textContent = formatPrice(cartTotal());
    }

    function openCart() {
        renderCart();
        document.getElementById('nb-cart-drawer')?.classList.add('is-open');
        document.getElementById('nbCartOverlay')?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        document.getElementById('nb-cart-drawer')?.classList.remove('is-open');
        document.getElementById('nbCartOverlay')?.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function addToCart({ id, name, price, img }) {
        const existing = state.cart.find(i => i.id === id);
        if (existing) {
            existing.qty++;
        } else {
            state.cart.push({ id, name, price, img, qty: 1 });
        }
        persist();
        renderCartBadge();
        toast('✓ Añadido al carrito', 'success');
    }

    function removeFromCart(id) {
        const idx = state.cart.findIndex(i => i.id === id);
        if (idx === -1) return;
        if (state.cart[idx].qty > 1) {
            state.cart[idx].qty--;
        } else {
            state.cart.splice(idx, 1);
        }
        persist();
        renderCart();
        renderCartBadge();
    }

    function clearCart() {
        if (state.cart.length === 0) return;
        if (!confirm('¿Vaciar el carrito?')) return;
        state.cart = [];
        persist();
        renderCart();
        renderCartBadge();
        toast('Carrito vaciado', 'info');
    }

    // Añadir rápido desde card
    $$('.shop-card-hover span').forEach(span => {
        span.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.shop-card');
            if (!card) return;

            const name = card.dataset.name || 'Producto';
            const price = parseFloat(card.dataset.price) || 0;
            const img = card.querySelector('img')?.src || '';
            const id = name;

            addToCart({ id, name, price, img });

            const original = this.textContent;
            this.textContent = '✓ Añadido';
            setTimeout(() => { this.textContent = original; }, 1400);
        });
    });

    // Click en botón carrito abre drawer
    $$('.shop-icon-btn').forEach(btn => {
        if (btn.getAttribute('aria-label') === 'Carrito') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openCart();
            });
        }
    });

    renderCartBadge();

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

        document.getElementById('nbSearchClose').addEventListener('click', () => {
            modal.classList.remove('is-open');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('is-open');
        });

        input.addEventListener('input', () => {
            const q = normalize(input.value.trim());
            if (!q) {
                results.innerHTML = '<p class="nb-search-hint">Empieza a escribir para ver resultados…</p>';
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
                const name = card.dataset.name;
                const price = parseFloat(card.dataset.price) || 0;
                const img = card.querySelector('img')?.src || '';
                return `<a href="producto.html" class="nb-search-item">
                    <img src="${img}" alt="${name}">
                    <div>
                        <strong>${name}</strong>
                        <span>${formatPrice(price)}</span>
                    </div>
                </a>`;
            }).join('');
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.classList.remove('is-open');
        });
    }

    $$('.shop-icon-btn').forEach(btn => {
        if (btn.getAttribute('aria-label') === 'Buscar') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                buildSearch();
                const modal = document.getElementById('nb-search');
                modal.classList.add('is-open');
                setTimeout(() => document.getElementById('nbSearchInput')?.focus(), 100);
            });
        }
    });

    // ============================================================
    // ========== CUENTA ==========================================
    // ============================================================

    function buildAccount() {
        if (document.getElementById('nb-account')) return;
        const html = `
            <div class="nb-modal" id="nb-account">
                <div class="nb-modal-inner">
                    <button class="nb-modal-close" id="nbAccountClose" aria-label="Cerrar">✕</button>
                    <span class="nb-modal-eyebrow">Cuenta</span>
                    <h3 class="nb-modal-title">Iniciar sesión</h3>
                    <form class="nb-modal-form" id="nbAccountForm">
                        <input type="email" placeholder="tu@correo.com" required>
                        <input type="password" placeholder="Contraseña" required>
                        <button type="submit" class="nb-modal-btn">Entrar</button>
                    </form>
                    <p class="nb-modal-foot">¿No tienes cuenta? <a href="#">Crear una</a></p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        const modal = document.getElementById('nb-account');
        document.getElementById('nbAccountClose').addEventListener('click', () => modal.classList.remove('is-open'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('is-open');
        });
        document.getElementById('nbAccountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            toast('Sesión iniciada (demo)', 'success');
            modal.classList.remove('is-open');
        });
    }

    $$('.shop-icon-btn').forEach(btn => {
        if (btn.getAttribute('aria-label') === 'Cuenta') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                buildAccount();
                document.getElementById('nb-account').classList.add('is-open');
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
        countryBtn.parentElement.style.position = 'relative';
        countryBtn.parentElement.appendChild(menu);

        countryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('is-open');
        });

        menu.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            countryBtn.childNodes[0].nodeValue = btn.dataset.code + ' ';
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
                    toast('Suscripción confirmada', 'success');
                } else {
                    throw new Error();
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
    // ========== PAGINACIÓN ======================================
    // ============================================================

    $$('.shop-page-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled) return;

            const txt = this.textContent.trim();

            if (txt === '‹' || txt === '›') {
                const current = $('.shop-page-btn.active');
                if (!current) return;
                const siblings = $$('.shop-page-btn').filter(b => !isNaN(parseInt(b.textContent)) && b.textContent.length <= 2);
                const idx = siblings.indexOf(current);
                const target = txt === '›' ? siblings[idx + 1] : siblings[idx - 1];
                if (target) {
                    siblings.forEach(b => b.classList.remove('active'));
                    target.classList.add('active');
                    scrollToGrid();
                }
                return;
            }

            if (isNaN(parseInt(txt))) return;
            $$('.shop-page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            scrollToGrid();
        });
    });

    function scrollToGrid() {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('Página cargada', 'info');
    }

    // ============================================================
    // ========== KEYBOARD SHORTCUTS ==============================
    // ============================================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
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

    console.log('✅ Listo con ' + (grid ? grid.querySelectorAll('.shop-card').length : 0) + ' productos');
});