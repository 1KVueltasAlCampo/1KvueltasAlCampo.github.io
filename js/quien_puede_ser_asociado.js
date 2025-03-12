console.log("El archivo quien_puede_ser_asociado.js se ha cargado correctamente");

document.addEventListener("contentLoaded", function (event) {
    console.log("DOM completamente cargado e inicializado");

    // Seleccionar el botón dentro de la sección CTA
    const botonSaberMas = document.querySelector(".cta-section .btn-primary");

    if (botonSaberMas) {
        console.log("Botón 'Saber más' encontrado");

        botonSaberMas.addEventListener("click", function (event) {
            event.preventDefault(); // Evita la navegación predeterminada
            console.log("Cargando como_asociarse.html...");
            loadPage("como_asociarse.html"); // Cargar la nueva página
        });
    } else {
        console.error("No se encontró el botón 'Saber más'");
    }
});
