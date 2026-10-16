document.addEventListener('DOMContentLoaded', function () {
    if (!window.NB) {
        console.warn('NB no disponible');
        return;
    }

    const form = document.getElementById('checkoutForm');
    const itemsEl = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const paypalContainer = document.getElementById('paypal-button-container');

    function cartTotal() {
        return Number(NB.cartTotal()) || 0;
    }

    function render() {
        const cart = NB.getCart();
        if (!cart.length) {
            window.location.href = 'carrito.html';
            return;
        }

        itemsEl.innerHTML = cart.map(item => `
            <article class="checkout-item">
                <div class="checkout-item-img">
                    <img src="${item.img || ''}" alt="${item.name}">
                </div>
                <div class="checkout-item-info">
                    <span class="checkout-item-name">${item.name}</span>
                    <span class="checkout-item-meta">${item.qty} x ${NB.formatPrice(item.price)}</span>
                </div>
                <span class="checkout-item-sub">${NB.formatPrice(item.price * item.qty)}</span>
            </article>
        `).join('');

        const total = cartTotal();
        subtotalEl.textContent = NB.formatPrice(total);
        totalEl.textContent = NB.formatPrice(total);
    }

    render();

    function isFormValid() {
        if (!form) return true;
        const fields = form.querySelectorAll('input[required]');
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].value.trim()) {
                return false;
            }
        }
        try {
            return form.checkValidity();
        } catch (e) {
            return false;
        }
    }

    if (window.paypal && paypalContainer) {
        paypal.Buttons({
            style: {
                shape: 'pill',
                color: 'gold',
                layout: 'vertical',
                label: 'pay'
            },
            createOrder: function (data, actions) {
                if (!isFormValid()) {
                    form?.reportValidity?.();
                    throw new Error('Completa los datos para continuar');
                }
                const cart = NB.getCart();
                const total = cartTotal();
                if (total <= 0) {
                    window.location.href = 'carrito.html';
                    throw new Error('Carrito vacío');
                }

                const items = cart.map(item => ({
                    name: (item.name || 'Producto').substring(0, 127),
                    quantity: String(Math.max(1, parseInt(item.qty, 10) || 1)),
                    unit_amount: {
                        currency_code: 'MXN',
                        value: Number(item.price || 0).toFixed(2)
                    }
                }));

                const itemTotal = items.reduce((sum, it) => {
                    return sum + (Number(it.unit_amount.value) * Number(it.quantity));
                }, 0);

                return actions.order.create({
                    purchase_units: [{
                        items: items,
                        amount: {
                            currency_code: 'MXN',
                            value: total.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: 'MXN',
                                    value: itemTotal.toFixed(2)
                                }
                            }
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function () {
                    try { NB.clearCart(); } catch (e) {}
                    window.location.href = 'gracias.html';
                }).catch(function (err) {
                    console.error(err);
                    alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
                });
            },
            onError: function (err) {
                console.error('PayPal error:', err);
            },
            onCancel: function (data) {
                console.log('Pago cancelado', data);
            }
        }).render('#paypal-button-container');
    } else {
        console.warn('PayPal SDK no cargado');
    }
});
