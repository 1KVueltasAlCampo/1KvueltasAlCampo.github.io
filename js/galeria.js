console.log("El archivo galeria.js se ha cargado correctamente");

document.addEventListener("contentLoaded", function (event) {
    if (event.detail === "galeria.html") {
        console.log("Inicializando la galería en galeria.html");
        initGallery();
    }
});

// También inicializar si se carga directamente (sin el evento contentLoaded)
document.addEventListener("DOMContentLoaded", function() {
    // Verificar si estamos en la página de galería
    if (window.location.pathname.includes("galeria.html")) {
        console.log("Inicializando la galería por carga directa");
        initGallery();
    }
});

// Configuración de la galería
const galleryConfig = {
    initialBatch: 12,      // Cantidad inicial de imágenes a cargar
    batchSize: 8,          // Cantidad de imágenes a cargar por lote
    startIndex: 4,         // Índice inicial (inicio_4.jpg)
    endIndex: 33,          // Índice final (inicio_33.jpg)
    currentIndex: 4,       // Índice actual para rastrear la carga
    layoutPatterns: [      // Patrones de diseño para alternar tamaños de imágenes
        { type: 'large'},
        { type: ''},
        { type: ''},
        { type: 'medium'},
        { type: ''},
        { type: 'medium'},
        { type: ''}
    ]
};

function initGallery() {
    console.log("Configurando la galería de fotos");
    
    // Inicializar la galería con el primer lote de imágenes
    loadImageBatch(galleryConfig.initialBatch);
    
    // Configurar el botón "Cargar más"
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadImageBatch(galleryConfig.batchSize);
        });
    }
    
    // Configurar el lightbox
    setupLightbox();
}

// Función para cargar un lote de imágenes
function loadImageBatch(batchSize) {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) {
        console.error("No se encontró el contenedor de la galería");
        return;
    }
    
    let imagesLoaded = 0;
    const maxIndex = Math.min(galleryConfig.currentIndex + batchSize - 1, galleryConfig.endIndex);
    
    for (let i = galleryConfig.currentIndex; i <= maxIndex; i++) {
        if (i > galleryConfig.endIndex) break;
        
        // Determinar el patrón de diseño para esta imagen
        const patternIndex = (i - galleryConfig.startIndex) % galleryConfig.layoutPatterns.length;
        const pattern = galleryConfig.layoutPatterns[patternIndex];
        
        // Crear el elemento de la galería
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${pattern.type}`;
        
        // Calcular el retraso de animación
        const animationDelay = (imagesLoaded * 0.1);
        galleryItem.style.animationDelay = `${animationDelay}s`;
        
        // Construir el HTML del item - Sin título en el overlay
        galleryItem.innerHTML = `
            <img src="../img/inicio_${i}.jpg" alt="Imagen ${i}" loading="lazy">
            <div class="overlay">
                <div class="overlay-content">
                </div>
            </div>
        `;
        
        // Agregar el item a la galería
        gallery.appendChild(galleryItem);
        imagesLoaded++;
    }
    
    // Actualizar el índice actual para la próxima carga
    galleryConfig.currentIndex = maxIndex + 1;
    
    // Mostrar/ocultar el botón de cargar más según sea necesario
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn && galleryConfig.currentIndex > galleryConfig.endIndex) {
        loadMoreBtn.style.display = 'none';
    }
    
    // Actualizar el lightbox para incluir las nuevas imágenes
    setupLightbox();
}

function setupLightbox() {
    // Seleccionar todos los elementos de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Crear elementos del lightbox si no existen
    if (!document.querySelector('.lightbox-container')) {
        const lightboxContainer = document.createElement('div');
        lightboxContainer.className = 'lightbox-container';
        lightboxContainer.style.display = 'none';
        lightboxContainer.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="" alt="Imagen ampliada">
                <button class="lightbox-prev">&#10094;</button>
                <button class="lightbox-next">&#10095;</button>
            </div>
        `;
        document.body.appendChild(lightboxContainer);
        
        // Estilos CSS para el lightbox - Insertar dinámicamente
        const style = document.createElement('style');
        style.textContent = `
            .lightbox-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .lightbox-container.active {
                opacity: 1;
            }
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
            }
            .lightbox-content {
                position: relative;
                width: 80%;
                max-width: 1000px;
                height: 80%;
                margin: 5% auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 80%;
                object-fit: contain;
                border: 2px solid white;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                transition: opacity 0.2s ease;
            }
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                font-size: 2rem;
                color: white;
                background: none;
                border: none;
                cursor: pointer;
            }
            .lightbox-prev, .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                transition: background 0.3s;
            }
            .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(0, 64, 128, 0.8);
            }
            .lightbox-prev { left: 20px; }
            .lightbox-next { right: 20px; }
        `;
        document.head.appendChild(style);
    }
    
    // Variables para el índice actual de imagen y la colección de imágenes
    let currentIndex = 0;
    let images = [];
    
    // Eventos de lightbox
    const lightbox = document.querySelector('.lightbox-container');
    
    // Cerrar lightbox al hacer clic en el overlay o botón cerrar
    document.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // Botones de navegación
    document.querySelector('.lightbox-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        prevImage();
    });
    document.querySelector('.lightbox-next').addEventListener('click', function(e) {
        e.stopPropagation();
        nextImage();
    });
    
    // Eliminar eventos previos para evitar duplicados
    galleryItems.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
    });
    
    // Agregar el evento de clic a cada elemento de la galería
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            // Recopilar todas las imágenes sin títulos
            images = Array.from(document.querySelectorAll('.gallery-item')).map(item => {
                const img = item.querySelector('img');
                return {
                    src: img.src,
                    alt: img.alt
                };
            });
            
            // Mostrar la imagen seleccionada
            currentIndex = index;
            openLightbox(images[currentIndex]);
        });
    });
    
    // Función para abrir el lightbox
    function openLightbox(imageData) {
        const lightbox = document.querySelector('.lightbox-container');
        const lightboxImg = document.querySelector('.lightbox-image');
        
        lightboxImg.src = imageData.src;
        lightboxImg.alt = imageData.alt;
        
        // Mostrar el lightbox con una animación
        lightbox.style.display = 'block';
        
        // Forzar un reflow antes de agregar la clase
        void lightbox.offsetWidth;
        
        // Añadir la clase active para la transición
        lightbox.classList.add('active');
        
        // Deshabilitar el scroll de la página
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el lightbox
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox-container');
        lightbox.classList.remove('active');
        
        // Esperar a que termine la transición para ocultar
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
        
        // Restaurar el scroll
        document.body.style.overflow = '';
    }
    
    // Función para ir a la imagen anterior
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxContent(images[currentIndex]);
    }
    
    // Función para ir a la siguiente imagen
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxContent(images[currentIndex]);
    }
    
    // Actualizar el contenido del lightbox sin cerrarlo y abrirlo
    function updateLightboxContent(imageData) {
        const lightboxImg = document.querySelector('.lightbox-image');
        
        // Aplicar una breve transición de opacidad
        lightboxImg.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImg.src = imageData.src;
            lightboxImg.alt = imageData.alt;
            
            lightboxImg.style.opacity = 1;
        }, 200);
    }
    
    // Manejar teclas de dirección para navegación
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display !== 'block') return;
        
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}