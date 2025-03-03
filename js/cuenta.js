document.addEventListener("contentLoaded", function (event) {
    if (event.detail === "cuenta.html") {
        console.log("Inicializando la página de cuenta");

        const loginForm = document.getElementById("loginForm");
        const resultDiv = document.getElementById("result");
        const totalAhorros = document.getElementById("totalAhorros");
        const capacidadSinDeudor = document.getElementById("capacidadSinDeudor");
        const capacidadConDeudor = document.getElementById("capacidadConDeudor");
        const cedulaInput = document.getElementById("cedula");
        const passwordInput = document.getElementById("password");

        if (loginForm) {
            loginForm.addEventListener("submit", async function (event) {
                event.preventDefault(); // Evita que el formulario se envíe y recargue la página

                // Limpiar los campos del formulario
                cedulaInput.value = "";
                passwordInput.value = "";

                // Ocultar los resultados anteriores
                resultDiv.classList.add("hidden");
                totalAhorros.textContent = "";
                capacidadSinDeudor.textContent = "";
                capacidadConDeudor.textContent = "";

                const cedula = cedulaInput.value;
                const password = passwordInput.value;

                try {
                    // Hacer una solicitud al backend
                    const response = await fetch("https://tu-backend-url.vercel.app/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ cedula, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Mostrar los resultados
                        totalAhorros.textContent = data.totalAhorros;
                        capacidadSinDeudor.textContent = data.capacidadSinDeudor;
                        capacidadConDeudor.textContent = data.capacidadConDeudor;
                        resultDiv.classList.remove("hidden");
                    } else {
                        alert(data.error || "Error al iniciar sesión");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Error al conectar con el servidor");
                }
            });
        } else {
            console.error("El formulario #loginForm no se encontró en el DOM");
        }
    }
});