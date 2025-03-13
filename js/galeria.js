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

function initGallery() {
    console.log("Configurando la galería de fotos");
    
    // Inicializar elementos de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Agregar animaciones con retraso
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${0.1 * index}s`;
    });
    
    // Configurar el lightbox
    setupLightbox();
    
    // Configurar el botón "Ver más"
    const viewMoreBtn = document.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botón 'Ver más fotos' presionado - Sin funcionalidad por el momento");
            // Aquí se puede agregar la funcionalidad futura
        });
    }
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
                <div class="lightbox-caption"></div>
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
            }
            .lightbox-caption {
                color: white;
                margin-top: 20px;
                font-size: 1.2rem;
                text-align: center;
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
    
    // Agregar el evento de clic a cada elemento de la galería
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Recopilar todas las imágenes y sus textos
            images = Array.from(galleryItems).map(item => {
                const img = item.querySelector('img');
                const title = item.querySelector('.overlay-content h3')?.textContent || '';
                const desc = item.querySelector('.overlay-content p')?.textContent || '';
                return {
                    src: img.src,
                    alt: img.alt,
                    title: title,
                    description: desc
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
        const caption = document.querySelector('.lightbox-caption');
        
        lightboxImg.src = imageData.src;
        lightboxImg.alt = imageData.alt;
        
        // Mostrar título y descripción si existen
        let captionText = imageData.title;
        if (imageData.description) {
            captionText += `<p>${imageData.description}</p>`;
        }
        caption.innerHTML = captionText;
        
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
        const caption = document.querySelector('.lightbox-caption');
        
        // Aplicar una breve transición de opacidad
        lightboxImg.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImg.src = imageData.src;
            lightboxImg.alt = imageData.alt;
            
            // Mostrar título y descripción si existen
            let captionText = imageData.title;
            if (imageData.description) {
                captionText += `<p>${imageData.description}</p>`;
            }
            caption.innerHTML = captionText;
            
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

// Función para agregar dinámicamente nuevas imágenes a la galería
window.addGalleryItem = function(imageSrc, title, description = '', size = '') {
    // Crear el nuevo elemento de galería
    const gallery = document.querySelector('.photo-gallery');
    if (!gallery) {
        console.error("No se encontró el contenedor de la galería");
        return;
    }
    
    const newItem = document.createElement('div');
    
    // Asignar clase y tamaño si se especifica (medium o large)
    newItem.className = 'gallery-item';
    if (size === 'medium' || size === 'large') {
        newItem.classList.add(size);
    }
    
    // Estructura HTML del nuevo elemento
    newItem.innerHTML = `
        <img src="${imageSrc}" alt="${title}">
        <div class="overlay">
            <div class="overlay-content">
                <h3>${title}</h3>
                ${description ? `<p>${description}</p>` : ''}
            </div>
        </div>
    `;
    
    // Agregar a la galería con animación
    newItem.style.opacity = 0;
    gallery.appendChild(newItem);
    
    // Forzar un reflow antes de agregar la animación
    void newItem.offsetWidth;
    
    // Aplicar la animación
    newItem.style.animation = 'fadeIn 0.6s forwards';
    
    // Actualizar los eventos después de agregar un nuevo elemento
    setupLightbox();
    
    console.log(`Nueva imagen agregada: "${title}"`);
};

// Función para eliminar imágenes de la galería
window.removeGalleryItem = function(index) {
    const items = document.querySelectorAll('.gallery-item');
    if (index >= 0 && index < items.length) {
        // Agregar animación de salida
        items[index].style.animation = 'fadeOut 0.4s forwards';
        
        // Eliminar después de la animación
        setTimeout(() => {
            items[index].remove();
            // Volver a inicializar la galería para actualizar eventos
            setupLightbox();
            console.log(`Imagen en posición ${index} eliminada`);
        }, 400);
    } else {
        console.error(`Índice fuera de rango: ${index}. La galería tiene ${items.length} elementos.`);
    }
};

// Agregar estilos para la animación de salida si no existen
if (!document.querySelector('style[data-id="gallery-animations"]')) {
    const animationStyles = document.createElement('style');
    animationStyles.dataset.id = 'gallery-animations';
    animationStyles.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(20px);
            }
        }
        
        .lightbox-image {
            transition: opacity 0.2s ease;
        }
    `;
    document.head.appendChild(animationStyles);
}