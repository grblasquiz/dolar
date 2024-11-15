// Datos de los precios del dólar directamente en JavaScript
const data = [
    { TipoDolar: "Dólar Oficial", Ene: 847.11, Feb: 869.00, Mar: 890.78, Abr: 912.56, May: 934.34, Jun: 956.12, Jul: 977.90, Ago: 999.68, Sep: 1021.46, Oct: 1043.24 },
    { TipoDolar: "Dólar Mep", Ene: 869.00, Feb: 890.78, Mar: 912.56, Abr: 934.34, May: 956.12, Jun: 977.90, Jul: 999.68, Ago: 1021.46, Sep: 1043.24, Oct: 1065.02 },
    { TipoDolar: "Dólar CCL", Ene: 1049.17, Feb: 1140.53, Mar: 1200.75, Abr: 1273.87, May: 1306.38, Jun: 1332.64, Jul: 1412.48, Ago: 1428.72, Sep: 1394.29, Oct: 1245.99 },
    { TipoDolar: "Dólar Tarjeta", Ene: 1401.04, Feb: 1421.92, Mar: 1442.80, Abr: 1463.68, May: 1484.57, Jun: 1505.44, Jul: 1527.32, Ago: 1547.20, Sep: 1568.08, Oct: 1588.96 },
    { TipoDolar: "Dólar Blue", Ene: 1005.00, Feb: 1040.00, Mar: 1015.00, Abr: 1040.00, May: 1225.00, Jun: 1180.00, Jul: 1500.00, Ago: 1230.00, Sep: 1165.00, Oct: 1555.00 }
];

// Colores específicos para cada tipo de dólar
const colors = {
    "Dólar Oficial": "rgba(75, 192, 192, 0.8)",
    "Dólar Mep": "rgba(54, 162, 235, 0.8)",
    "Dólar CCL": "rgba(255, 99, 132, 0.8)",
    "Dólar Tarjeta": "rgba(255, 159, 64, 0.8)",
    "Dólar Blue": "rgba(153, 102, 255, 0.8)"
};

// Referencias a las listas en el DOM
const aumentoAnualList = document.getElementById("aumento-anual");
const aumentoMensualList = document.getElementById("aumento-mensual");
const promedioCrecimientoList = document.getElementById("promedio-crecimiento");
const monthFilter = document.getElementById("month-filter");
const selectAllCheckbox = document.getElementById("select-all");

// Inicializar variables de meses seleccionados y gráfico
let selectedMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];
let dolarChart;

// Función para mostrar los aumentos y el promedio de crecimiento
function mostrarDatos() {
    aumentoAnualList.innerHTML = "";
    aumentoMensualList.innerHTML = "";
    promedioCrecimientoList.innerHTML = "";

    data.forEach((d) => {
        // Calcular aumento anual y mensual
        const aumentoAnual = (((d.Oct - d.Ene) / d.Ene) * 100).toFixed(2);
        const aumentoMensual = (((d.Oct - d.Sep) / d.Sep) * 100).toFixed(2);

        // Calcular promedio de crecimiento mensual
        const valores = Object.values(d).slice(1); // Excluir el primer elemento (TipoDolar)
        let promedioCrecimiento = 0;

        for (let i = 1; i < valores.length; i++) {
            promedioCrecimiento += ((valores[i] - valores[i - 1]) / valores[i - 1]) * 100;
        }
        promedioCrecimiento = (promedioCrecimiento / (valores.length - 1)).toFixed(2);

        // Crear elementos de lista con colores para cada tipo de dato
        const itemAnual = document.createElement("li");
        itemAnual.innerHTML = `<span style="color:${colors[d.TipoDolar]}">${d.TipoDolar}</span>: ${aumentoAnual}%`;
        aumentoAnualList.appendChild(itemAnual);

        const itemMensual = document.createElement("li");
        itemMensual.innerHTML = `<span style="color:${colors[d.TipoDolar]}">${d.TipoDolar}</span>: ${aumentoMensual}%`;
        aumentoMensualList.appendChild(itemMensual);

        const itemPromedio = document.createElement("li");
        itemPromedio.innerHTML = `<span style="color:${colors[d.TipoDolar]}">${d.TipoDolar}</span>: ${promedioCrecimiento}%`;
        promedioCrecimientoList.appendChild(itemPromedio);
    });
}

