(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let toastTimer;
  function toast(message) {
    const el=$("#toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
  }
  function navigate(page) {
    $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
    $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
    const active=$(`.nav-item[data-page="${page}"]`);
    $("#crumb").textContent=active ? active.textContent.trim() : page;
    $("#sidebar").classList.remove("open");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.addEventListener("click", e => {
    const nav=e.target.closest("[data-page]"); if(nav){e.preventDefault();navigate(nav.dataset.page);return;}
    const go=e.target.closest("[data-go]"); if(go){navigate(go.dataset.go);return;}
  });
  $("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));

  function setMode(mode) {
    FocoData.mode=mode;
    $("#quickMode").value=mode;
    $$(".mode-card").forEach(c=>{
      const selected=c.dataset.mode===mode;c.classList.toggle("selected",selected);
      $("i",c).textContent=selected?"Modo actual":"Elegir modo";
    });
    renderAlert();
    toast(`Modo ${mode==="intrusivo"?"Intrusivo":mode==="suave"?"Suave":"Equilibrado"} activado`);
  }
  function renderAlert() {
    const list=FocoData.alerts[FocoData.mode];
    $("#alertMessage").textContent=list[Math.floor(Math.random()*list.length)];
  }
  $("#quickMode").addEventListener("change",e=>setMode(e.target.value));
  $$(".mode-card").forEach(c=>c.addEventListener("click",()=>setMode(c.dataset.mode)));
  $("#newAlert").addEventListener("click",renderAlert);

  // Selector visual de categorías.
  $$(".category-option").forEach(c=>c.addEventListener("click",()=>{
    $$(".category-option").forEach(x=>x.classList.remove("selected"));c.classList.add("selected");
  }));
  $("#habitForm").addEventListener("submit",e=>{
    e.preventDefault();
    const category=$('input[name="category"]:checked').value;
    const duration=Math.max(1,Number($("#duration").value)||1);
    const slot=$("#timeSlot").value;
    const mood=$('input[name="mood"]:checked').value;
    const symbols={"Redes sociales":"◎","Video corto":"▷","Trabajo / estudio":"▤","Juegos":"⌘"};
    const color={"Redes sociales":"orange","Video corto":"purple","Trabajo / estudio":"blue","Juegos":"green"};
    const item=document.createElement("div");item.className="history-item";
    item.innerHTML=`<div class="history-symbol ${color[category]}">${symbols[category]}</div><div><strong></strong><small></small></div><b></b>`;
    $("strong",item).textContent=category;
    $("small",item).textContent=`Registro local · ${slot} · ${mood}`;
    $("b",item).textContent=duration>=60?`${Math.floor(duration/60)}h ${duration%60?duration%60+"m":""}`:`${duration} min`;
    $("#habitHistory").prepend(item);
    if(mood==="Agotado") toast("Registro guardado. Considera una pausa reparadora.");
    else toast("¡Registro guardado! Conocerte ya es avanzar.");
    e.target.reset();
    $$(".category-option").forEach((x,i)=>x.classList.toggle("selected",i===0));
  });

  // Simulador de consecuencias y avatar.
  function updateImpact() {
    const h=Number($("#screenHours").value);
    $("#hoursOutput").textContent=h.toFixed(1);
    const result=FocoAnalytics.impact(h);
    $("#yearHours").innerHTML=`${result.annualDays.toFixed(1)} <small>días</small>`;
    $("#pagesRead").innerHTML=`${Math.round(result.pages).toLocaleString("es-MX")} <small>páginas</small>`;
    $("#sleepRisk").innerHTML=`${result.sleepOpportunity.toFixed(1)} <small>h/día</small>`;
    const wellbeing=Math.max(20,Math.min(100,Math.round(100-h*7)));
    $("#wellbeingValue").innerHTML=`${wellbeing}<small>/100</small>`;
    $("#wellbeingBar").style.width=wellbeing+"%";
    const scene=$("#gardenScene"),title=$("#gardenTitle"),copy=$("#gardenText"),status=$("#gardenStatus");
    scene.classList.toggle("tired-garden",h>=6);
    if(h>=6){title.textContent="Tu jardín necesita una pausa";copy.textContent="Demasiado scroll puede quitarle espacio a lo que te nutre.";status.textContent="Necesita cuidado";}
    else if(h>=3){title.textContent="Tu jardín sigue creciendo";copy.textContent="Un poco menos de pantalla puede darle más espacio a tus raíces.";status.textContent="En equilibrio";}
    else{title.textContent="¡Tu jardín está lleno de vida!";copy.textContent="Tus pausas conscientes están dando frutos.";status.textContent="Floreciendo";}
  }
  $("#screenHours").addEventListener("input",updateImpact);updateImpact();

  // Panel VIP: filtra mensajes por contactos habilitados.
  function renderMessages() {
    const allowed=Object.entries(FocoData.contacts).filter(([,v])=>v).map(([k])=>k);
    const messages=FocoData.messages.filter(m=>allowed.includes(m.sender));
    $("#inboxCount").textContent=`${messages.length} mensajes`;
    const list=$("#messageList");list.innerHTML="";
    if(!messages.length){list.innerHTML='<div class="empty-state">No hay mensajes prioritarios. Tu espacio está en calma 🌿</div>';return;}
    messages.forEach(m=>{
      const card=document.createElement("div");card.className="message-card";card.dataset.sender=m.sender;
      const avatarClass={mama:"c1",equipo:"c2",sofia:"c3",pareja:"c4"}[m.sender];
      const initial={mama:"M",equipo:"EP",sofia:"S",pareja:"P"}[m.sender];
      card.innerHTML=`<div class="message-head"><span class="contact-avatar ${avatarClass}">${initial}</span><div><strong></strong><small>Canal simulado · mensaje prioritario</small></div><span class="priority ${m.priority==="Importante"?"high":"medium"}">${m.priority.toUpperCase()}</span></div><p></p><div class="quick-replies"><button data-reply="¡Claro! Te respondo en un momento.">¡Claro!</button><button data-reply="Lo reviso y te aviso.">Lo reviso</button></div>`;
      $("strong",card).textContent=m.name;$("p",card).textContent=m.text;list.appendChild(card);
    });
  }
  $$("#contactList input").forEach(input=>input.addEventListener("change",e=>{
    FocoData.contacts[e.target.dataset.contact]=e.target.checked;renderMessages();
  }));
  $("#messageList").addEventListener("click",e=>{
    const btn=e.target.closest("[data-reply]");if(!btn)return;
    $("#replyFeedback").textContent="Respuesta simulada enviada ✓";
    toast("Respuesta simulada enviada. No se contactó a nadie.");
    setTimeout(()=>$("#replyFeedback").textContent="",2600);
  });
  renderMessages();

  // Perfil de intereses: preferencias locales para personalizar pausas offline.
  const profileStorageKey = "focovivo.interestProfile.v1";
  const activityCatalog = {
    lectura: [
      {icon:"📚",title:"Lee un capítulo de tu libro",desc:"Deja el celular en otra habitación y disfruta un capítulo sin interrupciones.",category:"Descanso",minutes:20,tag:"Lectura"},
      {icon:"📖",title:"Lee 10 páginas por gusto",desc:"Elige algo que te intrigue y avanza a tu propio ritmo.",category:"Enfoque",minutes:15,tag:"Lectura"}
    ],
    musica: [
      {icon:"🎸",title:"Practica tu instrumento",desc:"Dedica un rato a repetir una canción, una escala o un ejercicio que quieras dominar.",category:"Enfoque",minutes:30,tag:"Música"},
      {icon:"🎵",title:"Aprende una melodía nueva",desc:"Practica una parte pequeña de una canción que te guste.",category:"Descanso",minutes:15,tag:"Música"}
    ],
    dibujo: [
      {icon:"🎨",title:"Dibuja durante 30 minutos",desc:"Haz un boceto libre de algo que tengas cerca. No tiene que quedar perfecto.",category:"Creatividad",minutes:30,tag:"Creatividad"},
      {icon:"🖍️",title:"Llena una página de garabatos",desc:"Prueba formas, sombras y colores sin juzgar el resultado.",category:"Descanso",minutes:15,tag:"Creatividad"}
    ],
    manualidades: [
      {icon:"🧶",title:"Teje un ratito",desc:"Avanza unas cuantas vueltas de tu tejido o practica un punto nuevo.",category:"Creatividad",minutes:20,tag:"Manualidades"},
      {icon:"🪡",title:"Crea algo con tus manos",desc:"Dedica un momento a bordar, reparar o armar una pequeña pieza.",category:"Enfoque",minutes:15,tag:"Manualidades"}
    ],
    deporte: [
      {icon:"🏃",title:"Activa tu cuerpo",desc:"Haz una sesión ligera de movilidad, calentamiento o ejercicio que disfrutes.",category:"Movimiento",minutes:20,tag:"Movimiento"},
      {icon:"⚽",title:"Practica una habilidad deportiva",desc:"Dedica unos minutos a practicar técnica, coordinación o control.",category:"Movimiento",minutes:30,tag:"Deporte"}
    ],
    naturaleza: [
      {icon:"🌿",title:"Cuida una planta",desc:"Riega, poda una hoja seca o limpia las hojas con calma.",category:"Descanso",minutes:10,tag:"Naturaleza"},
      {icon:"🚶",title:"Camina y observa tu entorno",desc:"Sal sin audífonos un momento y encuentra tres detalles que normalmente pasas por alto.",category:"Movimiento",minutes:15,tag:"Naturaleza"}
    ],
    cocina: [
      {icon:"🍓",title:"Prepara una receta sencilla",desc:"Prepara una merienda o bebida con atención, sin mirar la pantalla.",category:"Creatividad",minutes:20,tag:"Cocina"},
      {icon:"🥗",title:"Experimenta con un ingrediente",desc:"Prueba una combinación nueva con algo que tengas en casa.",category:"Creatividad",minutes:15,tag:"Cocina"}
    ],
    escritura: [
      {icon:"✍️",title:"Escribe una página de diario",desc:"Anota cómo te sientes, qué agradeces o qué te gustaría intentar.",category:"Descanso",minutes:15,tag:"Escritura"},
      {icon:"📝",title:"Escribe una historia breve",desc:"Inventa una escena o un personaje durante unos minutos.",category:"Creatividad",minutes:20,tag:"Escritura"}
    ],
    baile: [
      {icon:"💃",title:"Baila tres canciones",desc:"Pon música y muévete como quieras. No necesitas aprender una coreografía.",category:"Movimiento",minutes:15,tag:"Baile"},
      {icon:"🕺",title:"Practica unos pasos nuevos",desc:"Repite una secuencia corta que te gustaría aprender.",category:"Movimiento",minutes:20,tag:"Baile"}
    ],
    fotografia: [
      {icon:"📷",title:"Haz una mini búsqueda fotográfica",desc:"Encuentra cinco detalles interesantes a tu alrededor y fotografíalos. Luego guarda el teléfono.",category:"Creatividad",minutes:15,tag:"Fotografía"}
    ],
    juegos: [
      {icon:"♟️",title:"Resuelve un rompecabezas",desc:"Dedica un rato a un acertijo, sudoku o rompecabezas en papel.",category:"Enfoque",minutes:15,tag:"Juegos"},
      {icon:"🃏",title:"Juega una partida presencial",desc:"Invita a alguien a una partida de cartas o un juego de mesa.",category:"Social",minutes:30,tag:"Juegos"}
    ],
    social: [
      {icon:"☕",title:"Conecta con alguien en persona",desc:"Comparte una charla sin teléfonos sobre cómo va su semana.",category:"Social",minutes:20,tag:"Conexión"},
      {icon:"💌",title:"Haz un pequeño gesto por alguien",desc:"Escribe una nota, ayuda en casa o planea una actividad con alguien importante.",category:"Social",minutes:15,tag:"Conexión"}
    ]
  };
  const sportIdeas = {
    "Caminar / senderismo":"🚶 Da una caminata de 20 minutos por una ruta agradable.","Correr":"🏃 Alterna caminata y trote suave durante 15 minutos.","Fútbol":"⚽ Practica pases o dominadas durante 20 minutos.","Basquetbol":"🏀 Practica tiros o bote durante 20 minutos.","Natación":"🏊 Planea o realiza una sesión tranquila de natación.","Ciclismo":"🚲 Da un paseo corto en bicicleta por una ruta segura.","Yoga":"🧘 Haz una secuencia de estiramientos y respiración durante 15 minutos.","Gimnasio / fuerza":"💪 Realiza una rutina breve y adecuada a tu nivel.","Tenis / pádel":"🎾 Practica golpes o coordinación durante 20 minutos.","Baile":"💃 Aprende y repite una coreografía corta.","Artes marciales":"🥋 Practica movimientos básicos o movilidad de forma segura.","Otro deporte":"🏅 Dedica 20 minutos a practicar una habilidad de tu deporte favorito."
  };
  const creativeIdeas = {
    "Aprender un instrumento":"🎼 Practica 20 minutos una técnica o canción en tu instrumento.","Dibujo o pintura":"🎨 Haz un dibujo de 30 minutos usando un objeto como referencia.","Tejido o bordado":"🧶 Avanza 20 minutos en tu tejido o bordado.","Lectura constante":"📚 Lee un capítulo o 10 páginas de un libro.","Cocina o repostería":"🍪 Prepara una receta sencilla sin seguir videos mientras cocinas.","Escritura creativa":"✍️ Escribe una historia corta o una página de diario.","Fotografía":"📷 Sal a buscar cinco encuadres interesantes.","Jardinería":"🪴 Dedica 15 minutos a cuidar o sembrar una planta."
  };
  function loadInterestProfile() {
    try { return JSON.parse(localStorage.getItem(profileStorageKey) || "null") || {interests:[]}; }
    catch (_) { return {interests:[]}; }
  }
  function saveInterestProfile(profile) {
    try { localStorage.setItem(profileStorageKey, JSON.stringify(profile)); return true; }
    catch (_) { return false; }
  }
  function makePersonalChallenges(profile) {
    const choices=[];
    (profile.interests || []).forEach(key => (activityCatalog[key] || []).forEach(item => choices.push({...item})));
    if(profile.sport && sportIdeas[profile.sport]) choices.unshift({icon:"🏅",title:`Tu primer paso: ${profile.sport}`,desc:sportIdeas[profile.sport],category:"Movimiento",minutes:20,tag:profile.sport});
    if(profile.creative && creativeIdeas[profile.creative]) choices.unshift({icon:"✨",title:`Explora: ${profile.creative}`,desc:creativeIdeas[profile.creative],category:"Creatividad",minutes:25,tag:"Nuevo aprendizaje"});
    if(profile.other) choices.unshift({icon:"🌟",title:`Dedica un rato a ${profile.other}`,desc:`Reserva un momento sin pantallas para disfrutar o practicar ${profile.other}, aunque sea empezando por algo pequeño.`,category:"Creatividad",minutes:20,tag:"Tu otra afición"});
    const goalCategory={"Relajarme y bajar el estrés":"Descanso","Aprender algo nuevo":"Creatividad","Mover mi cuerpo y tener energía":"Movimiento","Ser más creativo/a":"Creatividad","Conectar con otras personas":"Social","Recuperar el hábito de leer":"Descanso"}[profile.goal];
    if(goalCategory) choices.sort((a,b)=>(b.category===goalCategory)-(a.category===goalCategory));
    const limit=Number(profile.time || 15);
    return choices.slice(0,6).map((item,index)=>{
      const minutes=Math.min(item.minutes,limit), timeText=`${minutes} minutos`;
      const replaceTime=value=>value.replace(/\b(10|15|20|30|45|60) minutos\b/g,timeText);
      return {...item,title:replaceTime(item.title),desc:replaceTime(item.desc),minutes,xp:30+(index%3)*10};
    });
  }
  function renderPersonalChallenges(profile) {
    const list=makePersonalChallenges(profile), grid=$("#personalizedChallenges");
    grid.innerHTML="";
    if(!list.length){
      $("#personalizedIntro").textContent="Aún no has elegido tus intereses. Completa tu perfil para crear retos con actividades que disfrutes.";
      $("#featuredChallengeTitle").innerHTML="Una pausa que<br>te devuelve a ti.";
      $("#featuredChallengeText").textContent="Elige tus intereses en Mi perfil y recibe ideas como leer, dibujar, tejer, tocar música o practicar un deporte.";
      $("#featuredChallengeTime").textContent="◷ A tu ritmo";
      $("#featuredChallengeTag").textContent="🌱 Personalizable";
      return;
    }
    $("#personalizedIntro").textContent=`Elegimos estas ideas a partir de ${profile.interests.length} interés(es)${profile.sport?" y tu deporte favorito":""}. Puedes cambiarlas cuando quieras.`;
    const featured=list[0];
    $("#featuredChallengeTitle").textContent=featured.title;
    $("#featuredChallengeText").textContent=featured.desc;
    $("#featuredChallengeTime").textContent=`◷ ${featured.minutes} minutos`;
    $("#featuredChallengeTag").textContent=`${featured.icon} ${featured.tag}`;
    list.forEach(item=>{
      const card=document.createElement("article");card.className="challenge-card personalized-card";card.dataset.category=item.category;
      card.innerHTML=`<div class="challenge-art art-personal">${item.icon}</div><div class="challenge-info"><span>${item.tag.toUpperCase()} · ${item.minutes} MIN</span><h3></h3><p></p><div><b>+${item.xp} XP</b><button class="complete-challenge" type="button">Completar</button></div></div>`;
      $("h3",card).textContent=item.title;$("p",card).textContent=item.desc;grid.appendChild(card);
    });
  }
  function hydrateInterestForm(profile) {
    $$("input[name='interests']").forEach(input=>input.checked=(profile.interests||[]).includes(input.value));
    $("#sportChoice").value=profile.sport||"";
    $("#creativeChoice").value=profile.creative||"";
    $("#challengeTime").value=String(profile.time||15);
    $("#profileGoal").value=profile.goal||"Relajarme y bajar el estrés";
    $("#otherInterest").value=profile.other||"";
  }
  let interestProfile=loadInterestProfile();
  hydrateInterestForm(interestProfile);
  renderPersonalChallenges(interestProfile);
  $("#interestForm").addEventListener("submit",e=>{
    e.preventDefault();
    interestProfile={
      interests:$$('input[name="interests"]:checked').map(input=>input.value),
      sport:$("#sportChoice").value,creative:$("#creativeChoice").value,
      time:Number($("#challengeTime").value),goal:$("#profileGoal").value,
      other:$("#otherInterest").value.trim()
    };
    const saved=saveInterestProfile(interestProfile);
    renderPersonalChallenges(interestProfile);
    $("#profileSaveNote").textContent=saved?"¡Listo! Tus intereses quedaron guardados en este navegador.":"No se pudieron guardar tus preferencias en este navegador.";
    toast(saved?"¡Perfil guardado! Tus pausas ya tienen tus gustos en cuenta. 🌱":"No se pudo guardar el perfil en este navegador.");
  });

  // Retos, XP y racha.
  function addXP(points) {
    FocoData.xp+=points;
    $("#xpTop").textContent=FocoData.xp.toLocaleString("es-MX");
    $("#challengeXp").textContent=FocoData.xp.toLocaleString("es-MX");
    $("#communityXp").textContent=FocoData.xp.toLocaleString("es-MX")+" XP";
  }
  $$(".complete-challenge").forEach(btn=>btn.addEventListener("click",()=>{
    if(btn.classList.contains("done"))return;
    const points=Number(btn.parentElement.querySelector("b").textContent.match(/\d+/)[0]);
    btn.classList.add("done");btn.textContent="✓ Completado";addXP(points);
    toast(`¡Reto completado! +${points} XP 🌱`);
  }));
  $("#personalizedChallenges").addEventListener("click",e=>{
    const btn=e.target.closest(".complete-challenge");if(!btn||btn.classList.contains("done"))return;
    const points=Number(btn.parentElement.querySelector("b").textContent.match(/\d+/)[0]);
    btn.classList.add("done");btn.textContent="✓ Completado";addXP(points);
    toast(`¡Reto hecho a tu medida! +${points} XP 🌱`);
  });
  $("#startFeatured").addEventListener("click",()=>{addXP(50);toast("¡Reto iniciado! +50 XP de bienvenida a tu práctica.");$("#startFeatured").textContent="Reto iniciado ✓";$("#startFeatured").disabled=true;});
  $$("#challengeFilters button").forEach(btn=>btn.addEventListener("click",()=>{
    $$("#challengeFilters button").forEach(b=>b.classList.toggle("active",b===btn));
    $$(".challenge-card").forEach(card=>card.style.display=btn.dataset.filter==="Todos"||card.dataset.category===btn.dataset.filter?"":"none");
  }));

  // Analítica y comunidad.
  FocoAnalytics.heatmap();
  $("#ideaForm").addEventListener("submit",e=>{
    e.preventDefault();const value=$("#ideaInput").value.trim();if(!value)return;
    const post=document.createElement("div");post.className="idea-post";
    post.innerHTML='<div class="post-avatar">TÚ</div><div><strong>Tu publicación <small>ahora</small></strong><p></p><button class="support-btn">♡ <span>0</span> Me inspira</button></div>';
    $("p",post).textContent=value;$("#ideaFeed").prepend(post);$("#ideaInput").value="";toast("¡Tu idea ya está en el tablero!");
  });
  $("#ideaFeed").addEventListener("click",e=>{
    const btn=e.target.closest(".support-btn");if(!btn)return;
    btn.classList.toggle("liked");const span=$("span",btn);span.textContent=Number(span.textContent)+(btn.classList.contains("liked")?1:-1);
  });

  // Laboratorio de IA.
  $("#runAI").addEventListener("click",()=>{
    const result=FocoAI.recommend($("#labUse").value,$("#labMood").value,$("#labMode").value);
    $("#aiResult").querySelector("small").textContent="RECOMENDACIÓN DEL MOTOR (SIMULADA)";
    $("#aiResult").querySelector("strong").textContent=result.title;
    $("#aiResult").querySelector("p").textContent=result.body;
    $("#aiResult").querySelector(".result-tags").textContent=`Confianza ilustrativa: ${result.confidence}% · Categoría: ${result.category}`;
    toast("Recomendación generada con reglas simuladas ✧");
  });
})();
