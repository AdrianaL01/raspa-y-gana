const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const premioImg = document.querySelector(".premio");
const mensaje = document.getElementById("mensaje");
const inicioAudio = document.getElementById("inicioAudio");

// Evitar scroll en móvil
canvas.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

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

// =====================================
// ✅ Validación de nombre y código
// =====================================
const params = new URLSearchParams(window.location.search);
const nombre = params.get('nombre');
const codigo = params.get('codigo');

const codigosValidos = [
  "ABC123","DEF456","GHI789","JKL012","MNO345",
  "PQR678","STU901","VWX234","YZA567","BCD890",
  "EFG123","HIJ456","KLM789","NOP012","QRS345",
  "TUV678","WXY901","ZAB234","CDE567","FGH890"
];

if (!nombre || !codigo || !codigosValidos.includes(codigo)) {
  alert("Nombre o código inválido 😢");
  window.location.href = "index.html";
}

// =====================================
// 🎟️ Premios 5K (20 en total)
const premios5kInicial = [
  ...Array(8).fill({nombre:"20%", imagen:"bono20.jpg"}),
  ...Array(2).fill({nombre:"2x1", imagen:"bono2x1.jpg"}),
  ...Array(10).fill({nombre:"nada", imagen:"bono0.jpg"})
];

// Elegir premio aleatorio (una sola vez)
const indexPremio = Math.floor(Math.random() * premios5kInicial.length);
const premioAsignado = premios5kInicial[indexPremio];
premioImg.src = premioAsignado.imagen;
premioImg.style.visibility = "hidden";

// =====================================
// 🔓 Desbloqueo de audio
function desbloquearAudio() {
  if (audioHabilitado) return;
  sonidoRaspar.play().then(()=>{
    sonidoRaspar.pause();
    sonidoRaspar.currentTime = 0;
    audioHabilitado = true;
    inicioAudio.style.display = "none";
  }).catch(()=>{});
}

inicioAudio.addEventListener("click", desbloquearAudio);
inicioAudio.addEventListener("touchstart", desbloquearAudio);

// Bloqueo si ya se usó
if (localStorage.getItem("raspa_gana_usado_"+codigo)) {
  canvas.style.display = "none";
  mensaje.style.display = "flex";
  mensaje.innerText = "🎟️ Este bono ya fue revelado";
  terminado = true;
}

// Ajustar canvas
premioImg.onload = () => {
  canvas.width = premioImg.offsetWidth;
  canvas.height = premioImg.offsetHeight;

  if (terminado) return;

  const capa = new Image();
  capa.src = "raspable1.png";
  capa.onload = () => {
    ctx.drawImage(capa, 0, 0, canvas.width, canvas.height);
    premioImg.style.visibility = "visible";
  };
};

// 🎨 Raspar
function raspar(x,y){
  if (terminado || premioRevelado) return;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x,y,22,0,Math.PI*2);
  ctx.fill();
  puntosRaspado++;
  if(puntosRaspado>90) revelarPremio();
}

// 🖱️ Mouse
canvas.addEventListener("mousedown",()=>{
  if(!audioHabilitado||terminado) return;
  raspando=true;
  sonidoRaspar.currentTime=0;
  sonidoRaspar.play();
});
canvas.addEventListener("mouseup",()=>{
  raspando=false;
  sonidoRaspar.pause();
  sonidoRaspar.currentTime=0;
});
canvas.addEventListener("mousemove", e=>{
  if(!raspando) return;
  const rect=canvas.getBoundingClientRect();
  raspar(e.clientX-rect.left,e.clientY-rect.top);
});

// 📱 Touch
canvas.addEventListener("touchstart",()=>{
  if(!audioHabilitado||terminado) return;
  raspando=true;
  sonidoRaspar.currentTime=0;
  sonidoRaspar.play();
});
canvas.addEventListener("touchend",()=>{
  raspando=false;
  sonidoRaspar.pause();
  sonidoRaspar.currentTime=0;
});
canvas.addEventListener("touchmove", e=>{
  if(!raspando) return;
  const rect=canvas.getBoundingClientRect();
  const touch=e.touches[0];
  raspar(touch.clientX-rect.left,touch.clientY-rect.top);
});

// 🎉 Revelar premio
function revelarPremio(){
  if(premioRevelado) return;
  premioRevelado=true;
  terminado=true;

  premioImg.src = premioAsignado.imagen;

  sonidoRaspar.pause();
  sonidoRaspar.currentTime=0;
  if(audioHabilitado){
    sonidoGanar.currentTime=0;
    sonidoGanar.play();
  }

  if(navigator.vibrate) navigator.vibrate([200,100,200]);

  localStorage.setItem("raspa_gana_usado_"+codigo,"true");

  setTimeout(()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); },400);
}
