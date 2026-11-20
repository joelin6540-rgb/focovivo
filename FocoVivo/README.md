# FocoVivo — MVP de bienestar digital

Prototipo frontend en español para explorar hábitos digitales saludables mediante gamificación, analítica y simulaciones de IA.

## Ejecutar localmente
1. Descomprime `FocoVivo.zip`.
2. Abre la carpeta `FocoVivo`.
3. Abre `index.html` en Chrome, Firefox, Safari o Edge.

No requiere Node.js, backend, API keys ni instalación de dependencias. Para una experiencia más consistente, puedes servir la carpeta con una extensión de servidor local de VS Code o con `python -m http.server 8000`.

## Módulos y relación con el problema
- **Inicio:** explica el problema del uso excesivo y presenta una alternativa positiva.
- **Mi progreso:** resume tiempo recuperado, racha, reducción recreativa y bienestar.
- **Mis hábitos:** registra categoría, duración, horario y estado de ánimo; los registros se agregan localmente a la lista de actividad.
- **Consecuencias:** el simulador transforma horas recreativas en equivalencias anuales y de lectura; el jardín cambia visualmente según el nivel de uso.
- **Modo de acompañamiento:** adapta ejemplos de alertas entre tono suave, equilibrado e intrusivo.
- **Panel VIP:** filtra conversaciones ficticias según contactos permitidos y simula respuestas rápidas. No se conecta a WhatsApp, Instagram ni notificaciones del sistema.
- **Mi perfil e intereses:** encuesta personal para elegir hobbies, actividades offline, deporte que quieres practicar, habilidad que deseas desarrollar, tiempo disponible y objetivo personal. Las preferencias se guardan en `localStorage` del navegador.
- **Micro-retos:** genera propuestas personalizadas (por ejemplo, leer un capítulo, practicar un instrumento, dibujar, tejer o entrenar) según los intereses y el tiempo elegido; permite filtrar actividades y completar retos para ganar XP.
- **Analítica:** muestra comparativas, tendencia e intensidad horaria con datos de demostración.
- **Comunidad:** liga semanal y publicaciones offline ficticias con reacciones locales.
- **IA aplicada:** explica clasificación, predicción, NLP y recomendaciones; el laboratorio utiliza reglas heurísticas para simular resultados.
- **Google Cloud:** presenta una arquitectura conceptual con Cloud Run, Firestore, Vertex AI/Gemini, Cloud Storage, IAM/IAP, Logging y Monitoring.

## Enfoque Data / ML / IA
En una versión productiva, eventos consentidos podrían convertirse en variables agregadas (duración, frecuencia, hora, categoría y estado auto-reportado). Un modelo de clasificación podría distinguir patrones recreativos/productivos; un modelo temporal podría estimar ventanas de distracción; NLP podría priorizar mensajes autorizados; Vertex AI/Gemini podría generar recomendaciones con controles de seguridad y tono. La demo actual **no entrena ni ejecuta modelos reales**.

## Arquitectura cloud propuesta
- **Cloud Run:** API y lógica backend.
- **Firestore o Cloud SQL:** perfiles, preferencias, contactos VIP, hábitos y rachas.
- **Cloud Storage:** reportes y recursos multimedia.
- **Vertex AI / Gemini API:** predicción, clasificación y generación controlada.
- **IAM / IAP:** autenticación y control de acceso.
- **Cloud Logging / Monitoring:** observabilidad, métricas y alertas.

## Alcance y privacidad
Los datos de demostración se mantienen en memoria durante la sesión. Las preferencias del perfil personal se guardan en `localStorage` del navegador/dispositivo para que sigan disponibles al volver a abrir la web en ese mismo navegador. No se sincronizan entre dispositivos ni se envían a un servidor. El prototipo no envía información a terceros ni accede a APIs de bienestar digital o notificaciones. Las equivalencias de impacto son ilustrativas, no diagnósticos ni mediciones de sueño real. La integración de mensajería real debe utilizar APIs y permisos oficiales, respetar términos de terceros y solicitar consentimiento explícito.


## Biblioteca offline (catálogo demostrativo)

La sección **Biblioteca offline** incluye 18 fichas de ejemplo distribuidas en lectura, música, creatividad, manualidades, movimiento y naturaleza/cocina. Permite buscar, filtrar por categoría y guardar recursos en una lista local del navegador. Las coincidencias con el perfil se señalan usando los intereses guardados por la persona.

El catálogo actual está definido en `js/library.js`; no descarga obras completas ni consulta APIs externas. Para la siguiente etapa, cada ficha ya tiene campos de categoría, tipo de recurso, título, autor/fuente, duración, nivel y descripción, que pueden mapearse a una API de catálogo, Firestore y Cloud Storage. Los títulos literarios listados son obras de dominio público en su texto original; para distribuir traducciones o ediciones concretas se deberá verificar la licencia de esa edición.

## Mejoras de experiencia: exploración, asistente, inspiración y comunidades
- **Actividades cercanas:** tarjetas de ideas priorizadas por los intereses guardados; búsqueda manual de parques, bibliotecas, cafés, instalaciones deportivas y talleres que abre Google Maps. La búsqueda de lugares todavía no usa geolocalización ni APIs de establecimientos.
- **Inspiración previa:** enlaces de búsqueda a videos de YouTube y consejos breves para dibujo, lectura y movimiento; pensados como impulso antes de realizar la actividad offline.
- **Asistente de actividades:** plan local con preparación y pasos sugeridos. Puede abrir un borrador de correo, búsqueda en Maps o compartir una invitación; no envía correos ni reserva lugares automáticamente.
- **Recordatorios:** agenda un aviso en el navegador y opcionalmente pide permiso para Notifications. En este prototipo el recordatorio requiere que la página permanezca abierta; no hay push de fondo.
- **Comunidades:** invitar a conocer FocoVivo, crear comunidades locales de muestra y unirse/salir de grupos demo. Se almacenan solo en el navegador y no sincronizan entre usuarios.

Estas nuevas funciones son demostrativas y se preparan para futuras integraciones (APIs de lugares y videos, backend/autenticación, notificaciones push, base de datos compartida y agente IA con acciones autorizadas por la persona).
