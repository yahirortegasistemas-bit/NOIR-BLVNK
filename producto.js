// ============================================================
// ========== PRODUCTO NOIR BLVNK =============================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎽 Página de producto inicializada');

    // ============================================================
    // ========== ESTADO ==========================================
    // ============================================================

    const state = {
        color: 'Faded Black',
        size: 'M',
        qty: 1,
        productName: '',
        productPrice: 0
    };

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ============================================================
    // ========== TOAST (por si no está en tienda.js) =============
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
    // ========== LEER DATOS DEL PRODUCTO =========================
    // ============================================================

    const titleEl = $('.product-title');
    const priceEl = $('.product-price--current, .product-price');

    if (titleEl) state.productName = titleEl.textContent.trim();
    if (priceEl) {
        const cleaned = priceEl.textContent.replace(/[^0-9.]/g, '');
        state.productPrice = parseFloat(cleaned) || 0;
    }

    console.log('📦 Producto:', state.productName, '— $' + state.productPrice);

    // ============================================================
    // ========== GALERÍA =========================================
    // ============================================================

    const mainImage = document.getElementById('mainImage');
    const thumbs = $$('.product-thumb');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (!img || !mainImage) return;

            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = img.src.replace('w=200', 'w=1200');
                mainImage.style.opacity = '1';
            }, 200);

            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    if (mainImage) {
        mainImage.style.transition = 'opacity 0.3s ease';
    }

    // ============================================================
    // ========== FAVORITO ========================================
    // ============================================================

    const productFav = $('.product-fav');
    if (productFav) {
        // Cargar estado desde localStorage
        const favs = JSON.parse(localStorage.getItem('nb_favs') || '[]');
        if (favs.includes(state.productName)) {
            productFav.classList.add('active');
            productFav.textContent = '♥';
        }

        productFav.addEventListener('click', function () {
            this.classList.toggle('active');
            const isFav = this.classList.contains('active');
            this.textContent = isFav ? '♥' : '♡';

            const favs = JSON.parse(localStorage.getItem('nb_favs') || '[]');
            const idx = favs.indexOf(state.productName);

            if (isFav && idx === -1) {
                favs.push(state.productName);
                toast('Añadido a favoritos', 'success');
            } else if (!isFav && idx !== -1) {
                favs.splice(idx, 1);
                toast('Quitado de favoritos', 'info');
            }

            localStorage.setItem('nb_favs', JSON.stringify(favs));
        });
    }

    // ============================================================
    // ========== COLORES =========================================
    // ============================================================

    const colorButtons = $$('.product-color');
    const colorValue = document.getElementById('colorValue');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.color = this.dataset.color || '';
            if (colorValue) colorValue.textContent = state.color;

            // Actualizar link de WhatsApp
            updateWhatsAppLink();
        });
    });

    // ============================================================
    // ========== TALLAS ==========================================
    // ============================================================

    const sizeButtons = $$('.product-size');

    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled) {
                toast('Talla agotada', 'info');
                return;
            }
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.size = this.textContent.trim();

            // Actualizar link de WhatsApp
            updateWhatsAppLink();
        });
    });

    // ============================================================
    // ========== CANTIDAD ========================================
    // ============================================================

    const qtyInput = document.getElementById('qtyInput');
    const qtyButtons = $$('.product-qty-btn');

    qtyButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (!qtyInput) return;
            let val = parseInt(qtyInput.value) || 1;
            const action = this.dataset.action;

            if (action === 'minus' && val > 1) val--;
            if (action === 'plus' && val < 10) val++;

            qtyInput.value = val;
            state.qty = val;

            // Actualizar link de WhatsApp
            updateWhatsAppLink();
        });
    });

    // ============================================================
    // ========== AÑADIR AL CARRITO ===============================
    // ============================================================

    const cartBadge = document.querySelector('.shop-cart-badge');
    const addBtn = document.getElementById('addToCart');

    if (addBtn) {
        addBtn.addEventListener('click', function () {
            // Leer carrito actual
            let cart = JSON.parse(localStorage.getItem('nb_cart') || '[]');

            const id = state.productName + ' - ' + state.color + ' - ' + state.size;
            const img = mainImage?.src || '';

            const existing = cart.find(i => i.id === id);
            if (existing) {
                existing.qty += state.qty;
            } else {
                cart.push({
                    id: id,
                    name: state.productName + ' (' + state.color + ' / ' + state.size + ')',
                    price: state.productPrice,
                    img: img,
                    qty: state.qty
                });
            }

            localStorage.setItem('nb_cart', JSON.stringify(cart));

            // Actualizar badge
            if (cartBadge) {
                const total = cart.reduce((s, i) => s + i.qty, 0);
                cartBadge.textContent = total;
                cartBadge.style.transform = 'scale(1.4)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 220);
            }

            // Feedback visual del botón
            const span = this.querySelector('span');
            if (span) {
                const original = span.textContent;
                span.textContent = '✓ Añadido — $' + (state.productPrice * state.qty) + ' MXN';
                this.disabled = true;
                setTimeout(() => {
                    span.textContent = original;
                    this.disabled = false;
                }, 1800);
            }

            toast('✓ Añadido al carrito', 'success');
        });
    }

    // ============================================================
    // ========== WHATSAPP DINÁMICO ===============================
    // ============================================================

    const whatsappBtn = document.querySelector('.whatsapp-btn');

    function updateWhatsAppLink() {
        if (!whatsappBtn) return;

        const phone = '5215512345678'; // ← CAMBIA por tu número real
        const total = state.productPrice * state.qty;

        const message =
            'Hola! Quiero comprar:\n\n' +
            '📦 ' + state.productName + '\n' +
            '🎨 Color: ' + state.color + '\n' +
            '📏 Talla: ' + state.size + '\n' +
            '🔢 Cantidad: ' + state.qty + '\n' +
            '💰 Total: $' + total + ' MXN\n\n' +
            '¿Me confirmas disponibilidad y envío?';

        const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
        whatsappBtn.href = url;
    }

    // Actualizar al cargar
    updateWhatsAppLink();

    // Actualizar cuando cambie cantidad con el input directo
    if (qtyInput) {
        qtyInput.addEventListener('change', function () {
            let val = parseInt(this.value) || 1;
            if (val < 1) val = 1;
            if (val > 10) val = 10;
            this.value = val;
            state.qty = val;
            updateWhatsAppLink();
        });
    }

    // ============================================================
    // ========== GUÍA DE TALLAS ==================================
    // ============================================================

    const sizeGuideBtn = $('.product-size-guide');
    if (sizeGuideBtn) {
        sizeGuideBtn.addEventListener('click', function () {
            // Abrir el acordeón de tallas
            const accordion = document.querySelector('.product-accordion-item:last-child');
            if (accordion) {
                accordion.setAttribute('open', '');
                accordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // ============================================================
    // ========== LOG FINAL =======================================
    // ============================================================

    console.log('✅ Producto listo:', state.productName);
});