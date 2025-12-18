const form = document.getElementById("formCodigo");
const nombreInput = document.getElementById("nombre");
const codigoInput = document.getElementById("codigo");
const error = document.getElementById("error");

// Lista de códigos válidos (5K)
let codigos5k = [
  "5K-A7F3","5K-B92Q","5K-LM8X","5K-Q3RZ","5K-W4P7",
  "5K-X9V2","5K-T5J8","5K-KL3P","5K-Z7N1","5K-V8M4",
  "5K-R6C9","5K-F2B5","5K-P3D8","5K-N9H1","5K-S4Q6",
  "5K-J8K2","5K-M5L7","5K-H2G9","5K-D7T3","5K-C9R6"
];

// Si quieres, puedes guardar en localStorage para bloquear reingresos
let codigosUsados = JSON.parse(localStorage.getItem("codigosUsados")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const codigo = codigoInput.value.trim().toUpperCase();

  // Validaciones
  if (!nombre || !codigo) {
    error.textContent = "Completa ambos campos";
    return;
  }

  if (!codigos5k.includes(codigo)) {
    error.textContent = "Código inválido";
    return;
  }

  if (codigosUsados.includes(codigo)) {
    error.textContent = "Este código ya fue usado";
    return;
  }

  // ✅ Código válido
  codigosUsados.push(codigo);
  localStorage.setItem("codigosUsados", JSON.stringify(codigosUsados));

  // Guardar nombre también si quieres
  localStorage.setItem("nombreUsuario", nombre);

  // Redirigir a raspa-5k.html
  window.location.href = "raspa-5k.html";
});
