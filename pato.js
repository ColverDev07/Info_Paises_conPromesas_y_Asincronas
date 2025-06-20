const btnBuscar = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");

// Función para obtener datos del país
function obtenerDatosPais(nombrePais) {
  return fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(nombrePais)}?fullText=true`)
    .then(res => {
      if (!res.ok) throw new Error("País no encontrado");
      return res.json();
    });
}

// Obtener nombre del país
function obtenerNombre(data) {
  return new Promise(resolve => resolve(data.name.common));
}

// Obtener capital
function obtenerCapital(data) {
  return new Promise(resolve => resolve(data.capital?.[0] || "No tiene"));
}

// Obtener población
function obtenerPoblacion(data) {
  return new Promise(resolve => resolve(data.population.toLocaleString()));
}

// Obtener idioma principal
function obtenerIdioma(data) {
  return new Promise(resolve => {
    const idiomas = data.languages ? Object.values(data.languages) : ["No disponible"];
    resolve(idiomas[0]);
  });
}

// Obtener moneda (nombre y símbolo)
function obtenerMoneda(data) {
  return new Promise(resolve => {
    const monedas = data.currencies;
    if (monedas) {
      const [clave] = Object.keys(monedas);
      const { name, symbol } = monedas[clave];
      resolve(`${name} (${symbol})`);
    } else {
      resolve("No disponible");
    }
  });
}

// Obtener zona horaria principal
function obtenerZonaHoraria(data) {
  return new Promise(resolve => resolve(data.timezones?.[0] || "No disponible"));
}

// Obtener continente
function obtenerContinente(data) {
  return new Promise(resolve => resolve(data.continents?.[0] || "No disponible"));
}

// Obtener bandera
function obtenerBandera(data) {
  return new Promise(resolve => resolve(data.flags?.png || ""));
}

// Acción al hacer clic
btnBuscar.addEventListener("click", () => {
  const pais = document.getElementById("pais").value.trim();
  resultado.innerHTML = "⏳ Buscando...";

  if (!pais) {
    resultado.innerHTML = "⚠️ Por favor escribe un país.";
    return;
  }

  obtenerDatosPais(pais)
    .then(res => {
      const data = res[0]; // solo primer resultado
      return Promise.all([
        obtenerNombre(data),
        obtenerCapital(data),
        obtenerPoblacion(data),
        obtenerIdioma(data),
        obtenerMoneda(data),
        obtenerZonaHoraria(data),
        obtenerContinente(data),
        obtenerBandera(data)
      ]);
    })
    .then(([nombre, capital, poblacion, idioma, moneda, zonaHoraria, continente, bandera]) => {
      resultado.innerHTML = `
        <h3>🌍 ${nombre}</h3>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Población:</strong> ${poblacion}</p>
        <p><strong>Idioma:</strong> ${idioma}</p>
        <p><strong>Moneda:</strong> ${moneda}</p>
        <p><strong>Continente:</strong> ${continente}</p>
        <p><strong>Zona Horaria:</strong> ${zonaHoraria}</p>
        <img src="${bandera}" alt="Bandera de ${nombre}">
      `;
    })
    .catch(err => {
      resultado.innerHTML = `❌ Error: ${err.message}`;
    });
});