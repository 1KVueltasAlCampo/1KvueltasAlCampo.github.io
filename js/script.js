let galleryInterval = null; // Variable global para almacenar el intervalo de la galería

function loadPage(page) {
    // Pausar la galería si está activa
    if (galleryInterval) {
        clearInterval(galleryInterval);
        galleryInterval = null;
        console.log("Galería pausada al cargar una nueva página");
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

// Cargar por defecto la página de inicio
document.addEventListener("DOMContentLoaded", function () {
    loadPage('inicio.html');
});