document.addEventListener("contentLoaded", function (event) {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita el envío del formulario

            // Obtener los valores del formulario
            const nombre = document.getElementById("nombre").value;
            const asunto = document.getElementById("asunto").value;
            const mensaje = document.getElementById("mensaje").value;

            // Correo predefinido
            const correo = "fedintep@gmail.com";

            // Construir el enlace mailto
            const mailtoLink = `mailto:${correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(`Nombre: ${nombre}\n\nMensaje: ${mensaje}`)}`;

            // Abrir el cliente de correo
            window.location.href = mailtoLink;
        });
    } else {
        console.error("El formulario #contactForm no se encontró en el DOM");
    }
});