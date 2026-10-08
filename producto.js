// ============================================================
// ========== PRODUCTO NOIR BLVNK =============================
// ============================================================

// ============================================================
// ========== DATOS DE PRODUCTOS ==============================
// ============================================================

// id del producto activo en esta página (para el carrito unificado)
let CURRENT_PRODUCT_ID = 'synonime';

const PRODUCTS = {
    'synonime': {
        name: 'SYNONIME',
        price: 700,
        category: 'Playera — Graphic',
        badge: 'New',
        badgeType: 'new',
        image: 'synonime.jpg',
        description: 'Different perspective. Same essence. A new chapter, same vision. Playera oversize de algodón peinado 214 g/m². Diseño editorial con gráficos técnicos, tipografía industrial y acentos en rojo. Serigrafía de alta densidad que no se craquela con el lavado. Hecha en México.',
        color: 'Negro'
    },
    'cherry-negro': {
        name: 'Cherry - Black',
        price: 700,
        category: 'Playera — Graphic',
        badge: 'New',
        badgeType: 'new',
        image: 'cherry-negro.jpg',
        description: 'We were never meant to last forever, only to be unforgettable for a moment. Playera oversize de algodón peinado 214 g/m². Diseño con tipografía serif clásica y cerezas en rojo. Serigrafía de alta densidad. Hecha en México.',
        color: 'Negro'
    },
    'cherry-beige': {
        name: 'Cherry - Beige',
        price: 700,
        category: 'Playera — Graphic',
        badge: 'New',
        badgeType: 'new',
        image: 'cherry-beige.jpg',
        description: 'We were never meant to last forever, only to be unforgettable for a moment. Playera oversize de algodón peinado 214 g/m². Diseño con tipografía serif clásica y cerezas en rojo sobre fondo beige. Serigrafía de alta densidad. Hecha en México.',
        color: 'Beige'
    },
    'noir-club': {
        name: 'Noir Club',
        price: 700,
        category: 'Playera — Graphic',
        badge: 'Exclusivo',
        badgeType: 'exclusive',
        image: 'noir-club.jpg',
        description: 'Noir Club — 1999 · Paris · France. Playera oversize de algodón peinado 214 g/m². Diseño gráfico con figura central en rojo y negro, trazos urbanos y tipografía industrial. Serigrafía de alta densidad. Hecha en México.',
        color: 'Negro'
    },
    'the-only-limit': {
        name: 'The Only Limit Is Your Mind',
        price: 700,
        category: 'Playera — Graphic',
        image: 'the-only-limit.jpg',
        description: 'The only limit is your mind. Playera oversize de algodón peinado 214 g/m². Diseño con imagen de corredor en blanco y negro con efecto granulado. Serigrafía de alta densidad. Hecha en México.',
        color: 'Negro'
    },
    'unseen-story': {
        name: 'The Unseen Tells The Story',
        price: 700,
        category: 'Playera — Graphic',
        image: 'unseen-story.jpg',
        description: 'The unseen tells the story. Keep grinding. Playera oversize de algodón peinado 214 g/m². Diseño con silueta de basquetbolista en blanco y negro y tipografía industrial en blanco. Serigrafía de alta densidad. Hecha en México.',
        color: 'Negro'
    },
    'noir-blvnk-white': {
        name: 'NOIR BLVNK - White',
        price: 700,
        category: 'Playera — Graphic',
        image: 'noir-blvnk-white.jpg',
        description: 'NOIR BLVNK en graffiti. Run further, think clearer. Discipline creates freedom. A slower mind, a faster you. Playera oversize de algodón peinado 214 g/m². Diseño con lettering en negro y detalles en rojo sobre fondo blanco. Serigrafía de alta densidad. Hecha en México.',
        color: 'Blanco'
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
    CURRENT_PRODUCT_ID = id;

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

    // Marcar el botón de color que corresponde al producto
    document.querySelectorAll('.product-color').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === product.color);
    });

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

    // Guardia: compartido.js debe cargarse antes que producto.js
    if (!window.NB) {
        console.error('⚠️ Falta compartido.js (cargarlo antes que producto.js)');
        return;
    }

    // ============================================================
    // ========== ESTADO ==========================================
    // ============================================================

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const state = {
        color: 'Negro',
        size: 'M',
        qty: 1,
        productName: '',
        productPrice: 0
    };

    // Sincronizar el color con el que quedó marcado tras cargar ?id=
    const activeColorBtn = document.querySelector('.product-color.active');
    const initialColorEl = document.getElementById('colorValue');
    if (activeColorBtn?.dataset.color) {
        state.color = activeColorBtn.dataset.color;
    } else if (initialColorEl && initialColorEl.textContent.trim()) {
        state.color = initialColorEl.textContent.trim();
    }

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
        NB.toast(msg, type);
    }

    // ============================================================
    // ========== FAVORITO ========================================
    // ============================================================

    const productFav = $('.product-fav');
    if (productFav) {
        const favs = NB.loadArray('nb_favs');
        if (favs.includes(state.productName)) {
            productFav.classList.add('active');
            productFav.textContent = '♥';
        }

        productFav.addEventListener('click', function () {
            this.classList.toggle('active');
            const isFav = this.classList.contains('active');
            this.textContent = isFav ? '♥' : '♡';

            const favs = NB.loadArray('nb_favs');
            const idx = favs.indexOf(state.productName);

            if (isFav && idx === -1) {
                favs.push(state.productName);
                toast('Añadido a favoritos', 'success');
            } else if (!isFav && idx !== -1) {
                favs.splice(idx, 1);
                toast('Quitado de favoritos', 'info');
            }

            NB.saveArray('nb_favs', favs);
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

    const addBtn = document.getElementById('addToCart');

    if (addBtn) {
        addBtn.addEventListener('click', function () {
            // id unificado con el catálogo: producto|Color|Talla
            const ok = NB.addToCart({
                productId: CURRENT_PRODUCT_ID,
                color: state.color,
                size: state.size,
                name: state.productName + ' (' + state.color + ' / ' + state.size + ')',
                price: state.productPrice,
                img: mainImage?.src || '',
                qty: state.qty
            });
            if (!ok) return;

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
        });
    }

    // ============================================================
    // ========== CONSULTA DIRECTA (WhatsApp / Instagram) =========
    // ============================================================

    const whatsappBtn = document.querySelector('.whatsapp-btn');

    function buildOrderMessage() {
        const total = state.productPrice * state.qty;
        return 'Hola! Quiero comprar:\n\n' +
            '📦 ' + state.productName + '\n' +
            '🎨 Color: ' + state.color + '\n' +
            '📏 Talla: ' + state.size + '\n' +
            '🔢 Cantidad: ' + state.qty + '\n' +
            '💰 Total: $' + total + ' MXN\n\n' +
            '¿Me confirmas disponibilidad y envío?';
    }

    function updateWhatsAppLink() {
        if (!whatsappBtn) return;

        const label = whatsappBtn.querySelector('span');

        if (NB.CONTACTO.whatsapp) {
            // Número configurado → mensaje directo en wa.me
            const num = NB.CONTACTO.whatsapp.replace(/\D/g, '');
            whatsappBtn.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(buildOrderMessage());
            if (label) label.textContent = 'Comprar por WhatsApp';
        } else {
            // Sin número → consulta por Instagram DM
            whatsappBtn.href = NB.CONTACTO.instagramDM;
            if (label) label.textContent = 'Consultar por Instagram';
        }
    }

    updateWhatsAppLink();

    // Sin WhatsApp: al pulsar, copia el mensaje para pegarlo en el DM
    whatsappBtn?.addEventListener('click', async function () {
        if (NB.CONTACTO.whatsapp) return;
        const ok = await NB.copyText(buildOrderMessage());
        if (ok) NB.toast('Mensaje copiado — pégalo en Instagram', 'success');
    });

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
    // ========== CARRITO EN EL NAV ===============================
    // ============================================================

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