// Función para crear o actualizar el gráfico
function crearGrafico() {
    const ctx = document.getElementById("dolarChart").getContext("2d");

    // Destruir el gráfico anterior si existe
    if (dolarChart) {
        dolarChart.destroy();
    }

    // Filtrar los datos de los meses seleccionados para el gráfico
    const datasets = data.map(d => ({
        label: d.TipoDolar,
        data: selectedMonths.map(mes => d[mes]),
        borderColor: colors[d.TipoDolar],
        fill: false,
        borderWidth: 2,
        pointBackgroundColor: colors[d.TipoDolar],
        tension: 0.3
    }));

    // Crear el gráfico
    dolarChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: selectedMonths,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Evolución de los Precios del Dólar por Mes en 2024"
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Precio en Pesos"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Meses"
                    }
                }
            }
        }
    });
}

// Función para actualizar los meses seleccionados y el gráfico
function actualizarMesesSeleccionados() {
    selectedMonths = Array.from(monthFilter.querySelectorAll("input[type='checkbox']:checked"))
        .filter(input => input.value !== "")
        .map(input => input.value);

    if (selectedMonths.length === 0) {
        selectedMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.checked = selectedMonths.length === 10;
    }

    crearGrafico();
}

// Evento para el checkbox "Seleccionar Todo"
selectAllCheckbox.addEventListener("change", (e) => {
    const checked = e.target.checked;
    monthFilter.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = checked;
    });
    selectedMonths = checked ? ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"] : [];
    crearGrafico();
});

// Evento para cada checkbox de mes
monthFilter.querySelectorAll("input[type='checkbox']:not(#select-all)").forEach((checkbox) => {
    checkbox.addEventListener("change", actualizarMesesSeleccionados);
});

// Función para convertir entre pesos y un tipo de dólar seleccionado usando el precio del último mes
function convertir() {
    const monto = parseFloat(document.getElementById("monto").value);
    const tipoDolar = document.getElementById("tipo-dolar").value;
    const resultadoConversion = document.getElementById("resultado-conversion");

    // Verificar si el monto es un número válido
    if (isNaN(monto) || monto <= 0) {
        resultadoConversion.textContent = "Por favor, ingrese un monto válido.";
        return;
    }

    // Obtener la dirección de conversión seleccionada
    const conversionDirection = document.querySelector("input[name='conversion-direction']:checked").value;

    // Encontrar el valor del dólar seleccionado en el último mes (octubre)
    const dolarData = data.find(d => d.TipoDolar === tipoDolar);
    const dolarValue = dolarData ? dolarData.Oct : null;

    if (dolarValue) {
        let conversion;

        // Realizar la conversión en función de la dirección seleccionada
        if (conversionDirection === "pesos-a-dolares") {
            conversion = (monto / dolarValue).toFixed(2);
            resultado
            conversion = (monto / dolarValue).toFixed(2);
            resultadoConversion.textContent = `El monto de $${monto} equivale a ${conversion} ${tipoDolar}.`;
        } else if (conversionDirection === "dolares-a-pesos") {
            conversion = (monto * dolarValue).toFixed(2);
            resultadoConversion.textContent = `El monto de ${monto} ${tipoDolar} equivale a $${conversion}.`;
        }
    } else {
        resultadoConversion.textContent = "Tipo de dólar no encontrado.";
    }
}

// Ejecutar las funciones iniciales al cargar la página
mostrarDatos();
crearGrafico();
