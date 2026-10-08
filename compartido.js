// ============================================================
// ========== NOIR BLVNK — MÓDULO COMPARTIDO ==================
// Carrito, toasts, storage y checkout. Una sola fuente de verdad.
// Cargar ANTES que tienda.js / producto.js
// ============================================================

(function () {
    'use strict';

    // ============================================================
    // ========== CONFIGURACIÓN DE CONTACTO ======================
    // ============================================================

    // Cuando tengas tu número real: whatsapp: '5215512345678'
    // Mientras esté vacío, los botones usan Instagram DM.
    const CONTACTO = {
        whatsapp: '',
        instagram: 'https://www.instagram.com/noirblvnk/',
        instagramDM: 'https://ig.me/m/noirblvnk/'
    };

    // Color por defecto de cada producto (para el carrito unificado)
    const DEFAULT_COLORS = {
        'synonime': 'Negro',
        'cherry-negro': 'Negro',
        'cherry-beige': 'Beige',
        'noir-club': 'Negro',
        'the-only-limit': 'Negro',
        'unseen-story': 'Negro',
        'noir-blvnk-white': 'Blanco'
    };

    const CART_KEY = 'nb_cart_v2';
    const CART_KEY_V1 = 'nb_cart';
    const DEFAULT_SIZE = 'M';

    // ============================================================
    // ========== HELPERS BÁSICOS =================================
    // ============================================================

    function loadArray(key) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.warn('⚠️ localStorage ilegible (' + key + '), se reinicia:', e);
            return [];
        }
    }

    function saveArray(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('⚠️ No se pudo guardar ' + key + ':', e);
        }
    }

    function sanitizeCart(items) {
        return (items || [])
            .filter(item => item && item.id)
            .map(item => ({
                id: String(item.id),
                name: item.name || 'Producto',
                price: Number(item.price) || 0,
                img: item.img || '',
                qty: Math.max(1, parseInt(item.qty, 10) || 1)
            }));
    }

    function formatPrice(n) {
        return '$' + Number(n).toLocaleString('es-MX') + ' MXN';
    }

    function normalize(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand('copy');
                ta.remove();
                return ok;
            } catch (e2) {
                return false;
            }
        }
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
        el.className = 'nb-toast nb-toast--' + (type || 'success') + ' is-visible';

        clearTimeout(el._t);
        el._t = setTimeout(() => {
            el.classList.remove('is-visible');
        }, 2200);
    }

    // ============================================================
    // ========== CARRITO (localStorage) ==========================
    // ============================================================

    // id unificado: "producto|Color|Talla" → misma variante = misma línea
    function variantId(productId, color, size) {
        return productId + '|' + (color || 'Negro') + '|' + (size || DEFAULT_SIZE);
    }

    function keyFromImage(img) {
        if (!img) return '';
        const base = String(img).split('/').pop().split('?')[0];
        return base.replace(/\.(jpe?g|png|webp|avif)$/i, '');
    }

    // Convierte un ítem del carrito viejo (nb_cart) al formato nuevo
    function migrateItem(item) {
        if (!item || !item.id) return null;
        const id = String(item.id);
        if (id.indexOf('|') !== -1) return item; // ya es formato nuevo

        const key = keyFromImage(item.img) || id;
        // Formato viejo de página de producto: "Nombre - Color - Talla"
        const parts = id.split(' - ');
        const hasVariant = parts.length >= 3;
        const color = hasVariant ? parts[1] : (DEFAULT_COLORS[key] || item.color || 'Negro');
        const size = hasVariant ? parts[2] : (item.size || DEFAULT_SIZE);

        return {
            id: variantId(key, color, size),
            name: item.name || 'Producto',
            price: Number(item.price) || 0,
            img: item.img || '',
            qty: Math.max(1, parseInt(item.qty, 10) || 1)
        };
    }

    function getCart() {
        // Primera lectura: migrar carrito v1 → v2 (mejor esfuerzo)
        if (localStorage.getItem(CART_KEY) === null) {
            const old = loadArray(CART_KEY_V1);
            const migrated = old.map(migrateItem).filter(Boolean);
            saveArray(CART_KEY, migrated);
            if (migrated.length) console.log('🔄 Carrito migrado a ' + CART_KEY);
        }
        return sanitizeCart(loadArray(CART_KEY));
    }

    function setCart(cart) {
        saveArray(CART_KEY, cart);
    }

    function cartCount() {
        return getCart().reduce((s, i) => s + (Number(i.qty) || 0), 0);
    }

    function cartTotal() {
        return getCart().reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
    }

    // Avisa a la página (carrito.html) cuando cambia el carrito
    function emitCartChange() {
        try { window.dispatchEvent(new CustomEvent('nb:cartchange')); } catch (e) { /* sin lista */ }
    }

    function addToCart(entry) {
        if (!entry || !entry.productId) return false;

        const id = variantId(entry.productId, entry.color, entry.size);
        const qty = Math.max(1, parseInt(entry.qty, 10) || 1);
        const cart = getCart();
        const existing = cart.find(i => i.id === id);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                id: id,
                name: entry.name || 'Producto',
                price: Number(entry.price) || 0,
                img: entry.img || '',
                qty: qty
            });
        }

        setCart(cart);
        renderBadge();
        emitCartChange();
        // Muestra confirmación en lugar de toast
        showAdded({
            name: entry.name || 'Producto',
            img: entry.img || '',
            price: Number(entry.price) || 0,
            qty: qty
        });
        return true;
    }

    function changeQty(id, delta) {
        const cart = getCart();
        const idx = cart.findIndex(i => i.id === id);
        if (idx === -1) return;

        if (delta > 0) {
            cart[idx].qty += delta;
        } else if (cart[idx].qty + delta < 1) {
            cart.splice(idx, 1);
        } else {
            cart[idx].qty += delta;
        }

        setCart(cart);
        renderDrawer();
        renderBadge();
        emitCartChange();
    }

    function removeItem(id) {
        const cart = getCart();
        const idx = cart.findIndex(i => i.id === id);
        if (idx === -1) return;
        cart.splice(idx, 1);
        setCart(cart);
        renderDrawer();
        renderBadge();
        emitCartChange();
    }

    function clearCart() {
        if (cartCount() === 0) return;
        if (!confirm('¿Vaciar el carrito?')) return;
        setCart([]);
        renderDrawer();
        renderBadge();
        emitCartChange();
        toast('Carrito vaciado', 'info');
    }

    // Badge null-safe: si no existe en el nav, no hace nada
    function renderBadge() {
        const badge = document.querySelector('.shop-cart-badge');
        if (!badge) return;
        try {
            badge.textContent = cartCount();
            badge.style.transform = 'scale(1.4)';
            setTimeout(() => {
                const current = document.querySelector('.shop-cart-badge');
                if (current) current.style.transform = 'scale(1)';
            }, 220);
        } catch (e) {
            console.warn('⚠️ renderBadge:', e);
        }
    }

    // ============================================================
    // ========== DRAWER DEL CARRITO ==============================
    // ============================================================

    function buildDrawer() {
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
                    <a class="nb-cart-full" href="carrito.html">Ver carrito completo →</a>
                    <button class="nb-cart-clear" id="nbCartClear">Vaciar carrito</button>
                </footer>
            </aside>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        document.getElementById('nbCartOverlay')?.addEventListener('click', closeDrawer);
        document.getElementById('nbCartClose')?.addEventListener('click', closeDrawer);
        document.getElementById('nbCartClear')?.addEventListener('click', clearCart);
        document.getElementById('nbCartCheckout')?.addEventListener('click', openCheckout);

        // Delegación: quitar (−) y añadir (+)
        document.getElementById('nbCartBody')?.addEventListener('click', (e) => {
            const minus = e.target.closest('[data-remove]');
            if (minus) { changeQty(minus.dataset.remove, -1); return; }
            const plus = e.target.closest('[data-add]');
            if (plus) changeQty(plus.dataset.add, 1);
        });
    }

    function renderDrawer() {
        buildDrawer();
        const body = document.getElementById('nbCartBody');
        const countEl = document.getElementById('nbCartCount');
        const totalEl = document.getElementById('nbCartTotal');
        if (!body) return;

        const cart = getCart();

        if (cart.length === 0) {
            body.innerHTML = `<div class="nb-cart-empty">
                <span class="nb-cart-empty-icon">◇</span>
                <p>Tu carrito está vacío</p>
                <button class="nb-cart-empty-cta" id="nbCartEmptyCta">Ver catálogo</button>
            </div>`;
            document.getElementById('nbCartEmptyCta')?.addEventListener('click', () => {
                closeDrawer();
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            });
        } else {
            body.innerHTML = cart.map(item => `
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
        }

        if (countEl) countEl.textContent = cartCount();
        if (totalEl) totalEl.textContent = formatPrice(cartTotal());
    }

    function openDrawer() {
        renderDrawer();
        document.getElementById('nb-cart-drawer')?.classList.add('is-open');
        document.getElementById('nbCartOverlay')?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        document.getElementById('nb-cart-drawer')?.classList.remove('is-open');
        document.getElementById('nbCartOverlay')?.classList.remove('is-open');
        if (!document.querySelector('.nb-menu.is-open') && !document.querySelector('.nb-modal.is-open')) {
            document.body.style.overflow = '';
        }
    }

    // ============================================================
    // ========== CHECKOUT (Instagram DM + Copiar pedido) ========
    // ============================================================

    function buildOrderText() {
        const cart = getCart();
        if (!cart.length) return '';

        const lines = cart.map(i =>
            i.qty + 'x ' + i.name + ' — ' + formatPrice((Number(i.price) || 0) * (Number(i.qty) || 0))
        );

        return 'Hola! Quiero hacer este pedido de NOIR BLVNK:\n\n' +
            lines.join('\n') +
            '\n\nTotal: ' + formatPrice(cartTotal()) +
            '\n\n¿Me confirmas disponibilidad, forma de pago y envío?';
    }

    async function copyOrder() {
        const text = buildOrderText();
        if (!text) { toast('Tu carrito está vacío', 'info'); return; }
        const ok = await copyText(text);
        toast(ok ? 'Pedido copiado — pégalo en el chat' : 'No se pudo copiar', ok ? 'success' : 'error');
    }

    function openCheckout() {
        const cart = getCart();
        if (!cart.length) { toast('Tu carrito está vacío', 'info'); return; }

        let modal = document.getElementById('nb-checkout');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', `
                <div class="nb-modal" id="nb-checkout">
                    <div class="nb-modal-inner">
                        <button class="nb-modal-close" id="nbCheckoutClose" aria-label="Cerrar">✕</button>
                        <span class="nb-modal-eyebrow">Pedido</span>
                        <h3 class="nb-modal-title">Resumen de tu pedido</h3>
                        <div class="nb-checkout-list" id="nbCheckoutList"></div>
                        <div class="nb-checkout-total">
                            <span>Total</span>
                            <strong id="nbCheckoutTotal">$0 MXN</strong>
                        </div>
                        <a class="nb-modal-btn nb-checkout-ig" id="nbCheckoutIg"
                           href="${CONTACTO.instagramDM}" target="_blank" rel="noopener">Enviar por Instagram</a>
                        <button class="nb-modal-btn nb-checkout-wa" id="nbCheckoutWa" hidden>Enviar por WhatsApp</button>
                        <button class="nb-modal-btn nb-checkout-copy" id="nbCheckoutCopy">Copiar pedido</button>
                        <p class="nb-modal-foot">Te respondemos para coordinar pago y envío.</p>
                    </div>
                </div>
            `);
            modal = document.getElementById('nb-checkout');

            document.getElementById('nbCheckoutClose')?.addEventListener('click', closeCheckout);
            modal?.addEventListener('click', (e) => { if (e.target === modal) closeCheckout(); });
            document.getElementById('nbCheckoutCopy')?.addEventListener('click', copyOrder);

            // Botón WhatsApp: solo visible si hay número configurado
            const waBtn = document.getElementById('nbCheckoutWa');
            if (CONTACTO.whatsapp && waBtn) {
                waBtn.hidden = false;
                waBtn.addEventListener('click', () => {
                    const num = CONTACTO.whatsapp.replace(/\D/g, '');
                    window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(buildOrderText()), '_blank', 'noopener');
                });
            }

            // Al enviar por Instagram: copia el pedido para pegarlo en el DM
            document.getElementById('nbCheckoutIg')?.addEventListener('click', copyOrder);

            // Escape cierra el checkout
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeCheckout();
            });
        }

        // Pintar contenido actual
        const list = document.getElementById('nbCheckoutList');
        const total = document.getElementById('nbCheckoutTotal');
        if (list) {
            list.innerHTML = cart.map(i => `
                <div class="nb-checkout-row">
                    <span>${i.qty} × ${i.name}</span>
                    <strong>${formatPrice((Number(i.price) || 0) * (Number(i.qty) || 0))}</strong>
                </div>
            `).join('');
        }
        if (total) total.textContent = formatPrice(cartTotal());

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        const modal = document.getElementById('nb-checkout');
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        if (!document.querySelector('.nb-cart-drawer.is-open') && !document.querySelector('.nb-menu.is-open')) {
            document.body.style.overflow = '';
        }
    }

    // ============================================================
    // ========== CONFIRMACIÓN "AÑADIDO AL CARRITO" ==============
    // ============================================================

    function showAdded(info) {
        info = info || {};
        const qty = Math.max(1, parseInt(info.qty, 10) || 1);

        let modal = document.getElementById('nb-added');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', `
                <div class="nb-modal" id="nb-added">
                    <div class="nb-modal-inner nb-added-inner">
                        <button class="nb-modal-close" id="nbAddedClose" aria-label="Cerrar">✕</button>
                        <span class="nb-modal-eyebrow">Carrito</span>
                        <h3 class="nb-modal-title">Añadido al carrito</h3>
                        <div class="nb-added-item">
                            <img class="nb-added-img" id="nbAddedImg" src="" alt="Producto">
                            <div class="nb-added-info">
                                <span class="nb-added-name" id="nbAddedName">Producto</span>
                                <span class="nb-added-qty" id="nbAddedQty"></span>
                            </div>
                        </div>
                        <button class="nb-modal-btn nb-added-pay" id="nbAddedPay">Pagar ahora</button>
                        <button class="nb-modal-btn nb-added-keep" id="nbAddedKeep">Seguir comprando</button>
                        <p class="nb-modal-foot">Al pagar cerramos tu pedido por mensaje.</p>
                    </div>
                </div>
            `);
            modal = document.getElementById('nb-added');

            document.getElementById('nbAddedClose')?.addEventListener('click', closeAdded);
            document.getElementById('nbAddedKeep')?.addEventListener('click', closeAdded);
            modal?.addEventListener('click', (e) => { if (e.target === modal) closeAdded(); });
            document.getElementById('nbAddedPay')?.addEventListener('click', () => {
                closeAdded();
                openCheckout();
            });

            // Escape cierra la confirmación
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeAdded();
            });
        }

        const img = document.getElementById('nbAddedImg');
        if (img) img.src = info.img || '';
        const name = document.getElementById('nbAddedName');
        if (name) name.textContent = info.name || 'Producto';
        const qtyEl = document.getElementById('nbAddedQty');
        if (qtyEl) {
            qtyEl.textContent = qty + (qty === 1 ? ' pieza' : ' piezas') +
                ' — ' + formatPrice((Number(info.price) || 0) * qty);
        }

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeAdded() {
        const modal = document.getElementById('nb-added');
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        if (!document.querySelector('.nb-cart-drawer.is-open') &&
            !document.querySelector('.nb-modal.is-open') &&
            !document.querySelector('.nb-menu.is-open')) {
            document.body.style.overflow = '';
        }
    }

    // ============================================================
    // ========== API PÚBLICA =====================================
    // ============================================================

    window.NB = {
        CONTACTO,
        DEFAULT_COLORS,
        DEFAULT_SIZE,
        loadArray,
        saveArray,
        formatPrice,
        normalize,
        copyText,
        toast,
        getCart,
        addToCart,
        changeQty,
        removeItem,
        clearCart,
        cartCount,
        cartTotal,
        renderBadge,
        openDrawer,
        closeDrawer,
        openCheckout,
        closeCheckout,
        showAdded,
        closeAdded
    };

    console.log('🧭 compartido.js listo (checkout vía ' + (CONTACTO.whatsapp ? 'WhatsApp' : 'Instagram DM') + ')');
})();
