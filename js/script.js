let galleryInterval = null; // Variable global para almacenar el intervalo de la galería

function loadPage(page) {
    // Pausar la galería si está activa
    if (galleryInterval) {
        clearInterval(galleryInterval);
        galleryInterval = null;
        console.log("Galería pausada al cargar una nueva página");
    }

    // Cerrar el menú móvil desplegado si está abierto
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        }
    }

    // Si la página no incluye .html, agregarlo
    if (!page.endsWith('.html')) {
        page = page + '.html';
    }

    fetch(`pages/${page}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;
            
            // Desplazar el scroll hacia arriba
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Hace que el desplazamiento sea suave
            });
            
            // Disparar un evento personalizado después de cargar el contenido
            const event = new CustomEvent("contentLoaded", { detail: page });
            document.dispatchEvent(event);
        })
        .catch(error => console.error("Error al cargar la página:", error));
}

// Función para capturar los clics en enlaces y manejar la navegación
function handleNavigation(event) {
    // Verificar si el clic fue en un enlace y no es un enlace externo o con target="_blank"
    const link = event.target.closest('a');
    if (link && link.getAttribute('href') && 
        !link.getAttribute('target') && 
        link.getAttribute('href').indexOf('http') !== 0 &&
        link.getAttribute('href') !== '#') {
        
        // Prevenir el comportamiento predeterminado
        event.preventDefault();
        
        // Obtener la ruta de la URL
        const path = link.getAttribute('href');
        
        // Extraer el nombre de la página de la ruta
        let pageName = path.replace(/^\//, ''); // Eliminar la barra inicial
        if (!pageName) pageName = 'inicio';
        
        // Actualizar la URL sin recargar la página
        window.history.pushState({pageName}, pageName, path);
        
        // Cargar el contenido
        loadPage(pageName);
    }
}

// Función para manejar los eventos de navegación del navegador (atrás/adelante)
function handlePopState(event) {
    // Obtener el nombre de la página del estado, o usar 'inicio' como valor predeterminado
    let pageName = 'inicio';
    if (event.state && event.state.pageName) {
        pageName = event.state.pageName;
    } else {
        // Si no hay estado, extraer el nombre de la página de la URL actual
        const path = window.location.pathname.replace(/^\//, '');
        pageName = path || 'inicio';
    }
    
    // Cargar la página
    loadPage(pageName);
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function() {
    // Añadir el controlador de eventos para los clics en enlaces
    document.body.addEventListener('click', handleNavigation);
    
    // Añadir el controlador de eventos para los botones de navegación del navegador
    window.addEventListener('popstate', handlePopState);
    
    // Obtener la ruta inicial de la URL actual
    const path = window.location.pathname.replace(/^\//, '');
    const pageName = path || 'inicio';
    
    // Establecer el estado inicial
    window.history.replaceState({pageName}, pageName, '/' + pageName);
    
    // Cargar la página inicial
    loadPage(pageName);
});