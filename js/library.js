(() => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const grid = $("#libraryGrid");
  if (!grid) return;

  // Fichas de ejemplo. Los textos y metadatos se pueden sustituir por respuestas de APIs.
  const resources = [
    {id:"book-alicia",category:"Lectura",icon:"🐇",tone:"read",type:"LIBRO · DOMINIO PÚBLICO",title:"Alicia en el país de las maravillas",author:"Lewis Carroll",duration:"Lectura por capítulos",level:"Lectura libre",description:"Acompaña a Alicia en un mundo fantástico. Ideal para recuperar el gusto por leer unos minutos cada día.",interests:["lectura"]},
    {id:"book-frankenstein",category:"Lectura",icon:"📖",tone:"read",type:"LIBRO · DOMINIO PÚBLICO",title:"Frankenstein",author:"Mary Shelley",duration:"Lectura por capítulos",level:"Lectura intermedia",description:"Una novela clásica para explorar preguntas sobre ciencia, responsabilidad y humanidad.",interests:["lectura"]},
    {id:"book-donquijote",category:"Lectura",icon:"📚",tone:"read",type:"LIBRO · DOMINIO PÚBLICO",title:"Don Quijote de la Mancha",author:"Miguel de Cervantes",duration:"Lectura por episodios",level:"Lectura intermedia",description:"Un clásico de aventuras, humor e imaginación que puedes leer poco a poco.",interests:["lectura"]},
    {id:"music-warmup",category:"Música",icon:"🎹",tone:"music",type:"GUÍA PRÁCTICA",title:"Calentamiento musical",author:"Práctica guiada · cualquier instrumento",duration:"10 minutos",level:"Principiante",description:"Prepara manos, postura y respiración antes de practicar. Avanza con ejercicios lentos y cómodos.",interests:["musica"]},
    {id:"music-chords",category:"Música",icon:"🎸",tone:"music",type:"RUTA DE APRENDIZAJE",title:"Tus primeros cuatro acordes",author:"Guitarra · práctica inicial",duration:"20 minutos",level:"Principiante",description:"Practica cambios lentos entre cuatro acordes básicos y registra cuál transición quieres mejorar.",interests:["musica"]},
    {id:"music-rhythm",category:"Música",icon:"🥁",tone:"music",type:"EJERCICIO",title:"Ritmo con palmas",author:"Entrenamiento rítmico",duration:"15 minutos",level:"Todos los niveles",description:"Explora patrones sencillos con palmas o percusión y aumenta la complejidad a tu propio ritmo.",interests:["musica"]},
    {id:"art-sketch",category:"Creatividad",icon:"✏️",tone:"creative",type:"RETO CREATIVO",title:"Dibuja un objeto cotidiano",author:"Observación y dibujo",duration:"20 minutos",level:"Principiante",description:"Elige una taza, una planta o tus llaves. Dibuja sus formas sin buscar que quede perfecto.",interests:["dibujo","fotografia"]},
    {id:"art-watercolor",category:"Creatividad",icon:"🎨",tone:"creative",type:"GUÍA PRÁCTICA",title:"Primeros pasos con acuarela",author:"Color y experimentación",duration:"30 minutos",level:"Principiante",description:"Prueba mezclas de color, agua y pinceladas en una hoja. No necesitas crear una obra terminada.",interests:["dibujo"]},
    {id:"art-writing",category:"Creatividad",icon:"✍️",tone:"creative",type:"EJERCICIO",title:"Una página para soltar ideas",author:"Escritura libre",duration:"15 minutos",level:"Todos los niveles",description:"Escribe durante quince minutos sin editar. Puedes partir de algo que viste, sentiste o imaginaste.",interests:["escritura"]},
    {id:"craft-knit",category:"Manualidades",icon:"🧶",tone:"craft",type:"TUTORIAL · FICHA",title:"Aprende el punto básico de tejido",author:"Tejido para principiantes",duration:"20 minutos",level:"Principiante",description:"Familiarízate con el estambre y las agujas. Practica una pequeña muestra sin preocuparte por terminarla.",interests:["manualidades"]},
    {id:"craft-embroidery",category:"Manualidades",icon:"🪡",tone:"craft",type:"GUÍA PRÁCTICA",title:"Tu primera puntada de bordado",author:"Bordado básico",duration:"15 minutos",level:"Principiante",description:"Prepara tela e hilo y practica una línea de puntada atrás en un retazo.",interests:["manualidades"]},
    {id:"craft-origami",category:"Manualidades",icon:"🦢",tone:"craft",type:"ACTIVIDAD PASO A PASO",title:"Origami: una figura de papel",author:"Papiroflexia",duration:"15 minutos",level:"Principiante",description:"Convierte una hoja de papel en una figura sencilla. Una actividad breve para concentrarte en tus manos.",interests:["manualidades"]},
    {id:"move-walk",category:"Movimiento",icon:"🚶",tone:"move",type:"PAUSA ACTIVA",title:"Caminata de observación",author:"Movimiento al aire libre",duration:"20 minutos",level:"Adaptable",description:"Camina a un ritmo cómodo y encuentra tres detalles del entorno que normalmente pasarías por alto.",interests:["deporte","naturaleza"]},
    {id:"move-mobility",category:"Movimiento",icon:"🧘",tone:"move",type:"RUTINA SUAVE",title:"Movilidad para despejarte",author:"Movilidad y estiramientos",duration:"10 minutos",level:"Principiante",description:"Haz movimientos suaves de cuello, hombros y espalda dentro de un rango cómodo para ti.",interests:["deporte"]},
    {id:"move-dance",category:"Movimiento",icon:"💃",tone:"move",type:"RETO DE MOVIMIENTO",title:"Baila una canción completa",author:"Movimiento libre",duration:"5 minutos",level:"Todos los niveles",description:"Elige una canción que te guste y muévete como quieras. No necesitas aprender una coreografía.",interests:["deporte","baile"]},
    {id:"nature-plant",category:"Naturaleza y cocina",icon:"🪴",tone:"nature",type:"ACTIVIDAD EN CASA",title:"Cuida una planta",author:"Jardinería cotidiana",duration:"10 minutos",level:"Principiante",description:"Revisa la tierra, retira hojas secas y observa qué necesita tu planta antes de regarla.",interests:["naturaleza"]},
    {id:"nature-seeds",category:"Naturaleza y cocina",icon:"🌱",tone:"nature",type:"EXPERIMENTO CASERO",title:"Germina una semilla",author:"Pequeño proyecto natural",duration:"15 minutos",level:"Principiante",description:"Prepara un recipiente y algodón húmedo para observar el proceso de germinación durante los próximos días.",interests:["naturaleza"]},
    {id:"cook-snack",category:"Naturaleza y cocina",icon:"🍓",tone:"nature",type:"RECETA SENCILLA",title:"Prepara una merienda colorida",author:"Cocina cotidiana",duration:"15 minutos",level:"Principiante",description:"Combina fruta o ingredientes que tengas en casa y disfruta preparar algo sencillo sin mirar la pantalla.",interests:["cocina"]}
  ];
  const storageKey = "focovivo.library.saved.v1";
  let saved = [];
  let activeFilter = "Todos";
  let searchTerm = "";
  try { saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (!Array.isArray(saved)) saved=[]; } catch (_) { saved=[]; }
  let profile = {};
  try { profile = JSON.parse(localStorage.getItem("focovivo.interestProfile.v1") || "{}") || {}; } catch (_) { profile={}; }
  const interestMap = {lectura:["lectura"],musica:["musica"],creatividad:["dibujo","escritura","fotografia"],manualidades:["manualidades"],movimiento:["deporte","baile"],"naturaleza y cocina":["naturaleza","cocina"]};
  const selectedInterests = profile.interests || [];

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
    $("#savedResourceCount").textContent = saved.length;
  }
  function isMatch(item) {
    const matchesFilter = activeFilter === "Todos" || (activeFilter === "Guardados" ? saved.includes(item.id) : item.category === activeFilter);
    const haystack = `${item.title} ${item.author} ${item.category} ${item.description} ${item.type}`.toLowerCase();
    return matchesFilter && haystack.includes(searchTerm.toLowerCase());
  }
  function render() {
    const items = resources.filter(isMatch);
    grid.innerHTML = "";
    $("#libraryResultsTitle").textContent = activeFilter === "Guardados" ? "Tu lista guardada" : activeFilter === "Todos" ? "Recursos para explorar" : activeFilter;
    $("#libraryResultsSubtitle").textContent = `${items.length} recurso(s) disponibles en este catálogo de demostración.`;
    $("#libraryEmpty").hidden = items.length > 0;
    items.forEach(item => {
      const card = document.createElement("article"); card.className = "library-card";
      const art = document.createElement("div"); art.className = "library-card-art"; art.dataset.tone = item.tone; art.innerHTML = `<small>${item.type}</small><span>${item.icon}</span>`;
      const body = document.createElement("div"); body.className = "library-card-body";
      const meta = document.createElement("div"); meta.className = "library-card-meta"; meta.innerHTML = `<span>${item.category.toUpperCase()}</span><span>${item.duration}</span>`;
      const matched = item.interests.some(key => selectedInterests.includes(key));
      if (matched) { const tag = document.createElement("div"); tag.className = "library-match"; tag.textContent = "✦ COINCIDE CON TUS INTERESES"; body.appendChild(tag); }
      const title = document.createElement("h4"); title.textContent = item.title;
      const author = document.createElement("p"); author.className = "library-author"; author.textContent = item.author;
      const desc = document.createElement("p"); desc.textContent = item.description;
      const foot = document.createElement("div"); foot.className = "library-card-foot";
      const level = document.createElement("span"); level.textContent = item.level;
      const button = document.createElement("button"); button.type = "button"; button.className = "library-save" + (saved.includes(item.id) ? " saved" : ""); button.dataset.saveResource = item.id; button.textContent = saved.includes(item.id) ? "✓ Guardado" : "+ Mi lista";
      foot.append(level,button); body.append(meta,title,author,desc,foot); card.append(art,body); grid.appendChild(card);
    });
    persist();
  }
  $("#libraryFilters").addEventListener("click", e => {
    const button = e.target.closest("[data-library-filter]"); if (!button) return;
    activeFilter = button.dataset.libraryFilter;
    $("#libraryFilters").querySelectorAll("button").forEach(b => b.classList.toggle("active", b===button));
    render();
  });
  $("#librarySearch").addEventListener("input", e => { searchTerm=e.target.value.trim(); render(); });
  $("#clearLibrarySearch").addEventListener("click", () => { $("#librarySearch").value=""; searchTerm=""; render(); });
  grid.addEventListener("click", e => {
    const button = e.target.closest("[data-save-resource]"); if (!button) return;
    const id = button.dataset.saveResource;
    if (saved.includes(id)) { saved=saved.filter(x=>x!==id); }
    else { saved.push(id); }
    render();
    const toast = $("#toast"); if (toast) { toast.textContent = saved.includes(id) ? "Recurso guardado en tu lista 💚" : "Recurso retirado de tu lista"; toast.classList.add("show"); window.clearTimeout(window.__libraryToast); window.__libraryToast=window.setTimeout(()=>toast.classList.remove("show"),2400); }
  });
  render();
})();
