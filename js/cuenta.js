document.addEventListener("pageLoaded", function (e) {
    const page = e.detail;

    // --- LÓGICA PARA LA PÁGINA DE LOGIN (cuenta) ---
    if (page === "cuenta") {
        const loginForm = document.getElementById("loginForm");
        
        if (loginForm) {
            loginForm.addEventListener("submit", async function (event) {
                event.preventDefault(); 
                const btnSubmit = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = btnSubmit.innerText;
                
                try {
                    btnSubmit.innerText = "Verificando...";
                    btnSubmit.disabled = true;

                    const cedula = document.getElementById("cedula").value;
                    const password = document.getElementById("password").value;
                    
                    // URL de la API (Considerar mover a un archivo config.js en el futuro)
                    const url = "https://1-kvueltas-al-campo-github-io-u1xs.vercel.app/login";

                    const response = await fetch(url, { 
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ cedula, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // GUARDAR DATOS EN SESIÓN (Más seguro que URL params)
                        sessionStorage.setItem('userData', JSON.stringify(data));
                        // Redirigir internamente
                        loadPage("estado_cuenta");
                    } else {
                        alert(data.error || "Credenciales incorrectas");
                    }
                } catch (error) {
                    console.error("Error de red:", error);
                    alert("No se pudo conectar con el servidor de Fedintep.");
                } finally {
                    btnSubmit.innerText = originalBtnText;
                    btnSubmit.disabled = false;
                }
            });
        }
    }

    // --- LÓGICA PARA LA PÁGINA DE RESULTADOS (estado_cuenta) ---
    if (page === "estado_cuenta") {
        const storedData = sessionStorage.getItem('userData');
        
        if (!storedData) {
            // Si no hay datos, devolver al login
            alert("Por favor inicie sesión primero");
            loadPage("cuenta");
            return;
        }

        const data = JSON.parse(storedData);
        
        // Inyectar datos en el DOM
        document.getElementById("titulo").textContent = `Estado de cuenta al ${new Date().toLocaleDateString()}`; // O la fecha que venga del back
        document.getElementById("mensaje").textContent = data.mensaje || `Bienvenido, ${data.nombre || 'Asociado'}`;
        document.getElementById("totalAhorros").textContent = data.totalAhorros;
        document.getElementById("totalCreditos").textContent = data.totalCreditos;
        document.getElementById("capacidadSinDeudor").textContent = data.capacidadSinDeudor;
        document.getElementById("capacidadConDeudor").textContent = data.capacidadConDeudor;
    }
});