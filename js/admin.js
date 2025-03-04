console.log("El archivo admin.js se ha cargado correctamente");

document.addEventListener("contentLoaded", function(event) {
    if (event.detail === "login_admin.html") {
        console.log("Inicializando la página de administrador");
        const loginAdminForm = document.getElementById("loginAdminForm");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        if (loginAdminForm) {
            console.log("Formulario de inicio de sesión encontrado");
            loginAdminForm.addEventListener("submit", async function (event) {
                event.preventDefault();

                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                const loginAdminUrl = "https://1-kvueltas-al-campo-github-io-u1xs.vercel.app/admin/login-admin";
                //const loginAdminUrl = "http://localhost:3000/admin/login-admin";

                try {
                    const response = await fetch(loginAdminUrl, { // Añadir URL completa
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ username, password })
                    });

                    // Verificar si la respuesta es JSON
                    const contentType = response.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        throw new Error("Respuesta no es JSON");
                    }

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem("token", data.token);
                        loadPage("admin.html"); // Usar loadPage para cargar el panel
                    } else {
                        alert(data.error || "Error al iniciar sesión");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Error al conectar con el servidor");
                }

                usernameInput.value = "";
                passwordInput.value = "";
            });
        }
    } else if (event.detail === "admin.html") {
        // Configurar el botón de subida de archivos
        const uploadForm = document.getElementById("uploadForm");
        const uploadResult = document.getElementById("uploadResult");

        if (uploadForm) {
            uploadForm.addEventListener("submit", async function (event) {
                event.preventDefault();

                const fileInput = document.getElementById("file");
                const file = fileInput.files[0];

                if (!file) {
                    alert("Por favor, selecciona un archivo");
                    return;
                }

                const formData = new FormData();
                formData.append("file", file);

                try {
                    const token = localStorage.getItem("token");
                    const uploadUrl = "https://1-kvueltas-al-campo-github-io-u1xs.vercel.app/admin/upload";
                    //const uploadUrl = "http://localhost:3000/admin/upload";

                    const response = await fetch(uploadUrl, {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        uploadResult.textContent = data.message;
                    } else {
                        uploadResult.textContent = data.error || "Error al subir el archivo";
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uploadResult.textContent = "Error al conectar con el servidor";
                }
            });
        }
    }
});