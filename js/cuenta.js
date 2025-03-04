document.addEventListener("contentLoaded", function (event) {
    if (event.detail === "cuenta.html") {
        console.log("Inicializando la página de cuenta");

        const loginForm = document.getElementById("loginForm");
        const cedulaInput = document.getElementById("cedula");
        const passwordInput = document.getElementById("password");

        if (loginForm) {
            loginForm.addEventListener("submit", async function (event) {
                event.preventDefault(); 

                const cedula = cedulaInput.value;
                const password = passwordInput.value;
                const url = "https://1-kvueltas-al-campo-github-io-u1xs.vercel.app/login";
                //const url = "http://localhost:3000/login";

                try {
                    const response = await fetch(url, { 
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ cedula, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        const estadoCuentaHTML = `
                            <div class="estado-cuenta-container">
                                <h1>${data.mensaje}</h1>
                                <div class="estado-cuenta-resultados">
                                    <p><strong>Ahorros y aportes:</strong> <span>${data.totalAhorros}</span></p>
                                    <p><strong>Valor de créditos:</strong> <span>${data.totalCreditos}</span></p>
                                    <p><strong>Capacidad de crédito sin deudor solidario:</strong> <span>${data.capacidadSinDeudor}</span></p>
                                    <p><strong>Capacidad de crédito con deudor solidario:</strong> <span>${data.capacidadConDeudor}</span></p>
                                </div>
                                <button class="btn-volver" onclick="loadPage('cuenta.html')">Hacer otra consulta</button>
                            </div>
                        `;

                        document.getElementById("content").innerHTML = estadoCuentaHTML;
                    } else {
                        alert(data.error || "Error al iniciar sesión");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Error al conectar con el servidor");
                }

                cedulaInput.value = "";
                passwordInput.value = "";
            });
        } else {
            console.error("El formulario #loginForm no se encontró en el DOM");
        }
    }
});
