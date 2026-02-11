console.log("Cargado script: contactanos.js");

document.addEventListener("pageLoaded", function (event) {
    // Verificamos si la página actual es 'contactanos'
    if (event.detail === "contactanos") {
        console.log("Inicializando formulario de contacto");

        const contactForm = document.getElementById("contactForm");

        if (contactForm) {
            // Eliminar listeners antiguos para evitar duplicados (buena práctica en SPA)
            const newForm = contactForm.cloneNode(true);
            contactForm.parentNode.replaceChild(newForm, contactForm);

            newForm.addEventListener("submit", function (e) {
                e.preventDefault(); // 1. DETIENE la recarga de la página

                // 2. Obtener valores
                const nombre = document.getElementById("nombre").value;
                const asunto = document.getElementById("asunto").value;
                const mensaje = document.getElementById("mensaje").value;

                // 3. Validación básica (opcional, el HTML 'required' ya ayuda)
                if (!nombre || !mensaje) {
                    alert("Por favor diligencie los campos obligatorios.");
                    return;
                }

                // 4. Construir Mailto
                const correoDestino = "fedintep@gmail.com";
                const subject = `Contacto Web: ${asunto}`;
                const body = `Nombre: ${nombre}\n\nMensaje:\n${mensaje}`;
                
                const mailtoLink = `mailto:${correoDestino}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                // 5. Abrir cliente de correo
                window.location.href = mailtoLink;
                
                // Opcional: Limpiar formulario
                newForm.reset();
            });
            console.log("Evento submit adjuntado correctamente.");
        } else {
            console.error("Error: No se encontró el formulario #contactForm.");
        }
    }
});