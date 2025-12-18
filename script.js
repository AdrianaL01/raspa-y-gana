const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const premio = document.querySelector(".premio");
const mensaje = document.getElementById("mensaje");
const inicioAudio = document.getElementById("inicioAudio");

// 🔊 Sonidos
const sonidoRaspar = new Audio("scratch.mp3");
sonidoRaspar.loop = true;
sonidoRaspar.volume = 0.4;

const sonidoGanar = new Audio("win.mp3");
sonidoGanar.volume = 0.7;

let audioHabilitado = false;

// 👉 Desbloqueo de audio (OBLIGATORIO para celular)
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

// Estados
let raspando = false;
let terminado = false;
let premioRevelado = false;
let puntosRaspado = 0;

// 👉 BLOQUEO SI YA SE USÓ
if (localStorage.getItem("raspa_gana_usado")) {
  canvas.style.display = "none";
  mensaje.style.display = "block";
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
  if (terminado) return;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();

  if (!premioRevelado) {
    puntosRaspado++;
    if (puntosRaspado > 120) revelarPremio();
  }
}

// 🖱️ Mouse
canvas.addEventListener("mousedown", () => {
  if (terminado || !audioHabilitado) return;
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

// 📱 Touch
canvas.addEventListener("touchstart", (e) => {
  if (terminado || !audioHabilitado) return;
  raspando = true;
  sonidoRaspar.play();
});
