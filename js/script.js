// Variable global para controlar intervalos (carruseles, auto-play)
let activeIntervals = [];

// Función para limpiar intervalos previos al cambiar de página
function clearIntervals() {
    activeIntervals.forEach(interval => clearInterval(interval));
    activeIntervals = [];
}

/**
 * Función principal para cargar fragmentos HTML
 * @param {string} page - Nombre de la página (ej: 'inicio', 'galeria')
 */
async function loadPage(page) {
    try {
        // 1. Limpieza previa
        clearIntervals(); 
        
        // Cerrar menú móvil si está abierto (Bootstrap)
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
            bsCollapse.hide();
        }

        // 2. Normalización del nombre
        // Si viene "como_asociarse.html" o "/como_asociarse", lo limpiamos a "como_asociarse"
        const pageName = page.replace('.html', '').replace(/^\//, '');
        const targetUrl = `pages/${pageName}.html`;

        // 3. Petición Fetch
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`No se pudo cargar ${targetUrl}`);
        
        const html = await response.text();

        // 4. Inyección en el DOM
        const contentDiv = document.getElementById("content");
        contentDiv.style.opacity = 0;
        
        setTimeout(() => {
            contentDiv.innerHTML = html;
            contentDiv.style.opacity = 1;
            
            // Scroll arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // 5. DISPARAR EVENTO PERSONALIZADO (CRÍTICO)
            // Esto le grita a galeria.js: "¡OYE, YA CARGUÉ LA GALERÍA!"
            const event = new CustomEvent("pageLoaded", { detail: pageName });
            document.dispatchEvent(event);
            console.log(`Página cargada y evento disparado: ${pageName}`);
        }, 200);

    } catch (error) {
        console.error("Error crítico:", error);
        // Si falla, intentamos cargar inicio
        if (page !== 'inicio') loadPage('inicio');
    }
}

// Manejo de navegación (SPA)
document.addEventListener("DOMContentLoaded", () => {
    // 1. Interceptar TODOS los clics en enlaces
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        
        // Si es un enlace interno (empieza con / o no tiene http)
        if (link && link.getAttribute('href') && 
            !link.getAttribute('href').startsWith('http') && 
            !link.getAttribute('href').startsWith('#') &&
            !link.getAttribute('target')) {
            
            e.preventDefault(); // Evita que el navegador recargue
            const href = link.getAttribute('href');
            const page = href.replace(/^\//, '') || 'inicio';
            
            // Actualizar URL del navegador visualmente
            window.history.pushState({ page }, null, `/${page}`);
            loadPage(page);
        }
    });

    // 2. Manejar botones de "Atrás/Adelante" del navegador
    window.addEventListener('popstate', (e) => {
        const state = e.state;
        const page = state ? state.page : 'inicio';
        loadPage(page);
    });

    // 3. Carga inicial basada en la URL actual
    const initialPath = window.location.pathname.replace(/^\//, ''); // Quitar barra inicial
    loadPage(initialPath || 'inicio');
});