// Rueda Libre - comportamiento de la pagina

// ---------- Animacion de entrada al hacer scroll ----------
const bloques = document.querySelectorAll(".aparecer");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("mostrar");
        observador.unobserve(entrada.target); // se anima una sola vez
      }
    });
  }, { threshold: 0.15 });

  bloques.forEach(function (bloque) {
    observador.observe(bloque);
  });
} else {
  bloques.forEach(function (bloque) {
    bloque.classList.add("mostrar");
  });
}

// ---------- Boton de volver arriba ----------
const botonArriba = document.querySelector(".arriba");

function revisarScroll() {
  botonArriba.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", revisarScroll, { passive: true });
revisarScroll();

// ---------- Cerrar el menu del celular al tocar un link ----------
const menu = document.getElementById("links");

document.querySelectorAll("#links .nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    if (menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

// ---------- Formulario ----------
const formulario = document.getElementById("formulario");
const fecha = document.getElementById("fecha");
const errorFecha = document.getElementById("fecha-error");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");

// la fecha minima es hoy (no se puede pedir turno para un dia que ya paso)
function hoyComoTexto() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

fecha.min = hoyComoTexto();

// los domingos el taller esta cerrado
function validarFecha() {
  fecha.setCustomValidity("");

  if (fecha.validity.valueMissing) {
    errorFecha.textContent = "Elegí qué día traés la bici.";
  } else if (fecha.validity.rangeUnderflow) {
    errorFecha.textContent = "Elegí un día desde hoy en adelante.";
  } else if (new Date(fecha.value + "T12:00").getDay() === 0) {
    fecha.setCustomValidity("domingo");
    errorFecha.textContent = "Los domingos estamos cerrados. Elegí de lunes a sábado.";
  }
}

fecha.addEventListener("input", validarFecha);

// contador de caracteres del mensaje
function actualizarContador() {
  contador.textContent = mensaje.value.length + "/" + mensaje.maxLength;
}

mensaje.addEventListener("input", actualizarContador);

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  validarFecha();

  if (!formulario.checkValidity()) {
    formulario.classList.add("was-validated");
    // llevo el foco al primer campo con error
    const primerError = formulario.querySelector(":invalid");
    if (primerError) {
      primerError.focus();
    }
    return;
  }

  // la pagina no tiene servidor: muestro la confirmacion en el modal
  const nombre = document.getElementById("nombre").value.trim().split(" ")[0];
  const dia = new Date(fecha.value + "T12:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  document.getElementById("modalTexto").textContent =
    "Gracias, " + nombre + ". Te esperamos el " + dia +
    ". Te vamos a escribir para confirmar el turno.";

  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalGracias")).show();

  formulario.reset();
  formulario.classList.remove("was-validated");
  actualizarContador();
});
