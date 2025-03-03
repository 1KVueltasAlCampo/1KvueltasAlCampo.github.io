document.addEventListener("DOMContentLoaded", function () {
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

            // Obtener los valores ANTES de limpiar los inputs
            const cedula = cedulaInput.value.trim();
            const password = passwordInput.value.trim();

            console.log("Cedula:", cedula);
            console.log("Password:", password);

            if (!cedula || !password) {
                alert("Cédula y contraseña son requeridas");
                return;
            }

            try {
                // Hacer una solicitud al backend
                const response = await fetch("https://1-kvueltas-al-campo-github-io-u1xs.vercel.app/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ cedula, password }) // Enviar valores antes de limpiar
                });

                const data = await response.json();

                if (response.ok) {
                    // Mostrar los resultados
                    totalAhorros.textContent = data.totalAhorros;
                    capacidadSinDeudor.textContent = data.capacidadSinDeudor;
                    capacidadConDeudor.textContent = data.capacidadConDeudor;
                    resultDiv.classList.remove("hidden");

                    // Ahora sí limpiar los campos del formulario
                    cedulaInput.value = "";
                    passwordInput.value = "";
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
});
