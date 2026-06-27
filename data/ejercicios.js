const EJERCICIOS = [

  // ── DÍA 1: Agudas, llanas, esdrújulas ───────────────────────────────────

  {
    id: "ej_001",
    tipo: "Acentuación — esdrújulas",
    dificultad: "fácil",
    km: 15,
    dia: 1,
    pregunta: "¿Cuál de estas palabras relativas al tráfico está escrita correctamente?",
    contexto: "El manual del conductor usa vocabulario técnico preciso. La ortografía importa incluso en los carteles de señalización.",
    opciones: ["semaforo", "semáforo", "semafóro", "sémaforo"],
    correcta: 1,
    explicacion: "'Semáforo' es una palabra esdrújula: el acento recae en la antepenúltima sílaba (se-MÁ-fo-ro). Las palabras esdrújulas llevan tilde siempre, sin ninguna excepción. Otros ejemplos de vocabulario de tráfico esdrújulo: vehículo, máximo, tráfico, ángulo.",
    multa: "Sin tilde en esdrújulas → infracción leve. En el examen de lengua descuenta puntos.",
  },

  {
    id: "ej_002",
    tipo: "Acentuación — agudas",
    dificultad: "fácil",
    km: 15,
    dia: 1,
    pregunta: "Un conductor recibió una sanción. ¿Cuál es la forma correcta de escribir la palabra subrayada?",
    contexto: "Artículo 65 de la Ley de Tráfico: las sanciones por infracciones leves se notificarán al conductor.",
    opciones: ["sancion", "sáncion", "sanción", "sancíon"],
    correcta: 2,
    explicacion: "'Sanción' es una palabra aguda (el acento recae en la última sílaba: san-CIÓN). Las palabras agudas llevan tilde cuando terminan en vocal, -n o -s. 'Sanción' termina en -n, así que lleva tilde. Más ejemplos agudas con tilde: camión, revisión, dirección.",
    multa: "Olvidar la tilde en agudas terminadas en -n es uno de los errores más frecuentes. ¡Ojo con las palabras terminadas en -ción!",
  },

  // ── DÍA 2: Dictado — consolidación agudas/llanas/esdrújulas ─────────────

  {
    id: "ej_003",
    tipo: "Acentuación — llanas",
    dificultad: "fácil",
    km: 15,
    dia: 2,
    pregunta: "Un agente redactó un informe. ¿Cuál de estas frases tiene todas las tildes correctas?",
    contexto: "Parte de accidente: descripción del lugar del siniestro.",
    opciones: [
      "El arbol estaba al margen de la carretera.",
      "El árbol estaba al márgen de la carretera.",
      "El árbol estaba al margen de la carretera.",
      "El arbol estaba al márgen de la carretera.",
    ],
    correcta: 2,
    explicacion: "'Árbol' es llana terminada en consonante que no es -n ni -s (termina en -l), por eso lleva tilde. 'Margen' es llana terminada en -n, pero las llanas terminadas en -n NO llevan tilde (al contrario que las agudas). La regla: llana lleva tilde cuando NO termina en vocal, -n o -s.",
    multa: "Confundir la regla de llanas y agudas es un error de base. Recuerda: la regla de la tilde es contraria en agudas y llanas.",
  },

  // ── DÍA 3: Tilde diacrítica (él/el, tú/tu, mí/mi, sé/se) ───────────────

  {
    id: "ej_004",
    tipo: "Tilde diacrítica",
    dificultad: "media",
    km: 20,
    dia: 3,
    pregunta: "El agente de tráfico detuvo el vehículo. ¿Cuál es la frase completamente correcta?",
    contexto: "Control de alcoholemia en la N-II a las 23:00 h. El agente inmovilizó el vehículo.",
    opciones: [
      "El te dijo que el coche era suyo.",
      "Él te dijo que el coche era suyo.",
      "El te dijo que él coche era suyo.",
      "Él te dijo que él coche era de el.",
    ],
    correcta: 1,
    explicacion: "'Él' con tilde es el pronombre personal (se refiere a una persona: él habló). 'El' sin tilde es el artículo determinado (acompaña a un sustantivo: el coche, el agente). Regla de tilde diacrítica: la tilde distingue palabras que se escriben igual pero tienen significado diferente.",
    multa: "Confundir él/el es como saltarse una señal de STOP: error grave que puede costarte el examen de lengua.",
  },

  {
    id: "ej_005",
    tipo: "Tilde diacrítica",
    dificultad: "media",
    km: 20,
    dia: 3,
    pregunta: "Elige la opción correcta para completar el parte de accidente.",
    contexto: "Parte de accidente entre dos vehículos en rotonda. Cada conductor alega que tenía prioridad.",
    opciones: [
      "Tu vehículo no tenia preferencia de paso.",
      "Tú vehículo no tenía preferencia de paso.",
      "Tu vehículo no tenía preferencia de paso.",
      "Tú vehículo no tenia preferencia de paso.",
    ],
    correcta: 2,
    explicacion: "'Tu' sin tilde es el adjetivo posesivo (tu vehículo, tu carné). 'Tú' con tilde es el pronombre personal (tú conduces, ¿tú lo viste?). Además: 'tenía' lleva tilde porque es un hiato (te-NÍ-a: la vocal débil í entre dos vocales fuertes siempre lleva tilde).",
    multa: "Dos errores en una frase: tu/tú y el hiato de 'tenía'. ¡Doble infracción!",
  },

  // ── DÍA 4: Interrogativos con tilde ─────────────────────────────────────

  {
    id: "ej_006",
    tipo: "Tilde en interrogativos",
    dificultad: "media",
    km: 20,
    dia: 4,
    pregunta: "El examinador preguntó: '¿___ velocidad máxima hay en autopista?' Elige la opción correcta.",
    contexto: "Durante el examen práctico de conducir, el examinador puede hacerte preguntas sobre el Código de Circulación.",
    opciones: ["Que", "Qué", "que", "qué"],
    correcta: 3,
    explicacion: "Los pronombres y adverbios interrogativos llevan tilde siempre cuando introducen una pregunta directa (¿Qué velocidad?) o una pregunta indirecta (No sé qué velocidad hay). Los interrogativos son: qué, quién, cuánto, cuándo, cómo, dónde, cuál. Todos llevan tilde en contexto interrogativo o exclamativo.",
    multa: "Sin tilde en 'qué' interrogativo → error muy frecuente en Batxillerat. Los interrogativos sin tilde son conjunciones o relativos, no preguntas.",
  },

  // ── DÍA 5: Hiatos ────────────────────────────────────────────────────────

  {
    id: "ej_007",
    tipo: "Hiato con tilde",
    dificultad: "media",
    km: 25,
    dia: 5,
    pregunta: "¿Cuál de estas frases sobre señalización está escrita correctamente?",
    contexto: "Manual de señales de tráfico: las señales verticales se clasifican en señales de advertencia de peligro, de reglamentación y de indicación.",
    opciones: [
      "La señal estaba en el pais equivocado.",
      "La señal estaba en el país equivocado.",
      "La señal estaba en el pais equivocado.",
      "La señal estaba en el paìs equivocado.",
    ],
    correcta: 1,
    explicacion: "'País' tiene un hiato: pa-ÍS. Cuando una vocal débil (i, u) aparece junto a una vocal fuerte (a, e, o) y forman sílabas distintas (hiato), la vocal débil lleva tilde siempre, aunque la palabra sea llana terminada en -s. La tilde 'rompe' el posible diptongo. Más ejemplos: raíz, baúl, día, frío, tío.",
    multa: "Sin tilde en hiatos → error habitual. Recuerda: si puedes separar las dos vocales en sílabas distintas y una es débil, lleva tilde.",
  },

  // ── DÍA 6: Enclíticos ────────────────────────────────────────────────────

  {
    id: "ej_008",
    tipo: "Acentuación — enclíticos",
    dificultad: "difícil",
    km: 30,
    dia: 6,
    pregunta: "El instructor le dijo al alumno: '_____ y pon el intermitente.' ¿Cuál es la forma correcta?",
    contexto: "Clase práctica de conducir. El instructor guía al alumno antes de un cambio de carril.",
    opciones: ["Calmate", "Cálmate", "Calmáte", "Calmatë"],
    correcta: 1,
    explicacion: "Cuando a un verbo se le añaden pronombres detrás (enclíticos), la nueva palabra resultante se acentúa según las reglas generales. 'Calma' + 'te' = 'cálmate'. El acento recae en la antepenúltima sílaba (CÁL-ma-te), lo que la convierte en esdrújula → lleva tilde. Más ejemplos: dímelo, cállate, llevárselo.",
    multa: "Sin tilde en enclíticos → la mayoría de las formas resultantes son esdrújulas. Si el resultado tiene 3 o más sílabas y el acento cae en la antepenúltima, lleva tilde seguro.",
  },

  // ── DÍA 7: Adverbios en -mente ───────────────────────────────────────────

  {
    id: "ej_009",
    tipo: "Adverbios en -mente",
    dificultad: "media",
    km: 20,
    dia: 7,
    pregunta: "En el informe del accidente ponía que el conductor frenó '___'. ¿Cuál es la forma correcta?",
    contexto: "Reconstrucción de accidente de tráfico. El perito describe la velocidad de reacción del conductor.",
    opciones: ["rapidamente", "rápidamente", "rapídamente", "rapidaménte"],
    correcta: 1,
    explicacion: "Los adverbios en -mente conservan la tilde del adjetivo del que vienen, si lo tenía. 'Rápido' lleva tilde (es esdrújula: RÁ-pi-do), así que 'rápidamente' también la conserva. Imagina que son dos palabras unidas: rápido + mente. Más ejemplos: fácil → fácilmente, básico → básicamente, tranquilo → tranquilamente (sin tilde porque tranquilo no la tenía).",
    multa: "Escribir 'rapidamente' sin tilde es un error de nivel básico. La regla de los adverbios en -mente es una de las más fáciles de recordar.",
  },

  // ── DÍA 8: Dictado B/V + tildes ─────────────────────────────────────────

  {
    id: "ej_010",
    tipo: "B y V",
    dificultad: "media",
    km: 25,
    dia: 8,
    pregunta: "'El conductor de_ía mantener la distancia de seguridad.' ¿B o V?",
    contexto: "Artículo 54 del Reglamento General de Circulación: todo conductor debe mantener la separación lateral y longitudinal suficiente con el vehículo precedente.",
    opciones: ["debia (con B, sin tilde)", "debía (con B, con tilde)", "devía (con V, con tilde)", "devia (con V, sin tilde)"],
    correcta: 1,
    explicacion: "Dos reglas en una: 1) 'Debía' se escribe con B porque el pretérito imperfecto de indicativo siempre se escribe con -BA/-BÍA: cantaba, comía, debía, vivía. 2) 'Debía' lleva tilde porque es un hiato: de-BÍ-a (la vocal débil í entre vocales forma sílabas distintas y siempre lleva tilde).",
    multa: "Escribir 'devía' con V es infracción ortográfica. Recuerda: imperfectos de indicativo → siempre B.",
  },

  // ── DÍA 9: B y V completo ────────────────────────────────────────────────

  {
    id: "ej_011",
    tipo: "B y V",
    dificultad: "media",
    km: 25,
    dia: 9,
    pregunta: "¿Cuál de estas frases del Código de Circulación está bien escrita?",
    contexto: "Artículo sobre prohibiciones de adelantamiento en vías interurbanas.",
    opciones: [
      "Está proivido adelantar en curvas sin visibilidad.",
      "Está prohibido adelantar en curvas sin visibilidad.",
      "Está prohivido adelantar en curvas sin visibilidad.",
      "Está prohívido adelantar en curvas sin visibilidad.",
    ],
    correcta: 1,
    explicacion: "'Prohibido' lleva B (y también H intercalada). La familia léxica: prohibir, prohibición, prohibido, prohibitivo. Todas se escriben con H y con B. Además: 'prohibido' lleva H porque la familia de 'prohibir' siempre la tiene, y la B porque va después de una consonante (h) y en el grupo -ib-.",
    multa: "Prohibido escribir 'proivido' o 'prohivido'. La B en este caso es clara: recuerda la familia léxica completa.",
  },

  // ── DÍA 10: H ────────────────────────────────────────────────────────────

  {
    id: "ej_012",
    tipo: "H intercalada y inicial",
    dificultad: "media",
    km: 25,
    dia: 10,
    pregunta: "Señal R-305 del Código de Circulación: 'Se ___ la entrada a vehículos de motor.' Elige la opción correcta.",
    contexto: "Señalización vertical de reglamentación. Las señales R-3XX indican prohibición de paso.",
    opciones: [
      "Se proibe la entrada.",
      "Se prohive la entrada.",
      "Se prohíbe la entrada.",
      "Se proíbe la entrada.",
    ],
    correcta: 2,
    explicacion: "'Prohíbe' lleva H intercalada (pro-HÍ-be) y además tilde, porque es un hiato: la vocal débil í entre la o y la e se pronuncia en sílabas distintas. La familia léxica es: prohibir, prohíbe, prohibición, prohibido. Todas llevan H. La H intercalada entre vocales es obligatoria cuando la raíz de la palabra la tiene.",
    multa: "Sin H en 'prohíbe' = dos errores en una sola palabra: la H y la tilde del hiato. Infracción doble.",
  },

  // ── DÍA 11: G y J ────────────────────────────────────────────────────────

  {
    id: "ej_013",
    tipo: "G y J",
    dificultad: "media",
    km: 25,
    dia: 11,
    pregunta: "'Los conductores deben e_ercer la conducción responsable.' ¿G o J?",
    contexto: "Principio básico del Código de Circulación: la conducción requiere plena atención y habilidad para manejar el vehículo.",
    opciones: [
      "ejercer (con J) ✓",
      "eGercer (con G) ✗",
      "ejerSer (con S) ✗",
      "eXercer (con X) ✗",
    ],
    correcta: 0,
    explicacion: "'Ejercer' se escribe con J. La familia léxica (ejercicio, ejercitar, ejercicio) confirma la J. Regla: los verbos terminados en -ger y -gir se escriben con G (coger, exigir), pero 'ejercer' termina en -cer, no en -ger. El sonido /j/ ante -e puede ser G o J según la familia léxica de la palabra.",
    multa: "Escribir 'eGercer' sería un error grave. El verbo es 'ejercer', de la misma familia que 'ejercicio'.",
  },

  // ── DÍA 12: C, Z, S ─────────────────────────────────────────────────────

  {
    id: "ej_014",
    tipo: "C, Z y S",
    dificultad: "media",
    km: 25,
    dia: 12,
    pregunta: "'La veloci_ad máxima en vía urbana es de 30 km/h.' ¿Qué va en el hueco?",
    contexto: "Real Decreto 970/2020: en vías urbanas de un carril por sentido el límite genérico es 30 km/h.",
    opciones: ["velocidad (termina en -dad)", "velozidad (termina en -zad)", "velocicad (termina en -cad)", "velocidaz (termina en -daz)"],
    correcta: 0,
    explicacion: "'Velocidad' termina en -dad. Las palabras terminadas en -dad son sustantivos abstractos (libertad, velocidad, ciudad, felicidad, voluntad). Ninguna termina en -zad, -cad ni -daz. Esta es una de las terminaciones más fáciles de recordar: -dad siempre con D al final.",
    multa: "'Velozidad' no existe. Terminaciones -dad, -tad nunca llevan Z ni C. Infracción grave.",
  },

  // ── DÍA 13: Dictado integrado ────────────────────────────────────────────

  {
    id: "ej_015",
    tipo: "Ortografía integrada",
    dificultad: "difícil",
    km: 35,
    dia: 13,
    pregunta: "¿Cuál de estas frases de un parte de accidente NO tiene ningún error ortográfico?",
    contexto: "Parte de accidente oficial. La exactitud ortográfica en documentos legales es fundamental.",
    opciones: [
      "El vehículo devía aber respetado el ceda el paso.",
      "El vehículo debía haber respetado el ceda el paso.",
      "El vehículo debía aver respetado el ceda el paso.",
      "El vehículo devía haber respetado el ceda el paso.",
    ],
    correcta: 1,
    explicacion: "Dos reglas en una frase: 1) 'Debía' → imperfecto de indicativo → siempre con B. 2) 'Haber' (verbo auxiliar) → siempre con H y con B. La familia: haber, había, hubiera, habrá. 'Aver' no existe en español como forma verbal: confundir 'haber' con 'a ver' (= vamos a ver) es un error muy grave.",
    multa: "'Aver' no existe. Infracción muy grave: 'haber' (verbo auxiliar) siempre se escribe con H y con B.",
  },

  // ── DÍA 14: R/RR y X ─────────────────────────────────────────────────────

  {
    id: "ej_016",
    tipo: "R, RR y X",
    dificultad: "media",
    km: 20,
    dia: 14,
    pregunta: "¿Cuál de estas palabras relacionadas con el tráfico está mal escrita?",
    contexto: "Vocabulario técnico del examen teórico del carné de conducir.",
    opciones: ["carretera", "rotonda", "alrrededor", "semáforo"],
    correcta: 2,
    explicacion: "'Alrededor' se escribe con una sola R, no con RR. La RR doble solo aparece entre vocales (ca-RRE-tera, to-RRE). Después de consonante (como la -l en 'alrededor'), el sonido fuerte de la R se escribe con una sola R: alrededor, enredar, israelí. 'Carretera' sí lleva RR porque está entre vocales (a-RR-e).",
    multa: "Escribir 'alRRededor' con doble R después de consonante es una infracción. La RR solo va entre vocales.",
  },

  // ── DÍA 15: Examen de semana 3 ───────────────────────────────────────────

  {
    id: "ej_017",
    tipo: "Repaso global",
    dificultad: "difícil",
    km: 40,
    dia: 15,
    pregunta: "Elige la opción en la que TODAS las palabras están escritas correctamente.",
    contexto: "Resumen del Reglamento General de Circulación para el examen teórico.",
    opciones: [
      "El conductor devía haber respetado el límite de velocidad y habría evitado la sanción.",
      "El conductor debía haber respetado el límite de velocidad y habría evitado la sanción.",
      "El conductor debía aver respetado el límite de velocidad y havría evitado la sanción.",
      "El conductor debía haber respetado el límite de velocidad y havría evitado la sanción.",
    ],
    correcta: 1,
    explicacion: "Análisis de cada elemento: 'debía' (B, imperfecto), 'haber' (H+B, verbo auxiliar), 'respetado' (correcto), 'límite' (esdrújula, tilde obligatoria), 'velocidad' (-dad al final), 'habría' (H+B, condicional de haber), 'evitado' (correcto), 'sanción' (aguda terminada en -n, tilde obligatoria). Todas correctas en la opción B.",
    multa: "Un error en cualquiera de estas palabras es una infracción. En el examen de Batxillerat, cada error ortográfico penaliza.",
  },

  // ── DÍA 16: Tilde diacrítica avanzada ────────────────────────────────────

  {
    id: "ej_018",
    tipo: "Tilde diacrítica avanzada",
    dificultad: "difícil",
    km: 30,
    dia: 16,
    pregunta: "'___ que el conductor ___ no había pasado la ITV.' Elige la opción completamente correcta.",
    contexto: "En un parte de accidente, el agente registra todos los datos del vehículo implicado, incluyendo si ha pasado la Inspección Técnica de Vehículos.",
    opciones: [
      "Se que el conductor aun no había pasado la ITV.",
      "Sé que el conductor aún no había pasado la ITV.",
      "Se que el conductor aún no había pasado la ITV.",
      "Sé que el conductor aun no había pasado la ITV.",
    ],
    correcta: 1,
    explicacion: "Dos diacríticas en una frase: 1) 'Sé' con tilde = verbo saber (yo sé). 'Se' sin tilde = pronombre reflexivo (se fue, se lo dije). 2) 'Aún' con tilde = todavía (el coche todavía no pasó la ITV). 'Aun' sin tilde = incluso, ni siquiera (aun así, no lo hizo). La prueba: si puedes sustituir 'aún' por 'todavía', lleva tilde.",
    multa: "Confundir sé/se y aún/aun en la misma frase = doble infracción. Son dos de los pares diacríticos menos conocidos.",
  },

  // ── DÍA 19: Ortografía integrada difícil ─────────────────────────────────

  {
    id: "ej_019",
    tipo: "Ortografía integrada — difícil",
    dificultad: "difícil",
    km: 40,
    dia: 19,
    pregunta: "Lee este fragmento de un informe policial y elige la versión sin errores.",
    contexto: "Atestado policial tras un accidente en la A-2 dirección Barcelona.",
    opciones: [
      "El agente comprovó que el vehículo carecía de señalización y que el conductor no llevaba el cinturón puesto. Immediatamente procedió a identificarlo.",
      "El agente comprobó que el vehículo carecía de señalización y que el conductor no llevaba el cinturón puesto. Inmediatamente procedió a identificarlo.",
      "El agente comprobó que el vehículo carecía de señalización y que el conductor no llevava el cinturón puesto. Inmediatamente procedió a identificarlo.",
      "El agente comprobó que el vehículo carecía de señalización y que el conductor no llevaba el cinturón puesto. Immediatamente procedió a identificarlo.",
    ],
    correcta: 1,
    explicacion: "Tres errores a detectar: 1) 'Comprobó' con B (BL y BR llevan B: comprobar, brindar, hablar). 2) 'Llevaba' con B (imperfecto de indicativo → siempre B: llevaba, conducía, circulaba). 3) 'Inmediatamente' con una sola M al inicio (in-me-dia-ta-men-te). 'Immediatamente' con doble M no existe en español.",
    multa: "Tres trampas en un solo párrafo. En documentos legales y exámenes, cada error cuenta.",
  },

  // ── DÍA 20: Reto final ────────────────────────────────────────────────────

  {
    id: "ej_020",
    tipo: "Reto final del mes",
    dificultad: "difícil",
    km: 50,
    dia: 20,
    pregunta: "Este es el reto final del Mes 1. ¿Cuál de estas frases NO tiene ningún error ortográfico?",
    contexto: "Evaluación final del mes. Vocabulario extraído del manual oficial del conductor de la DGT.",
    opciones: [
      "El vehículo circulava a más velocidad de la permitida y no respetó la señal de ceda el paso.",
      "El vehículo circulaba a más velocidad de la permitida y no respetó la señal de ceda el paso.",
      "El vehículo circulaba a mas velocidad de la permitida y no respetó la señal de ceda el paso.",
      "El vehículo circulaba a más velocidad de la permitida y no respeto la señal de ceda el paso.",
    ],
    correcta: 1,
    explicacion: "Análisis de los errores en cada opción: A) 'circulava' → error de B/V (imperfecto: circulaba con B). C) 'mas' sin tilde → error diacrítico (más = cantidad, lleva tilde). D) 'respeto' sin tilde → error de acentuación ('respetó' es pretérito indefinido, aguda terminada en vocal, lleva tilde). La opción B no tiene ningún error.",
    multa: "Si has llegado hasta aquí y tienes errores, vuelve a repasar la regla que falla. El carné de conducir está cerca, ¡no lo pierdas ahora!",
  },

];

// Días sin ejercicios propios (días de descanso)
const REST_DAYS = [17, 18];
