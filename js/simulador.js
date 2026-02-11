document.addEventListener("pageLoaded", function (e) {
    if (e.detail === "simulador_credito") {
        initSimulador();
    }
});

function initSimulador() {
    const form = document.getElementById("formSimulador");
    const resultados = document.getElementById("resultados");
    const btnVolver = document.getElementById("btnVolver");
    const inputCapital = document.getElementById("capital");

    if (!form) return;

    // Formateo de moneda en vivo
    inputCapital.addEventListener('input', function(e) {
        let value = this.value.replace(/[^\d]/g, '');
        if (value === '') {
            this.value = '';
            return;
        }
        this.value = '$ ' + new Intl.NumberFormat('es-CO').format(parseInt(value));
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const capitalRaw = inputCapital.value.replace(/[^\d]/g, '');
        const capital = parseFloat(capitalRaw);
        const cuotas = parseInt(document.getElementById("cuotas").value);
        const tipo = document.getElementById("tipoCredito").value;

        if (isNaN(capital) || isNaN(cuotas) || capital <= 0) {
            alert("Por favor revise los valores ingresados.");
            return;
        }

        // Lógica de Negocio (Tasas)
        // Nota: En un entorno real, estas tasas deberían venir de una API/BD
        let tasaInteres = (tipo === "ahorros") ? 0.01 : 0.013;
        const seguro = 0.00055; 
        
        // Cálculo simplificado PMT
        const tasaTotal = tasaInteres + seguro;
        const cuota = (capital * tasaTotal) / (1 - Math.pow(1 + tasaTotal, -cuotas));

        // Renderizado
        document.getElementById("resumenCredito").innerHTML = `
            Crédito de <strong>${formatMoney(capital)}</strong> a <strong>${cuotas} meses</strong>.<br>
            Modalidad: ${tipo === 'ahorros' ? 'Sobre Ahorros' : 'Con Deudor'}
        `;
        document.getElementById("valorCuota").textContent = `Cuota Aprox: ${formatMoney(cuota)}`;

        resultados.classList.remove("hidden");
        form.style.display = "none";
    });

    btnVolver.addEventListener("click", function() {
        resultados.classList.add("hidden");
        form.style.display = "flex";
        form.reset();
    });
}

function formatMoney(amount) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}