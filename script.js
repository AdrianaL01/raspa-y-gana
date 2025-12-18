const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const premio = document.querySelector(".premio");
const mensaje = document.getElementById("mensaje");

// Sonidos
const sonidoRaspar = new Audio("scratch.mp3");
sonidoRaspar.loop = true;
sonidoRaspar.volume = 0.4;

const sonidoGanar = new Audio("win.mp3");
sonidoGanar.volume = 0.7;

let audioHabilitado = false;

function habilitarAudio() {
  if (audioHabilitado) return;

  sonidoRaspar.play().then(() => {
    sonidoRaspar.pause();
    sonidoRaspar.currentTime = 0;
    audioHabilitado = true;
  }).catch(() => {});
}


// Estados
let raspando = false;
let terminado = false;
let premioRevelado = false;
let puntosRaspado = 0;

// 👉 BLOQUEO POR USO PREVIO
if (localStorage.getItem("raspa_gana_usado")) {
  canvas.style.display = "none";
  mensaje.style.display = "block";
  mensaje.innerText = "🎟️ Este bono ya fue revelado";
  terminado = true;
}

// Ajustar canvas al tamaño de la imagen
premio.onload = () => {
  canvas.width = premio.offsetWidth;
  canvas.height = premio.offsetHeight;

  if (terminado) return;

  const capa = new Image();
  capa.src = "raspable1.png";
  capa.onload = () => {
    ctx.drawImage(capa, 0, 0, canvas.width, canvas.height);
  };
};

// Función para raspar
function raspar(x, y) {
  if (terminado) return;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();

  if (!premioRevelado) {
    puntosRaspado += 10;
    if (puntosRaspado > 300) revelarPremio();
  }
}

// Mouse
canvas.addEventListener("mousedown", () => {
  if (terminado) return;
  habilitarAudio();
  raspando = true;
  sonidoRaspar.play();
});


canvas.addEventListener("mouseup", () => {
  raspando = false;
  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;
});

canvas.addEventListener("mousemove", (e) => {
  if (!raspando) return;
  const rect = canvas.getBoundingClientRect();
  raspar(e.clientX - rect.left, e.clientY - rect.top);
});

// Touch
canvas.addEventListener("touchstart", () => {
  if (terminado) return;
  habilitarAudio();
  raspando = true;
  sonidoRaspar.play();
});


canvas.addEventListener("touchend", () => {
  raspando = false;
  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;
});

canvas.addEventListener("touchmove", (e) => {
  if (!raspando) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  raspar(touch.clientX - rect.left, touch.clientY - rect.top);
});

// Revelar premio
function revelarPremio() {
  premioRevelado = true;

  if (audioHabilitado) {
  sonidoGanar.play();
}

  mensaje.style.display = "block";

  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }

  // Guardar que ya se usó
  localStorage.setItem("raspa_gana_usado", "true");

  // Bloquear definitivamente después de 2s
  setTimeout(() => {
    terminado = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 2000);
}
