// ============================================================
// ========== PRODUCTO NOIR BLVNK =============================
// ============================================================

// ============================================================
// ========== DATOS DE PRODUCTOS ==============================
// ============================================================

const PRODUCTS = {
    'tijuana': {
        name: 'Tijuana - San Diego',
        price: 700,
        category: 'Playera — Graphic',
        badge: 'New',
        badgeType: 'new',
        image: 'noirclub.jpg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño Tijuana - San Diego. Hecha en México.',
        color: 'Amarillo'
    },
    'angel-numbers': {
        name: 'Angel Numbers',
        price: 650,
        category: 'Playera — Graphic',
        image: 'race.jpg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño Angel Numbers. Hecha en México.',
        color: 'Negro'
    },
    'lucky222': {
        name: 'Lucky222 - Black',
        price: 650,
        category: 'Playera — Graphic',
        image: 'boxing.jpg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño Lucky222. Hecha en México.',
        color: 'Negro'
    },
    'consistency': {
        name: 'Consistency (Japón)',
        price: 650,
        category: 'Playera — Basics',
        image: 'feardeath.jpg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño Consistency con kanji japonés. Hecha en México.',
        color: 'Blanco'
    },
    'tony': {
        name: '"Tony" - Faded Black',
        price: 700,
        category: 'Playera — Faded',
        badge: 'Exclusivo',
        badgeType: 'exclusive',
        image: 'run.jpg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño "Tony" en Faded Black. Hecha en México.',
        color: 'Faded Black'
    },
    'world': {
        name: '"World" - Black',
        price: 700,
        category: 'Playera — Graphic',
        image: 'race2.jpeg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño World. Hecha en México.',
        color: 'Negro'
    },
    'right-place': {
        name: 'Right Place - Right Time',
        price: 650,
        category: 'Playera — Basics',
        badge: 'New',
        badgeType: 'new',
        image: 'race1.jpeg',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño Right Place - Right Time. Hecha en México.',
        color: 'Beige'
    },
    'tutto-passa': {
        name: '"Tutto Passa"',
        price: 650,
        category: 'Playera — Faded',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
        description: 'Camiseta Heavyweight Pigment de 214 g/m², 100% algodón peinado. Teñida con pigmentos para un estilo vintage intenso. Corte oversize con hombros caídos. Diseño "Tutto Passa". Hecha en México.',
        color: 'Negro'
    }
};
// ============================================================
// ========== CARGAR PRODUCTO DESDE URL =======================
// ============================================================

function loadProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    console.log('🔗 URL id:', id);

    if (!id || !PRODUCTS[id]) {
        console.log('⚠️ Producto no especificado, usando el HTML por defecto');
        return;
    }

    const product = PRODUCTS[id];

    // Título
    const titleEl = document.querySelector('.product-title');
    if (titleEl) titleEl.textContent = product.name;

    // Categoría
    const catEl = document.querySelector('.product-category');
    if (catEl) catEl.textContent = product.category;

    // Precio
    const priceEl = document.querySelector('.product-price--current, .product-price');
    if (priceEl) priceEl.textContent = '$' + product.price + ' MXN';

    // Precio antiguo
    const oldPriceEl = document.querySelector('.product-price-old');
    if (oldPriceEl) {
        if (product.oldPrice) {
            oldPriceEl.textContent = '$' + product.oldPrice + ' MXN';
            oldPriceEl.style.display = '';
        } else {
            oldPriceEl.style.display = 'none';
        }
    }

    // Descripción
    const descEl = document.querySelector('.product-description');
    if (descEl) descEl.textContent = product.description;

    // Imagen principal
    const imgEl = document.getElementById('mainImage');
    if (imgEl) imgEl.src = product.image;

    // Badge
    const badgeEl = document.querySelector('.product-badge');
    if (badgeEl) {
        if (product.badge) {
            badgeEl.textContent = product.badge;
            badgeEl.style.display = '';
            badgeEl.className = 'product-badge product-badge--' + (product.badgeType || 'new');
        } else {
            badgeEl.style.display = 'none';
        }
    }

    // Color por defecto
    const colorValue = document.getElementById('colorValue');
    if (colorValue) colorValue.textContent = product.color;

    // Migas
    const breadcrumbCurrent = document.querySelector('.product-breadcrumb .current');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;

    // Título de la pestaña
    document.title = product.name + ' — NOIR BLVNK';

    console.log('📦 Producto cargado:', product.name);
}

// ============================================================
// ========== INICIALIZACIÓN ==================================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎽 Página de producto inicializada');

    // 1. Cargar producto según ?id= de la URL
    loadProductFromURL();

    // ============================================================
    // ========== ESTADO ==========================================
    // ============================================================

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const state = {
        color: 'Faded Black',
        size: 'M',
        qty: 1,
        productName: '',
        productPrice: 0
    };

    // 2. Leer datos actualizados del DOM
    const titleEl = $('.product-title');
    const priceEl = $('.product-price--current, .product-price');
    const mainImage = document.getElementById('mainImage');

    if (titleEl) state.productName = titleEl.textContent.trim();
    if (priceEl) {
        const cleaned = priceEl.textContent.replace(/[^0-9.]/g, '');
        state.productPrice = parseFloat(cleaned) || 0;
    }

    console.log('📦 Producto:', state.productName, '— $' + state.productPrice);

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
    // ========== FAVORITO ========================================
    // ============================================================

    const productFav = $('.product-fav');
    if (productFav) {
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
    const colorValueEl = document.getElementById('colorValue');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.color = this.dataset.color || '';
            if (colorValueEl) colorValueEl.textContent = state.color;
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

            if (cartBadge) {
                const total = cart.reduce((s, i) => s + i.qty, 0);
                cartBadge.textContent = total;
                cartBadge.style.transform = 'scale(1.4)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 220);
            }

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

        whatsappBtn.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
    }

    updateWhatsAppLink();

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

// ============================================================
// ========== NAV LINKS (en página de producto) ===============
// ============================================================

document.querySelectorAll('.shop-nav-bottom a').forEach(link => {
    link.addEventListener('click', function (e) {
        const text = this.textContent.trim().toLowerCase();

        if (text.includes('todo')) {
            window.location.href = 'index.html';
            return;
        }
        if (text.includes('nueva') || text.includes('coleccion')) {
            e.preventDefault();
            window.location.href = 'index.html#newdrop';
            return;
        }
        if (text.includes('hombre')) {
            e.preventDefault();
            window.location.href = 'index.html';
            return;
        }
    });
});