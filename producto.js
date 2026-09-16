// ============================================================
// ========== NOIR BLVNK — DETALLE PRODUCTO ===================
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🖤 NOIR BLVNK — Detalle de producto');

    // ============================================================
    // ========== MEDIDAS POR TALLA ===============================
    // ============================================================

    const sizeMeasurements = {
        'S':   { width: '50 cm', length: '68 cm', equivalent: 'CH' },
        'M':   { width: '52 cm', length: '70 cm', equivalent: 'M' },
        'L':   { width: '54 cm', length: '72 cm', equivalent: 'G' },
        'XL':  { width: '56 cm', length: '74 cm', equivalent: 'XG' },
        'XXL': { width: '58 cm', length: '76 cm', equivalent: '2XG' }
    };

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
        window.location.href = 'index.html#coleccion';
        return;
    }

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

    // ============================================================
    // ========== FUNCIONES DE MEDIDAS DINÁMICAS ==================
    // ============================================================

    function updateSizeMeasurements(size) {
        const measurements = sizeMeasurements[size];
        if (!measurements) return;

        const current = document.getElementById('sizeMeasurementCurrent');
        const width = document.getElementById('sizeWidth');
        const length = document.getElementById('sizeLength');
        const equivalent = document.getElementById('sizeEquivalent');
        const infoBlock = document.getElementById('sizeMeasurementInfo');

        if (current) current.textContent = size;
        if (width) width.textContent = measurements.width;
        if (length) length.textContent = measurements.length;
        if (equivalent) equivalent.textContent = measurements.equivalent;

        if (infoBlock) {
            infoBlock.style.animation = 'none';
            setTimeout(() => {
                infoBlock.style.animation = 'measurementFadeIn 0.5s ease';
            }, 10);
        }

        highlightSizeRow(size);
        console.log('📏 Medidas actualizadas para talla:', size);
    }

    function highlightSizeRow(size) {
        document.querySelectorAll('.size-table tbody tr').forEach(row => {
            row.classList.remove('highlighted');
            const firstCell = row.querySelector('td');
            if (firstCell && firstCell.textContent.trim() === size) {
                row.classList.add('highlighted');
            }
        });
    }

    // ============================================================
    // ========== GENERAR BOTONES DE TALLAS =======================
    // ============================================================

    const sizesContainer = document.getElementById('productSizes');
    sizesContainer.innerHTML = '';

    product.sizes.forEach(function(size) {
        const button = document.createElement('button');
        button.classList.add('product-detail-size');
        if (!product.stock[size]) {
            button.classList.add('out-of-stock');
        }
        if (size === 'M' && product.stock[size]) {
            button.classList.add('active');
        }
        button.textContent = size;
        button.dataset.size = size;

        // ===== EVENTO CLIC =====
        button.addEventListener('click', function() {
            if (this.classList.contains('out-of-stock')) return;

            document.querySelectorAll('.product-detail-size').forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            const selectedSize = this.dataset.size;

            // 1. Actualizar medidas
            updateSizeMeasurements(selectedSize);

            // 2. Actualizar WhatsApp
            const whatsappBtn = document.getElementById('whatsappBtn');
            if (whatsappBtn && product.whatsapp) {
                whatsappBtn.href = product.whatsapp + '%0A%F0%9F%93%8F%20Talla%3A%20' + selectedSize;
            }
        });

        sizesContainer.appendChild(button);
    });

    // ============================================================
    // ========== INICIALIZAR CON TALLA ACTIVA ====================
    // ============================================================

    const initialActive = document.querySelector('.product-detail-size.active');
    if (initialActive) {
        updateSizeMeasurements(initialActive.dataset.size);
    }

    // ============================================================
    // ========== GUÍA DE TALLAS (MODAL) ==========================
    // ============================================================

    const sizeGuideModal = document.getElementById('sizeGuideModal');
    const openSizeGuide = document.getElementById('openSizeGuide');
    const openSizeGuideFooter = document.getElementById('openSizeGuideFooter');
    const closeSizeGuide = document.getElementById('closeSizeGuide');

    if (sizeGuideModal) {
        function openModal(e) {
            if (e) e.preventDefault();
            sizeGuideModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            const activeSize = document.querySelector('.product-detail-size.active');
            if (activeSize) highlightSizeRow(activeSize.dataset.size);
        }

        if (openSizeGuide) openSizeGuide.addEventListener('click', openModal);
        if (openSizeGuideFooter) openSizeGuideFooter.addEventListener('click', openModal);

        if (closeSizeGuide) {
            closeSizeGuide.addEventListener('click', function() {
                sizeGuideModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        sizeGuideModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sizeGuideModal.classList.contains('active')) {
                sizeGuideModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================================
    // ========== MODAL TÉRMINOS ==================================
    // ============================================================

    const termsModal = document.getElementById('termsModal');
    const openTerms = document.getElementById('openTerms');
    const closeTerms = document.getElementById('closeTerms');

    if (termsModal) {
        if (openTerms) {
            openTerms.addEventListener('click', function(e) {
                e.preventDefault();
                termsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        if (closeTerms) {
            closeTerms.addEventListener('click', function() {
                termsModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        termsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    const openPrivacy = document.getElementById('openPrivacy');
    if (openPrivacy) {
        openPrivacy.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Política de Privacidad - Próximamente disponible.');
        });
    }

    // ============================================================
    // ========== SPOTLIGHT =======================================
    // ============================================================

    const spot = document.getElementById('spotlight');
    if (spot) {
        window.addEventListener('pointermove', function(e) {
            spot.style.setProperty('--mx', e.clientX + 'px');
            spot.style.setProperty('--my', e.clientY + 'px');
        });
    }

    // ============================================================
    // ========== MENÚ MÓVIL ======================================
    // ============================================================

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ============================================================
    // ========== THEME TOGGLE ====================================
    // ============================================================

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        const icon = isLight ? '☀️' : '🌙';
        if (themeIcon) themeIcon.textContent = icon;
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    function applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else if (savedTheme === 'dark') {
            document.body.classList.remove('light-mode');
            if (themeIcon) themeIcon.textContent = '🌙';
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!prefersDark) {
                document.body.classList.add('light-mode');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                document.body.classList.remove('light-mode');
                if (themeIcon) themeIcon.textContent = '🌙';
            }
        }
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    applyTheme();

    console.log('✅ Producto cargado:', product.title, product.subtitle);
});