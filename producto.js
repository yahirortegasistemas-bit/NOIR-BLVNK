// ============================================================
// ========== PRODUCTO NOIR BLVNK =============================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎽 Página de producto inicializada');

    // ============================================================
    // ========== GALERÍA =========================================
    // ============================================================

    const mainImage = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('.product-thumb');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (!img || !mainImage) return;

            // Cambiar imagen principal
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = img.src.replace('w=200', 'w=1200');
                mainImage.style.opacity = '1';
            }, 200);

            // Cambiar active
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

    const productFav = document.querySelector('.product-fav');
    if (productFav) {
        productFav.addEventListener('click', function () {
            this.classList.toggle('active');
            this.textContent = this.classList.contains('active') ? '♥' : '♡';
        });
    }

    // ============================================================
    // ========== COLORES =========================================
    // ============================================================

    const colorButtons = document.querySelectorAll('.product-color');
    const colorValue = document.getElementById('colorValue');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (colorValue) {
                colorValue.textContent = this.dataset.color || '';
            }
        });
    });

    // ============================================================
    // ========== TALLAS ==========================================
    // ============================================================

    const sizeButtons = document.querySelectorAll('.product-size');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled) return;
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ============================================================
    // ========== CANTIDAD ========================================
    // ============================================================

    const qtyInput = document.getElementById('qtyInput');
    const qtyButtons = document.querySelectorAll('.product-qty-btn');

    qtyButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (!qtyInput) return;
            let val = parseInt(qtyInput.value) || 1;
            const action = this.dataset.action;

            if (action === 'minus' && val > 1) val--;
            if (action === 'plus' && val < 10) val++;

            qtyInput.value = val;
        });
    });

    // ============================================================
    // ========== AÑADIR AL CARRITO ===============================
    // ============================================================

    const cartBadge = document.querySelector('.shop-cart-badge');
    const addBtn = document.getElementById('addToCart');
    let cartCount = 0;

    if (addBtn) {
        addBtn.addEventListener('click', function () {
            const qty = parseInt(qtyInput?.value) || 1;
            cartCount += qty;

            if (cartBadge) cartBadge.textContent = cartCount;

            const span = this.querySelector('span');
            if (!span) return;

            const original = span.textContent;
            span.textContent = '✓ Añadido al carrito';
            this.disabled = true;

            setTimeout(() => {
                span.textContent = original;
                this.disabled = false;
            }, 1800);
        });
    }

    // ============================================================
    // ========== COMPRAR AHORA ===================================
    // ============================================================

    const buyBtn = document.getElementById('buyNow');
    if (buyBtn) {
        buyBtn.addEventListener('click', function () {
            alert('Redirigiendo al checkout... (integra aquí tu pasarela)');
        });
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
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 3000);
                } else {
                    throw new Error();
                }
            } catch (error) {
                button.textContent = '✕ ERROR';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            }
        });
    }

    console.log('✅ Producto listo');
});