const form = document.getElementById("orderForm");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const photosInput = document.getElementById("photos");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusBox.className = "status";
  statusBox.textContent = "";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const description = document.getElementById("description").value.trim();
  const dimensions = document.getElementById("dimensions").value.trim();
  const color = document.getElementById("color").value.trim();
  const files = Array.from(photosInput.files || []);

  if (!name || !phone || !description) {
    statusBox.classList.add("err");
    statusBox.textContent = "El nombre, el teléfono y la descripción son obligatorios.";
    return;
  }
  if (files.length > 3 || files.some(file => !file.type.startsWith("image/")) ||
      files.some(file => file.size > 8 * 1024 * 1024)) {
    statusBox.classList.add("err");
    statusBox.textContent = "Revisa las fotos: máximo 3 imágenes y 8 MB por imagen.";
    return;
  }

  const message = [
    "🆕 NUEVO PEDIDO · 3DMATRIX OFICIAL",
    "",
    `Nombre: ${name}`,
    `Teléfono de contacto: ${phone}`,
    `Qué quiere fabricar: ${description}`,
    `Medidas: ${dimensions || "No indicadas"}`,
    `Color: ${color || "No indicado"}`,
    `Fotografías seleccionadas en la web: ${files.length}`,
    "",
    files.length ? "IMPORTANTE: adjunta también las fotografías seleccionadas en la web a este chat." : ""
  ].filter(Boolean).join("\n");

  // Número de destino en formato internacional, sin + ni espacios.
  const whatsappNumber = "34633298839";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  statusBox.classList.add("ok");
  statusBox.textContent = "Abriendo WhatsApp. Revisa el mensaje y pulsa Enviar para completar tu pedido.";
  window.location.href = whatsappUrl;
});

// Efecto nieve ligero
(() => {
  const canvas = document.getElementById("snow");
  const ctx = canvas.getContext("2d");
  let w, h, flakes = [];
  function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    w = window.innerWidth; h = window.innerHeight;
    flakes = Array.from({length: Math.min(90, Math.floor(w / 10))}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2 + .6, s: Math.random() * 1.1 + .35,
      drift: Math.random() * .7 - .35
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.75)";
    flakes.forEach(f => {
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      f.y += f.s; f.x += f.drift;
      if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
      if (f.x < -5) f.x = w + 5;
      if (f.x > w + 5) f.x = -5;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  resize(); draw();
})();


// Reproductor MP3 en bucle. Algunos navegadores bloquean el autoplay con sonido;
// el visitante puede iniciar la música con el botón.
(() => {
  const audio = document.getElementById("backgroundMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio || !toggle) return;
  const paint = () => {
    toggle.textContent = audio.paused ? "▶ MÚSICA" : "Ⅱ PAUSAR";
    toggle.setAttribute("aria-label", audio.paused ? "Reproducir música" : "Pausar música");
  };
  toggle.addEventListener("click", async () => {
    if (audio.paused) {
      try { await audio.play(); } catch (error) { console.warn("El navegador no permitió reproducir el audio.", error); }
    } else { audio.pause(); }
    paint();
  });
  audio.addEventListener("play", paint);
  audio.addEventListener("pause", paint);
  audio.play().then(paint).catch(() => paint());
})();
