console.log("Cargado script: quien_puede_ser_asociado.js");

document.addEventListener("pageLoaded", function (event) {
    // Verificamos si la página cargada es la nuestra
    // Nota: Asegúrate que en tu script.js el nombre coincida ('quien_puede_ser_asociado')
    if (event.detail === "quien_puede_ser_asociado") {
        console.log("Inicializando eventos de Quién Puede Ser Asociado");
        
        const btnSaberMas = document.getElementById("btn-ir-como-asociarse");
        
        if (btnSaberMas) {
            btnSaberMas.addEventListener("click", function(e) {
                e.preventDefault(); // DETIENE la recarga de página
                
                // Verificamos si la función global existe antes de llamarla
                if (typeof window.loadPage === "function") {
                    window.loadPage("como_asociarse");
                } else {
                    console.error("Error: loadPage no está disponible.");
                }
            });
        }
    }
});