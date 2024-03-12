document.addEventListener("DOMContentLoaded", async () => {
    const mostrarButton = document.getElementById('mostrarCiudadanosButton');
    mostrarButton.addEventListener('click', mostrarListadoCiudadanos);
});

const listaCiudadanos = [];

const loadCiudadanos = async () => {
    try {
        listaCiudadanos.length = 0;
        const respuesta = await fetch('http://localhost:3000/ciudadanos');

        if (!respuesta.ok) {
            throw new Error('Error al cargar Ciudadanos. Estado: ' + respuesta.status);
        }
        const Ciudadanos = await respuesta.json();
        listaCiudadanos.push(...Ciudadanos);
    } catch (error) {
        console.error("Error al cargar Ciudadanos", error.message);
    }
}

const mostrarListadoCiudadanos = async () => {
    await loadCiudadanos();
    const listadoCiudadanos = document.getElementById('todosCiudadanos');
    listadoCiudadanos.innerHTML = "";

    const ul = document.createElement('ul');
    for (const ciudadano of listaCiudadanos) {
        const li = document.createElement('li');
        li.textContent = `Nombre Completo: ${ciudadano.nombre_completo}, Dirección: ${ciudadano.direccion}, Celular: ${ciudadano.celular}, ADN: ${ciudadano.codigo_adn}, Código: ${ciudadano.id}`;
        ul.appendChild(li);
    }
    listadoCiudadanos.appendChild(ul);

    const volverButton = document.createElement('button');
    volverButton.textContent = 'Volver al listado';
    volverButton.addEventListener('click', volverAlFormularioCiudadanos);
    listadoCiudadanos.appendChild(volverButton);
}

const volverAlFormularioCiudadanos = () => {
    const ciudadanosForm = document.getElementById('ciudadanos-form');
    const listadoCiudadanos = document.getElementById('todosCiudadanos');

    ciudadanosForm.style.display = "block";
    listadoCiudadanos.style.display = "none";
}

const crearCiudadano = async () => {
    const inputNombreCiudadano = document.getElementById("nombreCiudadano");
    const inputDireccion = document.getElementById("direccion");
    const inputCelular = document.getElementById("celular");
    const inputAdn = document.getElementById("adn");
    const inputId = document.getElementById("id");

    const nombreCiudadano = inputNombreCiudadano.value;
    const direccion = inputDireccion.value;
    const celular = inputCelular.value;
    const adn = inputAdn.value;
    const id = inputId.value;

    const newCiudadano = {
        nombre_completo: nombreCiudadano,
        direccion: direccion,
        celular: celular,
        codigo_adn: adn,
        id: id,
    }

    await guardarCiudadanoJson(newCiudadano);
    await loadCiudadanos();

    inputNombreCiudadano.value = "";
    inputDireccion.value = "";
    inputCelular.value = "";
    inputAdn.value = "";
    inputId.value = "";

    alert("Creación del nuevo ciudadano exitosa.");
    return newCiudadano;
}

const guardarCiudadanoJson = async (newCiudadano) => {
    try {
        const respuesta = await fetch('http://localhost:3000/ciudadanos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCiudadano),
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar el ciudadano. Estado: ' + respuesta.status);
        }
        const ciudadanoCreado = await respuesta.json();

        console.log('Ciudadano registrado:', ciudadanoCreado);
    } catch (error) {
        console.log("Error al cargar Ciudadanos", error.message);
    }
}

const cargarFormularioCiudadanos = async () => {
    const ciudadanosForm = document.getElementById('ciudadanos-form');
    ciudadanosForm.innerHTML =
        `<form>
            <label for="nombreCiudadano"><br>Nombre completo:</br></label>
            <input type="text" id="nombreCiudadano" required>

            <label for="direccion"><br>Dirección:</br></label>
            <input type="text" id="direccion" required>

            <label for="celular"><br>Celular:</br></label>
            <input type="number" id="celular" required>

            <label for="adn"><br>ADN:</br></label>
            <input type="text" id="adn" required>

            <label for="id"><br>ID:</br></label>
            <input type="number" id="id" required>

            <button type="button" onclick="crearCiudadano()">Agregar Ciudadano</button>
        </form>`;

    const mostrarButton = document.createElement('button');
    mostrarButton.textContent = 'Mostrar Ciudadanos';
    mostrarButton.id = 'mostrarCiudadanosButton';
    ciudadanosForm.appendChild(mostrarButton);
}

cargarFormularioCiudadanos();
