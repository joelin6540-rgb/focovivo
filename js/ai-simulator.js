// Motor heurístico de demostración. No llama a Gemini ni a un modelo externo.
window.FocoAI = {
  recommend(use, mood, mode) {
    let title = "Prueba una pausa activa de 10 minutos.";
    let body = "Tu uso recreativo está en un rango moderado. Un pequeño descanso puede ayudarte a volver con intención.";
    let category = "Movimiento", confidence = 82;
    if (use === "high" || mood === "Agotado") {
      title = "Activa un descanso digital de 15 minutos.";
      body = "Detectamos una combinación de uso elevado y cansancio. Deja el teléfono fuera de alcance, toma agua y cambia de ambiente.";
      category = "Descanso"; confidence = 88;
    } else if (use === "low" && mood === "Con energía") {
      title = "Aprovecha tu energía para una actividad offline.";
      body = "Tu registro sugiere un uso recreativo bajo y buen estado de ánimo. Dedica 10 minutos a una actividad que disfrutes.";
      category = "Bienestar"; confidence = 76;
    } else if (mood === "Algo distraído") {
      title = "Prueba el reto de una tarea, una pantalla.";
      body = "Reduce el cambio de contexto durante 10 minutos. Silencia alertas no esenciales y elige una sola tarea.";
      category = "Enfoque"; confidence = 84;
    }
    const tones = {
      suave: "Sin presión: " + body,
      equilibrado: body,
      intrusivo: use === "high" || mood === "Agotado"
        ? "Llevas demasiado tiempo conectado y ya te sientes agotado. Cierra el scroll: 15 minutos para recuperar el control."
        : "No dejes que una distracción decida por ti. Haz una pausa y vuelve a lo que importa."
    };
    return { title, body: tones[mode], category, confidence };
  }
};
