// elementos del html
const selectTipo = document.getElementById("tipo");
const inputValor = document.getElementById("valor");
const btnConvertir = document.getElementById("btnConvertir");
const btnLimpiar = document.getElementById("btnLimpiar");
const resultado = document.getElementById("resultado");
const divHistorial = document.getElementById("historial");
const contador = document.getElementById("contador");

// nombres de las unidades de cada tipo
const unidades = {
  longitud: { base: "metros", destino: "pies" },
  peso: { base: "kilogramos", destino: "libras" },
  temperatura: { base: "celsius", destino: "fahrenheit" }
};

// leemos lo guardado, si no hay nada empieza vacio
let historial = JSON.parse(localStorage.getItem("historial")) || [];

// guarda el historial en localStorage
function guardar() {
  localStorage.setItem("historial", JSON.stringify(historial));
}

// hace la cuenta segun el tipo y la direccion
// ida: de base a destino, vuelta: de destino a base
// longitud: metros <-> pies, peso: kg <-> lb, temperatura: celsius <-> fahrenheit
// formulas: pies = metros * 3.28084, libras = kg * 2.20462, fahrenheit = celsius * 9/5 + 32
// formulas inversas: metros = pies / 3.28084, kg = libras / 2.20462, celsius = (fahrenheit - 32) * 5/9
function convertir(tipo, valor, direccion) {
  if (tipo === "longitud") {
    return direccion === "ida" ? valor * 3.28084 : valor / 3.28084;
  } else if (tipo === "peso") {
    return direccion === "ida" ? valor * 2.20462 : valor / 2.20462;
  } else {
    return direccion === "ida" ? valor * 9 / 5 + 32 : (valor - 32) * 5 / 9;
  }
}

// pinta las tarjetas del historial y el contador
function mostrarHistorial() {
  divHistorial.innerHTML = "";
  contador.textContent = historial.length + " conversiones";

  for (const item of historial) {
    divHistorial.innerHTML += `
      <div class="item">
        <p>${item.texto}</p>
        <p class="fecha">${item.fecha}</p>
        <button onclick="eliminar(${item.id})">Eliminar</button>
      </div>`;
  }
}

// borra una sola conversion
function eliminar(id) {
  historial = historial.filter(item => item.id !== id);
  guardar();
  mostrarHistorial();
}

// boton convertir
btnConvertir.addEventListener("click", () => {
  const tipo = selectTipo.value;
  const direccion = document.querySelector("input[name='direccion']:checked").value;

  if (inputValor.value.trim() === "") {
    resultado.textContent = "Escribe un numero";
    return;
  }

  const valor = Number(inputValor.value);

  // si la direccion es al reves, cambiamos las unidades de lugar
  let entrada = unidades[tipo].base;
  let salida = unidades[tipo].destino;
  if (direccion === "vuelta") {
    entrada = unidades[tipo].destino;
    salida = unidades[tipo].base;
  }

  const total = convertir(tipo, valor, direccion);
  const texto = `${valor} ${entrada} = ${total.toFixed(2)} ${salida}`;
  resultado.textContent = texto;

  // agregamos la conversion al inicio de la lista
  historial.unshift({
    id: Date.now(),
    texto: texto,
    fecha: new Date().toLocaleString()
  });

  guardar();
  mostrarHistorial();
  inputValor.value = "";
});

// boton limpiar historial
btnLimpiar.addEventListener("click", () => {
  if (confirm("Seguro que quieres borrar todo el historial?")) {
    historial = [];
    guardar();
    mostrarHistorial();
  }
});

// al abrir la pagina mostramos lo que ya estaba guardado
mostrarHistorial();
