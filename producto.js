// ============================================================
// ========== DETALLE DE PRODUCTO ==============================
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🖤 NOIR BLVNK — Detalle de producto');

    // ============================================================
    // ========== OBTENER ID DEL PRODUCTO =========================
    // ============================================================

    function getProductId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'feardeath';
    }

    const productId = getProductId();

    // ============================================================
    // ========== BASE DE DATOS DE PRODUCTOS ======================
    // ============================================================

    const products = {
        'feardeath': {
            id: 'feardeath',
            number: '✦ N°05',
            title: 'I HAVE NO',
            subtitle: 'FEAR OF DEATH',
            price: '$890 MXN',
            desc: 'La gráfica insignia de la temporada: un motor invertido, trazado a mano en rojo sobre crema — una cruz hecha de fierro y velocidad.',
            image: 'feardeath.jpg',
            badge: '✦ EDICIÓN LIMITADA',
            material: 'Algodón peinado 280g',
            fit: 'Oversized / Corte caído',
            print: 'Serigrafía / Tinta plastisol',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: { 'S': true, 'M': true, 'L': true, 'XL': true, 'XXL': false },
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Fear%20Of%20Death%20Tee*%20%F0%9F%96%A4%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24890%20MXN%0A%F0%9F%93%A6%20N%C2%B005%20%E2%80%94%20HIELO'
        },
        'run': {
            id: 'run',
            number: '✦ N°01',
            title: 'I JUST',
            subtitle: 'WANNA RUN',
            price: '$780 MXN',
            desc: 'Para los que corren sin motivo, solo por el ruido del asfalto bajo sus pies. Una playera que captura la esencia de la madrugada.',
            image: 'run.jpg',
            badge: '✦ BEST SELLER',
            material: 'Algodón peinado 280g',
            fit: 'Oversized / Corte caído',
            print: 'Serigrafía / Tinta plastisol',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: { 'S': true, 'M': true, 'L': true, 'XL': true, 'XXL': false },
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Solo%20Run%20Tee*%20%F0%9F%8F%83%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24780%20MXN%0A%F0%9F%93%A6%20N%C2%B001%20%E2%80%94%20MADRUGADA'
        },
        'race': {
            id: 'race',
            number: '✦ N°02',
            title: 'RACES ARE WON',
            subtitle: 'IN THE CORNERS',
            price: '$780 MXN',
            desc: 'La curva es donde se define al ganador. Esta playera es para los que entienden que la carrera se gana en los detalles, no en la recta.',
            image: 'race.jpg',
            badge: '✦ NUEVO DROP',
            material: 'Algodón peinado 280g',
            fit: 'Oversized / Corte caído',
            print: 'Serigrafía / Tinta plastisol',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: { 'S': true, 'M': true, 'L': true, 'XL': false, 'XXL': false },
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Corners%20Tee*%20%F0%9F%8F%8E%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24780%20MXN%0A%F0%9F%93%A6%20N%C2%B002%20%E2%80%94%20PISTA'
        },
        'noirclub': {
            id: 'noirclub',
            number: '✦ N°03',
            title: '1989 · PARIS',
            subtitle: 'FRANCE',
            price: '$820 MXN',
            desc: 'Un homenaje a la noche parisina. El año en que todo cambió, la ciudad que nunca duerme y la esencia de NOIR BLVNK.',
            image: 'noirclub.jpg',
            badge: '✦ EDICIÓN ESPECIAL',
            material: 'Algodón peinado 280g',
            fit: 'Oversized / Corte caído',
            print: 'Serigrafía / Tinta plastisol',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: { 'S': true, 'M': true, 'L': true, 'XL': true, 'XXL': false },
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Noir%20Club%20Tee*%20%F0%9F%97%BC%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24820%20MXN%0A%F0%9F%93%A6%20N%C2%B003%20%E2%80%94%20MEDIANOCHE'
        },
        'boxing': {
            id: 'boxing',
            number: '✦ N°04',
            title: 'FALL DOWN.',
            subtitle: 'GET UP. AGAIN.',
            price: '$780 MXN',
            desc: 'Para los que caen y se levantan. Una playera que celebra la resiliencia, el espíritu de lucha y la voluntad de seguir adelante.',
            image: 'boxing.jpg',
            badge: '✦ BEST SELLER',
            material: 'Algodón peinado 280g',
            fit: 'Oversized / Corte caído',
            print: 'Serigrafía / Tinta plastisol',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: { 'S': true, 'M': true, 'L': true, 'XL': true, 'XXL': false },
            whatsapp: 'https://wa.me/526647587072?text=Hola%20quiero%20comprar%20la%20playera%20*Keep%20Fighting%20Tee*%20%F0%9F%A5%8A%0A%F0%9F%8F%B7%EF%B8%8F%20Precio%3A%20%24780%20MXN%0A%F0%9F%93%A6%20N%C2%B004%20%E2%80%94%20CUADRIL%C3%81TERO'
        }
    };

    // ============================================================
    // ========== CARGAR DATOS DEL PRODUCTO =======================
    // ============================================================

    const product = products[productId];

    if (!product) {
        // Si no existe el producto, redirigir a la colección
        window.location.href = 'index.html#coleccion';
        return;
    }

    // Actualizar la página con los datos
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.title + ' ' + product.subtitle;
    document.getElementById('productBadge').textContent = product.badge;
    document.getElementById('productNumber').textContent = product.number;
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productSubtitle').textContent = product.subtitle;
    document.getElementById('productPrice').textContent = product.price;
    document.getElementById('productDesc').textContent = product.desc;
    document.getElementById('productMaterial').textContent = product.material;
    document.getElementById('productFit').textContent = product.fit;
    document.getElementById('productPrint').textContent = product.print;
    document.getElementById('whatsappBtn').href = product.whatsapp;

    // ============================================================
    // ========== TALLAS ==========================================
    // ============================================================

    const sizesContainer = document.getElementById('productSizes');
    sizesContainer.innerHTML = '';

    product.sizes.forEach(function(size) {
        const button = document.createElement('button');
        button.classList.add('product-detail-size');
        if (!product.stock[size]) {
            button.classList.add('out-of-stock');
        }
        if (size === 'M') {
            button.classList.add('active');
        }
        button.textContent = size;
        button.dataset.size = size;
        button.addEventListener('click', function() {
            if (this.classList.contains('out-of-stock')) return;
            document.querySelectorAll('.product-detail-size').forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
        sizesContainer.appendChild(button);
    });

    // ============================================================
    // ========== ACTUALIZAR WHATSAPP CON TALLA SELECCIONADA ======
    // ============================================================

    document.querySelectorAll('.product-detail-size:not(.out-of-stock)').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const size = this.dataset.size;
            const currentUrl = product.whatsapp;
            // Si el mensaje ya tiene talla, la reemplazamos
            if (currentUrl.includes('Talla:')) {
                const newUrl = currentUrl.replace(/Talla%3A%20[A-Z]+/g, 'Talla%3A%20' + size);
                document.getElementById('whatsappBtn').href = newUrl;
            } else {
                // Si no tiene talla, la agregamos
                document.getElementById('whatsappBtn').href = currentUrl + '%0A%F0%9F%93%8F%20Talla%3A%20' + size;
            }
        });
    });

    console.log('✅ Producto cargado:', product.title, product.subtitle);
});