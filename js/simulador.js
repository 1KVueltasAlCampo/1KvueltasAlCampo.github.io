/* js/simulador.js */

document.addEventListener("pageLoaded", function (e) {
    if (e.detail === "simulador_credito") {
        initSimulador();
    }
});

function initSimulador() {
    // 1. Elementos del DOM
    const form = document.getElementById("formSimulador");
    const resultados = document.getElementById("resultados");
    const btnVolver = document.getElementById("btnVolver");
    const inputCapital = document.getElementById("capital");
    const resumenCredito = document.getElementById("resumenCredito");
    const valorCuota = document.getElementById("valorCuota");

    if (!form) return;

    // 2. Configurar formato de moneda en tiempo real (Tal cual la estructura actual)
    inputCapital.addEventListener('input', function(e) {
        let value = this.value.replace(/[^\d]/g, '');
        if (value === '') {
            this.value = '';
            return;
        }
        this.value = formatCurrencyInput(parseInt(value));
    });

    // 3. Lógica del Submit (Aquí restauramos la lógica antigua)
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Obtener valores limpios
        const capitalRaw = inputCapital.value.replace(/[^\d]/g, '');
        const capital = parseFloat(capitalRaw);
        const numCuotas = parseInt(document.getElementById("cuotas").value);
        const tipoCredito = document.getElementById("tipoCredito").value;

        // Validaciones
        if (isNaN(capital) || isNaN(numCuotas) || capital <= 0 || numCuotas <= 0) {
            alert("Por favor ingrese valores numéricos válidos.");
            return;
        }

        // --- INICIO LÓGICA RESTAURADA ---
        
        // Definir tasas exactas del código original
        let tasaMensual;
        
        if (tipoCredito === "ahorros") {
            // tasaInteres era 0.01
            tasaMensual = 0.0126; // 1.26% Tasa efectiva para el cálculo
        } else {
            // tasaInteres era 0.013
            tasaMensual = 0.0156; // 1.56% Tasa efectiva para el cálculo
        }

        // Nota: En el código original se definían seguros (0.00055 y 0.002) pero 
        // la variable final 'cuotaTotal' se igualaba a 'cuotaPrincipal' que usaba 'tasaMensual'.
        // Por tanto, usamos tasaMensual para replicar el valor exacto que daba antes.

        // Calcular cuota usando la fórmula financiera robusta (PAGO/PMT)
        const cuotaMensual = calcularPago(tasaMensual, numCuotas, -capital, 0, 0);

        // --- FIN LÓGICA RESTAURADA ---

        // Renderizado de resultados
        const tipoTexto = (tipoCredito === "ahorros") ? "sobre sus ahorros" : "con deudor solidario";

        resumenCredito.innerHTML = `
            Crédito de <strong>${formatMoney(capital)}</strong> a <strong>${numCuotas} meses</strong>.<br>
            Modalidad: ${tipoTexto}
        `;
        
        valorCuota.textContent = `Su cuota mensual aproximada sería de ${formatMoney(cuotaMensual)}`;

        // Mostrar/Ocultar secciones
        resultados.classList.remove("hidden");
        form.style.display = "none";
    });

    // 4. Botón Volver
    btnVolver.addEventListener("click", function() {
        resultados.classList.add("hidden");
        form.style.display = "flex"; // O 'block' dependiendo de tu CSS, flex suele ser mejor para formularios
        form.reset();
        inputCapital.value = ""; // Limpiar input manual
    });
}

// --- FUNCIONES AUXILIARES (Traídas del código antiguo) ---

/**
 * Función equivalente a la fórmula PAGO (PMT) de Excel
 * @param {number} tasa - Tasa de interés por periodo
 * @param {number} nper - Número total de pagos
 * @param {number} va   - Valor actual (Capital negativo)
 * @param {number} vf   - Valor futuro (0 por defecto)
 * @param {number} tipo - 0 para final del periodo, 1 para inicio
 */
function calcularPago(tasa, nper, va, vf = 0, tipo = 0) {
    if (tasa === 0) return -va / nper;
    
    const pvif = Math.pow(1 + tasa, nper);
    let pmt = tasa / (pvif - 1) * -(va * pvif + vf);
    
    if (tipo === 1) {
        pmt = pmt / (1 + tasa);
    }
    
    return pmt;
}

// Formateador para visualización final (COP)
function formatMoney(amount) {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        maximumFractionDigits: 0,
        minimumFractionDigits: 0 
    }).format(amount);
}

// Formateador para el input mientras escribes (sin el símbolo de moneda para facilitar edición si se desea, o con él)
function formatCurrencyInput(value) {
    return '$ ' + new Intl.NumberFormat('es-CO', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }).format(value);
}