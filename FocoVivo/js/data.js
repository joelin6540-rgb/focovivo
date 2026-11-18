// Datos ficticios para demostrar la experiencia sin backend.
window.FocoData = {
  xp: 1240,
  streak: 7,
  mode: "equilibrado",
  contacts: { mama: true, equipo: true, sofia: false, pareja: true },
  messages: [
    { sender:"mama", name:"Mamá", text:"¿A qué hora vienes hoy? Te guardé comida 😊", priority:"Importante" },
    { sender:"equipo", name:"Equipo de proyecto", text:"¿Puedes revisar la última versión del documento antes de la reunión?", priority:"Trabajo" },
    { sender:"pareja", name:"Pareja", text:"¿Cómo te fue en tu día? 💚", priority:"Importante" }
  ],
  alerts: {
    suave: ["Tu atención también necesita descanso. ¿Te regalas cinco minutos?","Cada pausa cuenta. Vas a tu ritmo 🌿","Si hoy necesitas desconectar, aquí tienes un pequeño recordatorio amable."],
    equilibrado: ["Vas bien. ¿Qué tal si haces una pausa de 5 minutos?","Llevas un rato conectado. Revisa si este tiempo sigue alineado con tu meta.","Tu objetivo está cerca: una pausa consciente puede ayudarte."],
    intrusivo: ["¿De verdad quieres regalarle otra hora al scroll? Tu tiempo también vale.","Llevas demasiado tiempo deslizando. Tu yo de mañana necesita que pares.","Otro reel no va a acercarte a lo que dijiste que querías hacer."]
  }
};
