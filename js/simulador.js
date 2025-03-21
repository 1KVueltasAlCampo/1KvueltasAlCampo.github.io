document.addEventListener("contentLoaded", function() {
    // Elementos del DOM
    const formSimulador = document.getElementById("formSimulador");
    const resultados = document.getElementById("resultados");
    const resumenCredito = document.getElementById("resumenCredito");
    const valorCuota = document.getElementById("valorCuota");
    const btnVolver = document.getElementById("btnVolver");
    const inputCapital = document.getElementById("capital");
    
    // Configurar el input de capital para formato de moneda
    setupCurrencyInput(inputCapital);
    
    // Función para configurar el formato de moneda en tiempo real
    function setupCurrencyInput(input) {
        input.addEventListener('input', function(e) {
            // Obtener solo los dígitos del valor ingresado
            let value = this.value.replace(/[^\d]/g, '');
            
            // Si no hay valor, mostrar vacío
            if (value === '') {
                this.value = '';
                return;
            }
            
            // Convertir a número
            const valueNumber = parseInt(value);
            
            // Formatear como moneda colombiana sin fracción
            this.value = formatCurrencyInput(valueNumber);
        });
        
        // Al perder foco, asegurar formato completo
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' || this.value === '$') {
                this.value = '';
            }
        });
    }
    
    // Función para formatear como moneda para input
    function formatCurrencyInput(value) {
        return '$ ' + new Intl.NumberFormat('es-CO', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(value);
    }
    
    // Evento para simular crédito
    formSimulador.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Obtener los valores del formulario y convertir el capital quitando el formato de moneda
        const capitalValue = inputCapital.value.replace(/[^\d]/g, '');
        const capital = parseFloat(capitalValue);
        const numCuotas = parseInt(document.getElementById("cuotas").value);
        const tipoCredito = document.getElementById("tipoCredito").value;
        
        // Validar que los valores sean numéricos
        if (isNaN(capital) || isNaN(numCuotas) || capital <= 0 || numCuotas <= 0) {
            alert("Por favor ingrese valores válidos");
            return;
        }
        
        // Calcular la cuota mensual
        const cuotaMensual = calcularCuotaMensual(capital, numCuotas, tipoCredito);
        
        // Mostrar el resumen
        mostrarResumen(capital, numCuotas, tipoCredito, cuotaMensual);
        
        // Mostrar resultados y ocultar formulario
        resultados.classList.remove("hidden");
        formSimulador.style.display = "none";
    });
    
    // Evento para volver a simular
    btnVolver.addEventListener("click", function() {
        // Ocultar resultados y mostrar formulario
        resultados.classList.add("hidden");
        formSimulador.style.display = "flex";
    });
    
    // Función para calcular la cuota mensual
    function calcularCuotaMensual(capital, numCuotas, tipoCredito) {
        // Establecer tasas según el tipo de crédito
        let tasaInteres, tasaMensual;
        if (tipoCredito === "ahorros") {
            tasaInteres = 0.01; // 1% mensual para ahorros
            tasaMensual = 0.0126; // 1.26% para pago mensual
        } else {
            tasaInteres = 0.013; // 1.3% mensual para deudor solidario
            tasaMensual = 0.0156; // 1.56% para pago mensual
        }
        
        // Constantes para los seguros
        const tasaSeguroDeuda = 0.00055; // 0.055%
        const tasaFondoGarantias = 0.002; // 0.002%
        
        // Calcular componentes de la cuota para el primer mes
        const interes = capital * tasaInteres;
        const seguroDeuda = capital * tasaSeguroDeuda;
        const fondoGarantias = capital * tasaFondoGarantias;
        
        // Calcular cuota mensual (fórmula PAGO de Excel)
        const cuotaPrincipal = calcularPago(tasaMensual, numCuotas, -capital, 0, 0);
        
        // La cuota total incluye el seguro y fondo de garantías
        const cuotaTotal = cuotaPrincipal;
        
        return cuotaTotal;
    }
    
    // Función para calcular la cuota mensual (equivalente a PAGO en Excel)
    function calcularPago(tasa, nper, va, vf = 0, tipo = 0) {
        if (tasa === 0) return -va / nper;
        
        const pvif = Math.pow(1 + tasa, nper);
        let pmt = tasa / (pvif - 1) * -(va * pvif + vf);
        
        if (tipo === 1) {
            pmt = pmt / (1 + tasa);
        }
        
        return pmt;
    }
    
    // Función para mostrar el resumen
    function mostrarResumen(capital, numCuotas, tipoCredito, cuotaMensual) {
        const tipoTexto = (tipoCredito === "ahorros") ? 
            "sobre los ahorros y aportes" : 
            "con deudor solidario";
        
        resumenCredito.textContent = `Para un crédito de ${formatCurrency(capital)} a ${numCuotas} meses (${tipoTexto}):`;
        valorCuota.textContent = `Su cuota mensual sería de ${formatCurrency(cuotaMensual)}`;
    }
    
    // Función para formatear moneda
    function formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    }
});