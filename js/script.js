function loadPage(page) {
    fetch(`pages/${page}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;
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
