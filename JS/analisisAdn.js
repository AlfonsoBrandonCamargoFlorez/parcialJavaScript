// 01110001110001100111

document.addEventListener("DOMContentLoaded", async () => {
    const analizarButton = document.getElementById('analizarButton');
    analizarButton.addEventListener('click', analizarADN);
});

const analizarADN = async () => {
    const inputADN = document.getElementById("numero");
    const codigoADN = inputADN.value.trim();

    const dbData = await obtenerDatosDB();
    const ciudadanosCompatibles = buscarCiudadanosCompatibles(dbData, codigoADN);

    mostrarCiudadanosCompatibles(ciudadanosCompatibles, codigoADN);
}

const obtenerDatosDB = async () => {
    try {
        const respuesta = await fetch('http://localhost:3000/ciudadanos');

        if (!respuesta.ok) {
            throw new Error('Error al cargar los datos. Estado: ' + respuesta.status);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al cargar los datos", error.message);
        return [];
    }
}

const buscarCiudadanosCompatibles = (ciudadanos, codigoADN) => {
    return ciudadanos.map(ciudadano => {
        const porcentaje = calcularPorcentajeCompatibilidad(ciudadano.codigo_adn, codigoADN);
        return { ciudadano, porcentaje };
    }).sort((a, b) => b.porcentaje - a.porcentaje).slice(0, 5);
}

const calcularPorcentajeCompatibilidad = (codigoADN1, codigoADN2) => {
    const coinc = codigoADN1.length;
    let coincidencias = 0;

    for (let i = 0; i < coinc; i++) {
        if (codigoADN1[i] === codigoADN2[i]) {
            coincidencias++;
        }
    }

    return (coincidencias / coinc) * 100;
}

const mostrarCiudadanosCompatibles = (ciudadanos, codigoADN) => {
    const listadoCiudadanosCompatibles = document.getElementById('ciudadanosCompatibles');
    listadoCiudadanosCompatibles.innerHTML = "";

    const ul = document.createElement('ul');
    for (const { ciudadano, porcentaje } of ciudadanos) {
        const li = document.createElement('li');
        li.textContent = `Nombre: ${ciudadano.nombre_completo}, Compatibilidad del: ${porcentaje.toFixed(2)}%`;
        ul.appendChild(li);
    }
    listadoCiudadanosCompatibles.appendChild(ul);
}
