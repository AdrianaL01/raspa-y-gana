const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const premio = document.querySelector(".premio");
const mensaje = document.getElementById("mensaje");
const inicioAudio = document.getElementById("inicioAudio");

// Evitar scroll en móvil
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
}, { passive: false });

// 🔊 Sonidos
const sonidoRaspar = new Audio("scratch.mp3");
sonidoRaspar.loop = true;
sonidoRaspar.volume = 0.4;

const sonidoGanar = new Audio("win.mp3");
sonidoGanar.volume = 0.7;

// Estados
let audioHabilitado = false;
let raspando = false;
let terminado = false;
let puntosRaspado = 0;
let premioRevelado = false;

// 🔓 Desbloqueo de audio (NO raspa, NO suma puntos)
function desbloquearAudio() {
  if (audioHabilitado) return;

  sonidoRaspar.play().then(() => {
    sonidoRaspar.pause();
    sonidoRaspar.currentTime = 0;
    audioHabilitado = true;
    inicioAudio.style.display = "none";
  }).catch(() => {});
}

inicioAudio.addEventListener("click", desbloquearAudio);
inicioAudio.addEventListener("touchstart", desbloquearAudio);

// Bloqueo si ya se usó
if (localStorage.getItem("raspa_gana_usado")) {
  canvas.style.display = "none";
  mensaje.style.display = "flex";
  mensaje.innerText = "🎟️ Este bono ya fue revelado";
  terminado = true;
}

// Ajustar canvas
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

// 🎨 Raspar
function raspar(x, y) {
  if (terminado || premioRevelado) return;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();

  puntosRaspado++;

  // 👇 UMBRAL REALISTA (no se dispara con 1 toque)
  if (puntosRaspado > 140) {
    revelarPremio();
  }
}

// 🖱️ Mouse
canvas.addEventListener("mousedown", () => {
  if (!audioHabilitado || terminado) return;
  raspando = true;
  sonidoRaspar.currentTime = 0;
  sonidoRaspar.play();
});

canvas.addEventListener("mouseup", () => {
  raspando = false;
  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;
});

canvas.addEventListener("mousemove", e => {
  if (!raspando) return;
  const rect = canvas.getBoundingClientRect();
  raspar(e.clientX - rect.left, e.clientY - rect.top);
});

// 📱 Touch
canvas.addEventListener("touchstart", () => {
  if (!audioHabilitado || terminado) return;
  raspando = true;
  sonidoRaspar.currentTime = 0;
  sonidoRaspar.play();
});

canvas.addEventListener("touchend", () => {
  raspando = false;
  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;
});

canvas.addEventListener("touchmove", e => {
  if (!raspando) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  raspar(touch.clientX - rect.left, touch.clientY - rect.top);
});

// 🎉 Revelar premio (SOLO AQUÍ SUENA WIN)
function revelarPremio() {
  if (premioRevelado) return;
  premioRevelado = true;
  terminado = true;

  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;

  if (audioHabilitado) {
    sonidoGanar.currentTime = 0;
    sonidoGanar.play();
  }

  mensaje.style.display = "flex";
  localStorage.setItem("raspa_gana_usado", "true");

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 400);
}
