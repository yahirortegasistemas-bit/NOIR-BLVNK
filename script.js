document.addEventListener('DOMContentLoaded', function() {
    console.log('🖤 NOIR BLVNK — Playeras flotando');
    console.log('✨ Efecto 3D activado');

    // ========== SPOTLIGHT ==========
    const spot = document.getElementById('spotlight');
    if (spot) {
        window.addEventListener('pointermove', function(e) {
            spot.style.setProperty('--mx', e.clientX + 'px');
            spot.style.setProperty('--my', e.clientY + 'px');
        });
    }

    // ========== REVEAL ON SCROLL ==========
    const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
            if (en.isIntersecting) {
                en.target.classList.add('in');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function(el) {
        io.observe(el);
    });

    // ========== PAUSE MARQUEE ==========
    const marquee = document.querySelector('.marquee');
    if (marquee) {
        marquee.addEventListener('mouseenter', function() {
            marquee.style.animationPlayState = 'paused';
        });
        marquee.addEventListener('mouseleave', function() {
            marquee.style.animationPlayState = 'running';
        });
    }

    // ========== EFECTO 3D EN PLAYERAS ==========
    const productCards = document.querySelectorAll('.product-card-3d');
    const heroProducts = document.querySelector('.hero-products');
    
    if (heroProducts) {
        heroProducts.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            productCards.forEach(function(card, index) {
                const speed = 8 + index * 2;
                const rotY = x * speed;
                const rotX = -y * speed * 0.7;
                card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
            });
        });

        heroProducts.addEventListener('mouseleave', function() {
            productCards.forEach(function(card) {
                card.style.transform = '';
            });
        });
    }

    // ========== CARRUSEL 3D ==========
    const carousel = document.getElementById('carousel3d');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 324;
        
        prevBtn.addEventListener('click', function() {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        let autoScroll = setInterval(function() {
            if (!carousel.matches(':hover')) {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 4000);
        
        carousel.addEventListener('scroll', function() {
            clearInterval(autoScroll);
            autoScroll = setInterval(function() {
                if (!carousel.matches(':hover')) {
                    carousel.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }, 4000);
        });
        
        carousel.addEventListener('mouseenter', function() {
            clearInterval(autoScroll);
        });
        
        carousel.addEventListener('mouseleave', function() {
            autoScroll = setInterval(function() {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }, 4000);
        });
    }

    console.log('✅ NOIR BLVNK — Listo');
});

// ============================================================
// ========== CONTACTO — FORMULARIO (Formspree) ===============
// ============================================================

const $form = document.getElementById('form-noir');
const $status = document.getElementById('form-status');
const $btnText = document.getElementById('btn-submit-text');

if ($form) {
    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        $btnText.innerText = "ENVIANDO...";
        $btnText.style.opacity = "0.7";
        $btnText.style.pointerEvents = "none";
        
        $status.classList.remove('success', 'error');
        $status.innerText = "";

        const formData = new FormData($form);

        try {
            const response = await fetch('https://formspree.io/f/moeqeqbv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                $form.reset();
                $status.classList.add('success');
                $status.innerText = "✦ ENVIADO CORRECTAMENTE. RESPONDEREMOS ANTES DE LAS 6AM.";
            } else {
                throw new Error();
            }
        } catch (error) {
            $status.classList.add('error');
            $status.innerText = "✕ ERROR DE CONEXIÓN. INTÉNTALO DE NUEVO.";
        } finally {
            $btnText.innerText = "ENVIAR MENSAJE";
            $btnText.style.opacity = "1";
            $btnText.style.pointerEvents = "auto";
        }
    });
}