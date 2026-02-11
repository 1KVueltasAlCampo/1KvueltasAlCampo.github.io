console.log("El archivo galeria.js se ha cargado correctamente");

document.addEventListener("pageLoaded", function (event) {
    // Detectamos si entramos a la página 'galeria'
    if (event.detail === "galeria") {
        console.log("Inicializando la galería de fotos");
        initGalleryPage();
    }
});

// Configuración
const photoGalleryConfig = {
    initialBatch: 12,
    batchSize: 8,
    startIndex: 4,
    endIndex: 33,
    currentIndex: 4,
    layoutPatterns: [
        { type: 'large'}, { type: ''}, { type: ''}, { type: 'medium'},
        { type: ''}, { type: 'medium'}, { type: ''}
    ]
};

function initGalleryPage() {
    // Reiniciar configuración al entrar a la página
    photoGalleryConfig.currentIndex = photoGalleryConfig.startIndex;
    
    // Cargar primer lote
    loadPhotoBatch(photoGalleryConfig.initialBatch);
    
    // Configurar botón "Cargar más"
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        // Limpieza de listeners anteriores
        const newBtn = loadMoreBtn.cloneNode(true);
        loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadPhotoBatch(photoGalleryConfig.batchSize);
        });
    }
    
    setupPhotoLightbox();
}

function loadPhotoBatch(batchSize) {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;
    
    let imagesLoaded = 0;
    const maxIndex = Math.min(photoGalleryConfig.currentIndex + batchSize - 1, photoGalleryConfig.endIndex);
    
    for (let i = photoGalleryConfig.currentIndex; i <= maxIndex; i++) {
        const patternIndex = (i - photoGalleryConfig.startIndex) % photoGalleryConfig.layoutPatterns.length;
        const pattern = photoGalleryConfig.layoutPatterns[patternIndex];
        
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${pattern.type}`;
        galleryItem.style.animationDelay = `${imagesLoaded * 0.1}s`;
        
        // Ajusta la ruta '../img/' a 'img/' si index.html está en la raíz
        // Asumo 'img/' basado en tu estructura actual de root
        galleryItem.innerHTML = `
            <img src="img/inicio_${i}.jpg" alt="Foto ${i}" loading="lazy" onerror="this.style.display='none'">
            <div class="overlay"><div class="overlay-content"></div></div>
        `;
        
        // Evento Click para Lightbox
        galleryItem.addEventListener('click', () => {
            const imgSrc = galleryItem.querySelector('img').src;
            openPhotoLightbox(imgSrc);
        });
        
        gallery.appendChild(galleryItem);
        imagesLoaded++;
    }
    
    photoGalleryConfig.currentIndex = maxIndex + 1;
    
    const btn = document.getElementById('load-more-btn');
    if (btn && photoGalleryConfig.currentIndex > photoGalleryConfig.endIndex) {
        btn.style.display = 'none';
    }
}

function setupPhotoLightbox() {
    // Evitar duplicados del lightbox en el DOM
    const existingLightbox = document.querySelector('.lightbox-container');
    if (existingLightbox) existingLightbox.remove();

    const lightboxHTML = `
        <div class="lightbox-container" style="display:none;">
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" style="color:white; font-size: 2rem; background:none; border:none; position:absolute; top:-40px; right:0; cursor:pointer;">&times;</button>
                <img class="lightbox-image" src="" alt="Zoom" style="max-width:100%; max-height:80vh; border:2px solid white;">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    // Eventos de cierre
    const lightbox = document.querySelector('.lightbox-container');
    const closeBtn = document.querySelector('.lightbox-close');
    const overlay = document.querySelector('.lightbox-overlay');

    const close = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    closeBtn.onclick = close;
    overlay.onclick = close;
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') close();
    });
}

function openPhotoLightbox(src) {
    const lightbox = document.querySelector('.lightbox-container');
    const img = document.querySelector('.lightbox-image');
    if(lightbox && img) {
        img.src = src;
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.zIndex = '9999';
        lightbox.style.backgroundColor = 'rgba(0,0,0,0.9)';
        
        document.body.style.overflow = 'hidden';
    }
}