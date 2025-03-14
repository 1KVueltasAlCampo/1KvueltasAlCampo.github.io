document.addEventListener("contentLoaded", function() {
    // Elementos del DOM
    const formSimulador = document.getElementById("formSimulador");
    const resultados = document.getElementById("resultados");
    const tablaBody = document.getElementById("tablaBody");
    const btnVolver = document.getElementById("btnVolver");
    
    // Evento para simular crédito
    formSimulador.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Obtener los valores del formulario
        const capital = parseFloat(document.getElementById("capital").value);
        const numCuotas = parseInt(document.getElementById("cuotas").value);
        const tipoCredito = document.getElementById("tipoCredito").value;
        
        // Generar la tabla de amortización
        generarTablaAmortizacion(capital, numCuotas, tipoCredito);
        
        // Mostrar resultados y ocultar formulario
        resultados.classList.remove("hidden");
        formSimulador.style.display = "none";
    });
    
    // Evento para volver a simular
    btnVolver.addEventListener("click", function() {
        // Ocultar resultados y mostrar formulario
        resultados.classList.add("hidden");
        formSimulador.style.display = "flex";
        
        // Limpiar tabla
        tablaBody.innerHTML = "";
    });
    
    // Función principal para generar tabla de amortización
    function generarTablaAmortizacion(capital, numCuotas, tipoCredito) {
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
        
        // Limpiar tabla anterior
        tablaBody.innerHTML = "";
        
        // Generar la fila inicial con saldo capital
        let filaInicial = document.createElement("tr");
        filaInicial.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>${formatCurrency(capital)}</td>
        `;
        tablaBody.appendChild(filaInicial);
        
        // Variables para el cálculo de la tabla
        let saldoCapital = capital;
        let fechaActual = new Date();
        
        // Calcular cuota mensual (fórmula PAGO de Excel)
        const cuotaMensual = calcularPago(tasaMensual, numCuotas, -capital, 0, 0);
        
        // Generar tabla de amortización
        for (let i = 1; i <= numCuotas; i++) {
            // Calcular fecha de vencimiento (día 30 del mes siguiente)
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            const fechaVencimiento = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 30);
            
            // Calcular componentes de la cuota
            const interes = saldoCapital * tasaInteres;
            const seguroDeuda = saldoCapital * tasaSeguroDeuda;
            const fondoGarantias = saldoCapital * tasaFondoGarantias;
            const abonoCapital = cuotaMensual - interes - seguroDeuda - fondoGarantias;
            
            // Actualizar saldo capital
            saldoCapital = saldoCapital - abonoCapital;
            if (Math.abs(saldoCapital) < 0.01) saldoCapital = 0; // Ajuste para último mes
            
            // Crear fila en la tabla
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i}</td>
                <td>${formatDate(fechaVencimiento)}</td>
                <td>${formatCurrency(cuotaMensual)}</td>
                <td>${formatCurrency(interes)}</td>
                <td>${formatCurrency(seguroDeuda)}</td>
                <td>${formatCurrency(fondoGarantias)}</td>
                <td>${formatCurrency(abonoCapital)}</td>
                <td>${formatCurrency(saldoCapital)}</td>
            `;
            tablaBody.appendChild(fila);
        }
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
    
    // Función para formatear moneda
    function formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    }
    
    // Función para formatear fecha
    function formatDate(date) {
        return new Intl.DateTimeFormat('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }
});