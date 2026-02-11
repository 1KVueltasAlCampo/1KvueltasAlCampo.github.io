console.log("El archivo inicio.js se ha cargado correctamente");

// Escuchar el evento 'pageLoaded' que despacha el script.js
document.addEventListener("pageLoaded", function (event) {
    // Verificar si la página cargada es 'inicio'
    if (event.detail === "inicio") {
        console.log("Inicializando la galería/slider en inicio.html");
        initHeroSlider();
        initServiceLinks(); // NUEVO: Inicializar los botones de servicios
    }
});

let heroInterval = null; // Variable local para controlar el intervalo

// --- NUEVA FUNCIÓN PARA CORREGIR LOS BOTONES ---
function initServiceLinks() {
    // Seleccionamos todos los enlaces con la clase que agregamos en el HTML
    const links = document.querySelectorAll('.service-link');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // CRÍTICO: Esto evita que la página se recargue
            
            const page = this.getAttribute('data-page');
            
            // Verificamos si loadPage existe en el ámbito global
            if (typeof window.loadPage === 'function') {
                window.loadPage(page);
            } else {
                console.error("Error: La función loadPage no está definida globalmente.");
                // Fallback: Si loadPage no es global, intenta buscarla o notifica el error
            }
        });
    });
}

function initHeroSlider() {
    // ... (El resto del código del slider queda EXACTAMENTE IGUAL) ...
    // Limpiar intervalo previo si existiera
    if (heroInterval) clearInterval(heroInterval);

    const slides = document.querySelectorAll(".slide");
    const galleryContainer = document.querySelector(".gallery-container");
    
    // Si no hay slides, salir para evitar errores
    if (!slides.length) return;

    let currentIndex = 0;
    
    // Lógica del Video (si existe)
    const video = document.getElementById("videoSlide");
    if (video) {
        video.onended = function () {
            nextSlide();
        };
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add("active");
                // Manejo de video
                const slideVideo = slide.querySelector("video");
                if (slideVideo) {
                    slideVideo.currentTime = 0;
                    slideVideo.play().catch(e => console.log("Auto-play prevenido por navegador"));
                }
            } else {
                slide.classList.remove("active");
                const slideVideo = slide.querySelector("video");
                if (slideVideo) {
                    slideVideo.pause();
                }
            }
        });
        currentIndex = index;
        updatePagination();
    }

    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
    }

    function resetInterval() {
        if (heroInterval) clearInterval(heroInterval);
        
        heroInterval = setInterval(() => {
            const currentSlide = slides[currentIndex];
            // Si hay un video reproduciéndose, no avanzar automáticamente hasta que termine
            const currentVideo = currentSlide.querySelector("video");
            if (!currentVideo || currentVideo.paused) {
                nextSlide();
            }
        }, 5000);
        
        // Importante: Registrar este intervalo en el script.js global si existe la función
        // para que se limpie al cambiar de página.
        if (typeof window.activeIntervals !== 'undefined') {
            window.activeIntervals.push(heroInterval);
        }
    }

    function createPagination() {
        // Evitar duplicar paginación si ya existe
        const existingPag = document.querySelector(".pagination");
        if(existingPag) existingPag.remove();

        const pagination = document.createElement("div");
        pagination.classList.add("pagination");

        slides.forEach((slide, i) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (i === currentIndex) {
                dot.classList.add("active");
            }
            dot.addEventListener("click", () => {
                showSlide(i);
                resetInterval();
            });
            pagination.appendChild(dot);
        });

        if(galleryContainer) galleryContainer.appendChild(pagination);
    }

    function updatePagination() {
        const dots = document.querySelectorAll(".dot");
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    // Inicialización
    showSlide(0);
    createPagination();
    resetInterval();

    // Event Listeners para botones
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    if (prevButton) {
        // Clonar para eliminar listeners viejos
        const newPrev = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrev, prevButton);
        
        newPrev.addEventListener("click", () => {
            prevSlide();
            resetInterval();
        });
    }

    if (nextButton) {
        const newNext = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNext, nextButton);

        newNext.addEventListener("click", () => {
            nextSlide();
            resetInterval();
        });
    }
}