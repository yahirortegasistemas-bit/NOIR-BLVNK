// ============================================================
// ========== CARRITO — PÁGINA (carrito.html) =================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🛒 Página de carrito inicializada');

    // Guardia: compartido.js debe cargarse antes
    if (!window.NB) {
        console.error('⚠️ Falta compartido.js');
        return;
    }

    const gridEl = document.getElementById('cartGrid');
    const emptyEl = document.getElementById('cartEmpty');
    const itemsEl = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const payBtn = document.getElementById('cartPayBtn');
    const clearBtn = document.getElementById('cartClearBtn');

    // Enlace al detalle desde el id unificado "producto|Color|Talla"
    function detailHref(item) {
        const key = String(item.id || '').split('|')[0];
        return key ? 'producto.html?id=' + encodeURIComponent(key) : 'producto.html';
    }

    function renderPage() {
        const cart = NB.getCart();

        // Estado vacío vs. productos
        if (!cart.length) {
            if (gridEl) gridEl.hidden = true;
            if (emptyEl) emptyEl.hidden = false;
            if (itemsEl) itemsEl.innerHTML = '';
        } else {
            if (gridEl) gridEl.hidden = false;
            if (emptyEl) emptyEl.hidden = true;
        }

        if (!itemsEl) return;

        if (!cart.length) {
            itemsEl.innerHTML = '';
        } else {
            itemsEl.innerHTML = cart.map(item => `
                <article class="cart-item">
                    <a class="cart-item-img" href="${detailHref(item)}">
                        <img src="${item.img}" alt="${item.name}">
                    </a>
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">
                            <a href="${detailHref(item)}">${item.name}</a>
                        </h3>
                        <span class="cart-item-price">${NB.formatPrice(item.price)}</span>
                        <div class="cart-item-controls">
                            <div class="cart-item-qty">
                                <button data-act="minus" data-id="${item.id}" aria-label="Quitar">−</button>
                                <span>${item.qty}</span>
                                <button data-act="plus" data-id="${item.id}" aria-label="Añadir">+</button>
                            </div>
                            <button class="cart-item-remove" data-act="remove" data-id="${item.id}">Eliminar</button>
                        </div>
                    </div>
                    <span class="cart-item-subtotal">${NB.formatPrice(item.price * item.qty)}</span>
                </article>
            `).join('');
        }

        if (subtotalEl) subtotalEl.textContent = NB.formatPrice(NB.cartTotal());
        if (totalEl) totalEl.textContent = NB.formatPrice(NB.cartTotal());
    }

    // Controles de cantidad / eliminar (delegación)
    itemsEl?.addEventListener('click', function (e) {
        const btn = e.target.closest('button[data-act]');
        if (!btn || !btn.dataset.id) return;

        const id = btn.dataset.id;
        if (btn.dataset.act === 'plus') {
            NB.changeQty(id, 1);
        } else if (btn.dataset.act === 'minus') {
            NB.changeQty(id, -1);
        } else if (btn.dataset.act === 'remove') {
            NB.removeItem(id);
        }
        renderPage();
    });

    // Pagar pedido (abre el modal con Instagram DM / copiar pedido)
    payBtn?.addEventListener('click', function () {
        NB.openCheckout();
    });

    clearBtn?.addEventListener('click', function () {
        NB.clearCart();
        renderPage();
    });

    // Refrescar si el carrito cambia desde otro lado (drawer, badge, etc.)
    window.addEventListener('nb:cartchange', renderPage);

    NB.renderBadge();
    renderPage();
});