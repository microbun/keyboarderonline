const keyElements = new Map(
  Array.from(document.querySelectorAll("[data-code]")).map((element) => [element.dataset.code, element]),
);

const languageCatalog = {
  "zh-CN": { label: "简体中文", aliases: ["zh", "zh-cn", "zh-hans", "cn", "china", "chinese"] },
  en: { label: "English", aliases: ["en", "en-us", "en-gb", "english"] },
  fr: { label: "Français", aliases: ["fr", "fr-fr", "france", "french"] },
  de: { label: "Deutsch", aliases: ["de", "de-de", "german", "germany"] },
  es: { label: "Español", aliases: ["es", "es-es", "spanish", "spain"] },
  it: { label: "Italiano", aliases: ["it", "it-it", "italian", "italy"] },
  "pt-PT": { label: "Português", aliases: ["pt", "pt-pt", "portuguese", "portugal"] },
  nl: { label: "Nederlands", aliases: ["nl", "nl-nl", "dutch", "netherlands"] },
  pl: { label: "Polski", aliases: ["pl", "pl-pl", "polish", "poland"] },
  sv: { label: "Svenska", aliases: ["sv", "sv-se", "swedish", "sweden"] },
  da: { label: "Dansk", aliases: ["da", "da-dk", "danish", "denmark"] },
  fi: { label: "Suomi", aliases: ["fi", "fi-fi", "finnish", "finland"] },
  cs: { label: "Čeština", aliases: ["cs", "cs-cz", "czech", "czechia"] },
  hu: { label: "Magyar", aliases: ["hu", "hu-hu", "hungarian", "hungary"] },
  ro: { label: "Română", aliases: ["ro", "ro-ro", "romanian", "romania"] },
  el: { label: "Ελληνικά", aliases: ["el", "el-gr", "greek", "greece"] },
  tr: { label: "Türkçe", aliases: ["tr", "tr-tr", "turkish", "turkey"] },
  uk: { label: "Українська", aliases: ["uk", "uk-ua", "ukrainian", "ukraine"] },
  ru: { label: "Русский", aliases: ["ru", "ru-ru", "russian"] },
  hi: { label: "हिन्दी", aliases: ["hi", "hi-in", "hindi", "india"] },
  ko: { label: "한국어", aliases: ["ko", "ko-kr", "korean", "korea", "kr"] },
  ja: { label: "日本語", aliases: ["ja", "ja-jp", "japanese", "japan"] },
};

const translations = {
  "zh-CN": {
    pageTitle: "Keyboader Tester | 键盘按键测试",
    languageLabel: "语言",
    languageOptionAuto: "自动",
    eyebrowText: "Keyboard Inspector",
    heroTitle: "实时检查每一个按键是否正常触发",
    heroText:
      "按下键盘任意按键，页面会同步显示物理位置、事件状态、按下次数和最近操作记录，适合排查失灵、连击和映射异常。",
    lastEventLabel: "最近事件",
    waitingInput: "等待输入",
    lastKeyMetaIdle: "事件类型 / code / key / 位置",
    noActiveKeys: "当前没有按住的按键",
    keepPressingHint: "保持按压时，对应按键会持续高亮",
    keyboardLayoutTitle: "键盘布局",
    keyboardLayoutHint: "高亮表示监听到对应按键事件",
    resetDetectedButton: "重置检测",
    statsTitle: "测试状态",
    statsHint: "实时显示监听数据",
    totalPressesLabel: "按下总次数",
    activeCountLabel: "当前按住",
    lastCodeLabel: "最近按键",
    responseSpeedLabel: "响应速度",
    responseMetaIdle: "等待输入",
    responseMetaAverage: "平均 {value}ms",
    eventHistoryTitle: "事件记录",
    clearLogButton: "清空记录",
    eventLogPlaceholder: "按下任意按键后，这里会显示最近 12 条事件记录。",
    activeKeysTitle: "当前按住的键",
    activeKeysHint: "支持多键同时检测",
    activeKeysPlaceholder: "暂无",
    standard: "标准区",
    left: "左侧",
    right: "右侧",
    numpad: "数字键盘",
    eventTypeKeydown: "按下",
    eventTypeKeyup: "抬起",
    eventTypeRepeat: "连发",
    keyValueUnknown: "未知",
    codeValueUnknown: "未知编码",
    logExtra: "key={key} | location={location}{repeat}",
    repeatSuffix: " | repeat",
    on: "开启",
    off: "关闭",
    unmapped: "未映射",
  },
  en: {
    pageTitle: "Keyboader Tester | Keyboard Key Test",
    languageLabel: "Language",
    languageOptionAuto: "Auto",
    eyebrowText: "Keyboard Inspector",
    heroTitle: "Verify every key press in real time",
    heroText:
      "Press any key to see its physical position, event state, press count, and recent activity so you can diagnose dead keys, chatter, and mapping issues.",
    lastEventLabel: "Last Event",
    waitingInput: "Waiting for input",
    lastKeyMetaIdle: "event / code / key / location",
    noActiveKeys: "No keys are currently held down",
    keepPressingHint: "Keys stay highlighted while you keep them pressed",
    keyboardLayoutTitle: "Keyboard Layout",
    keyboardLayoutHint: "Highlighted keys indicate captured keyboard events",
    resetDetectedButton: "Reset detected",
    statsTitle: "Test Status",
    statsHint: "Live listener metrics",
    totalPressesLabel: "Total presses",
    activeCountLabel: "Currently held",
    lastCodeLabel: "Last code",
    responseSpeedLabel: "Response speed",
    responseMetaIdle: "Waiting for input",
    responseMetaAverage: "Average {value}ms",
    eventHistoryTitle: "Event History",
    clearLogButton: "Clear log",
    eventLogPlaceholder: "After you press any key, the latest 12 events will appear here.",
    activeKeysTitle: "Keys currently held",
    activeKeysHint: "Supports multiple simultaneous key presses",
    activeKeysPlaceholder: "None",
    standard: "Standard",
    left: "Left",
    right: "Right",
    numpad: "Numpad",
    eventTypeKeydown: "keydown",
    eventTypeKeyup: "keyup",
    eventTypeRepeat: "repeat",
    keyValueUnknown: "Unknown",
    codeValueUnknown: "UnknownCode",
    logExtra: "key={key} | location={location}{repeat}",
    repeatSuffix: " | repeat",
    on: "ON",
    off: "OFF",
    unmapped: "Unmapped",
  },
  fr: {
    pageTitle: "Keyboader Tester | Test du clavier",
    languageLabel: "Langue",
    languageOptionAuto: "Auto",
    eyebrowText: "Inspecteur de clavier",
    heroTitle: "Verifiez chaque touche en temps reel",
    heroText:
      "Appuyez sur n'importe quelle touche pour afficher sa position physique, l'etat de l'evenement, le nombre d'appuis et l'activite recente afin de diagnostiquer les touches mortes, les doubles frappes et les problemes de mappage.",
    lastEventLabel: "Dernier evenement",
    waitingInput: "En attente de saisie",
    lastKeyMetaIdle: "evenement / code / touche / position",
    noActiveKeys: "Aucune touche n'est actuellement maintenue",
    keepPressingHint: "Les touches restent surlignees tant qu'elles sont maintenues",
    keyboardLayoutTitle: "Disposition du clavier",
    keyboardLayoutHint: "Les touches surlignees indiquent les evenements captes",
    resetDetectedButton: "Reinitialiser la detection",
    statsTitle: "Etat du test",
    statsHint: "Mesures en direct du detecteur",
    totalPressesLabel: "Total des appuis",
    activeCountLabel: "Touches maintenues",
    lastCodeLabel: "Dernier code",
    responseSpeedLabel: "Vitesse de reponse",
    responseMetaIdle: "En attente de saisie",
    responseMetaAverage: "Moyenne {value}ms",
    eventHistoryTitle: "Historique des evenements",
    clearLogButton: "Effacer le journal",
    eventLogPlaceholder: "Apres avoir appuye sur une touche, les 12 derniers evenements apparaissent ici.",
    activeKeysTitle: "Touches actuellement maintenues",
    activeKeysHint: "Prend en charge plusieurs touches simultanees",
    activeKeysPlaceholder: "Aucune",
    standard: "Standard",
    left: "Gauche",
    right: "Droite",
    numpad: "Pave numerique",
    eventTypeKeydown: "appui",
    eventTypeKeyup: "relache",
    eventTypeRepeat: "repetition",
    keyValueUnknown: "Inconnue",
    codeValueUnknown: "Code inconnu",
    logExtra: "key={key} | emplacement={location}{repeat}",
    repeatSuffix: " | repetition",
    on: "ACTIF",
    off: "INACTIF",
    unmapped: "Non mappee",
  },
  de: {
    pageTitle: "Keyboader Tester | Tastaturtest",
    languageLabel: "Sprache",
    languageOptionAuto: "Auto",
    eyebrowText: "Tastaturinspektor",
    heroTitle: "Jeden Tastendruck in Echtzeit pruefen",
    heroText:
      "Druecke eine beliebige Taste, um Position, Ereignisstatus, Anzahl der Anschlaege und letzte Aktivitaeten zu sehen. So lassen sich defekte Tasten, Prellen und Mapping-Fehler erkennen.",
    lastEventLabel: "Letztes Ereignis",
    waitingInput: "Warte auf Eingabe",
    lastKeyMetaIdle: "ereignis / code / taste / position",
    noActiveKeys: "Derzeit wird keine Taste gehalten",
    keepPressingHint: "Tasten bleiben markiert, solange du sie gedrueckt haeltst",
    keyboardLayoutTitle: "Tastaturlayout",
    keyboardLayoutHint: "Markierte Tasten zeigen erkannte Tastaturereignisse",
    resetDetectedButton: "Erkennung zuruecksetzen",
    statsTitle: "Teststatus",
    statsHint: "Live-Metriken des Listeners",
    totalPressesLabel: "Gesamte Anschlaege",
    activeCountLabel: "Aktuell gehalten",
    lastCodeLabel: "Letzter Code",
    responseSpeedLabel: "Antwortzeit",
    responseMetaIdle: "Warte auf Eingabe",
    responseMetaAverage: "Durchschnitt {value}ms",
    eventHistoryTitle: "Ereignisverlauf",
    clearLogButton: "Protokoll leeren",
    eventLogPlaceholder: "Nach einem Tastendruck erscheinen hier die letzten 12 Ereignisse.",
    activeKeysTitle: "Aktuell gehaltene Tasten",
    activeKeysHint: "Unterstuetzt mehrere gleichzeitige Tasten",
    activeKeysPlaceholder: "Keine",
    standard: "Standard",
    left: "Links",
    right: "Rechts",
    numpad: "Ziffernblock",
    eventTypeKeydown: "gedrueckt",
    eventTypeKeyup: "losgelassen",
    eventTypeRepeat: "wiederholt",
    keyValueUnknown: "Unbekannt",
    codeValueUnknown: "UnbekannterCode",
    logExtra: "key={key} | position={location}{repeat}",
    repeatSuffix: " | wiederholt",
    on: "AN",
    off: "AUS",
    unmapped: "Nicht zugeordnet",
  },
  es: {
    pageTitle: "Keyboader Tester | Prueba de teclado",
    languageLabel: "Idioma",
    languageOptionAuto: "Auto",
    eyebrowText: "Inspector de teclado",
    heroTitle: "Comprueba cada tecla en tiempo real",
    heroText:
      "Pulsa cualquier tecla para ver su posicion fisica, el estado del evento, el numero de pulsaciones y la actividad reciente. Es util para detectar teclas muertas, rebotes y errores de asignacion.",
    lastEventLabel: "Ultimo evento",
    waitingInput: "Esperando entrada",
    lastKeyMetaIdle: "evento / code / tecla / ubicacion",
    noActiveKeys: "No hay teclas mantenidas ahora mismo",
    keepPressingHint: "Las teclas permanecen resaltadas mientras sigan pulsadas",
    keyboardLayoutTitle: "Distribucion del teclado",
    keyboardLayoutHint: "Las teclas resaltadas indican eventos capturados",
    resetDetectedButton: "Restablecer deteccion",
    statsTitle: "Estado de la prueba",
    statsHint: "Metricas del detector en vivo",
    totalPressesLabel: "Pulsaciones totales",
    activeCountLabel: "Actualmente mantenidas",
    lastCodeLabel: "Ultimo code",
    responseSpeedLabel: "Velocidad de respuesta",
    responseMetaIdle: "Esperando entrada",
    responseMetaAverage: "Promedio {value}ms",
    eventHistoryTitle: "Historial de eventos",
    clearLogButton: "Limpiar registro",
    eventLogPlaceholder: "Despues de pulsar una tecla, aqui apareceran los ultimos 12 eventos.",
    activeKeysTitle: "Teclas mantenidas",
    activeKeysHint: "Admite multiples teclas simultaneas",
    activeKeysPlaceholder: "Ninguna",
    standard: "Estandar",
    left: "Izquierda",
    right: "Derecha",
    numpad: "Teclado numerico",
    eventTypeKeydown: "pulsada",
    eventTypeKeyup: "soltada",
    eventTypeRepeat: "repeticion",
    keyValueUnknown: "Desconocida",
    codeValueUnknown: "CodeDesconocido",
    logExtra: "key={key} | ubicacion={location}{repeat}",
    repeatSuffix: " | repeticion",
    on: "ACTIVADO",
    off: "DESACTIVADO",
    unmapped: "Sin asignar",
  },
  it: {
    pageTitle: "Keyboader Tester | Test della tastiera",
    languageLabel: "Lingua",
    languageOptionAuto: "Auto",
    eyebrowText: "Ispettore tastiera",
    heroTitle: "Controlla ogni tasto in tempo reale",
    heroText:
      "Premi qualsiasi tasto per vedere posizione fisica, stato dell'evento, numero di pressioni e attivita recenti, utile per individuare tasti guasti, rimbalzi e problemi di mappatura.",
    lastEventLabel: "Ultimo evento",
    waitingInput: "In attesa di input",
    lastKeyMetaIdle: "evento / code / tasto / posizione",
    noActiveKeys: "Nessun tasto e attualmente premuto",
    keepPressingHint: "I tasti restano evidenziati finche li tieni premuti",
    keyboardLayoutTitle: "Layout della tastiera",
    keyboardLayoutHint: "I tasti evidenziati indicano gli eventi rilevati",
    resetDetectedButton: "Reimposta rilevamento",
    statsTitle: "Stato del test",
    statsHint: "Metriche live del listener",
    totalPressesLabel: "Pressioni totali",
    activeCountLabel: "Attualmente premuti",
    lastCodeLabel: "Ultimo code",
    responseSpeedLabel: "Velocita di risposta",
    responseMetaIdle: "In attesa di input",
    responseMetaAverage: "Media {value}ms",
    eventHistoryTitle: "Cronologia eventi",
    clearLogButton: "Cancella registro",
    eventLogPlaceholder: "Dopo aver premuto un tasto, qui compariranno gli ultimi 12 eventi.",
    activeKeysTitle: "Tasti attualmente premuti",
    activeKeysHint: "Supporta piu tasti simultanei",
    activeKeysPlaceholder: "Nessuno",
    standard: "Standard",
    left: "Sinistra",
    right: "Destra",
    numpad: "Tastierino numerico",
    eventTypeKeydown: "premuto",
    eventTypeKeyup: "rilasciato",
    eventTypeRepeat: "ripetizione",
    keyValueUnknown: "Sconosciuto",
    codeValueUnknown: "CodeSconosciuto",
    logExtra: "key={key} | posizione={location}{repeat}",
    repeatSuffix: " | ripetizione",
    on: "ON",
    off: "OFF",
    unmapped: "Non mappato",
  },
  "pt-PT": {
    pageTitle: "Keyboader Tester | Teste do teclado",
    languageLabel: "Idioma",
    languageOptionAuto: "Auto",
    eyebrowText: "Inspetor do teclado",
    heroTitle: "Verifique cada tecla em tempo real",
    heroText:
      "Prima qualquer tecla para ver a posicao fisica, o estado do evento, a contagem de toques e a atividade recente. E util para diagnosticar teclas mortas, repeticoes e erros de mapeamento.",
    lastEventLabel: "Ultimo evento",
    waitingInput: "A aguardar entrada",
    lastKeyMetaIdle: "evento / code / tecla / posicao",
    noActiveKeys: "Nenhuma tecla esta atualmente premida",
    keepPressingHint: "As teclas permanecem realcadas enquanto as mantiver premidas",
    keyboardLayoutTitle: "Esquema do teclado",
    keyboardLayoutHint: "As teclas realcadas indicam eventos capturados",
    resetDetectedButton: "Repor deteccao",
    statsTitle: "Estado do teste",
    statsHint: "Metricas em tempo real",
    totalPressesLabel: "Total de toques",
    activeCountLabel: "Atualmente premidas",
    lastCodeLabel: "Ultimo code",
    responseSpeedLabel: "Velocidade de resposta",
    responseMetaIdle: "A aguardar entrada",
    responseMetaAverage: "Media {value}ms",
    eventHistoryTitle: "Historico de eventos",
    clearLogButton: "Limpar registo",
    eventLogPlaceholder: "Depois de premir uma tecla, os ultimos 12 eventos aparecem aqui.",
    activeKeysTitle: "Teclas atualmente premidas",
    activeKeysHint: "Suporta varias teclas em simultaneo",
    activeKeysPlaceholder: "Nenhuma",
    standard: "Padrao",
    left: "Esquerda",
    right: "Direita",
    numpad: "Teclado numerico",
    eventTypeKeydown: "premida",
    eventTypeKeyup: "solta",
    eventTypeRepeat: "repeticao",
    keyValueUnknown: "Desconhecida",
    codeValueUnknown: "CodeDesconhecido",
    logExtra: "key={key} | posicao={location}{repeat}",
    repeatSuffix: " | repeticao",
    on: "LIGADO",
    off: "DESLIGADO",
    unmapped: "Nao mapeada",
  },
  nl: {
    pageTitle: "Keyboader Tester | Toetsenbordtest",
    languageLabel: "Taal",
    languageOptionAuto: "Auto",
    eyebrowText: "Toetsenbordinspectie",
    heroTitle: "Controleer elke toets in realtime",
    heroText:
      "Druk op een willekeurige toets om de fysieke positie, gebeurtenisstatus, toetsaanslagen en recente activiteit te zien. Handig om dode toetsen, herhalingen en mappingfouten op te sporen.",
    lastEventLabel: "Laatste gebeurtenis",
    waitingInput: "Wachten op invoer",
    lastKeyMetaIdle: "gebeurtenis / code / toets / positie",
    noActiveKeys: "Er worden momenteel geen toetsen ingedrukt gehouden",
    keepPressingHint: "Toetsen blijven gemarkeerd zolang je ze ingedrukt houdt",
    keyboardLayoutTitle: "Toetsenbordindeling",
    keyboardLayoutHint: "Gemarkeerde toetsen tonen vastgelegde gebeurtenissen",
    resetDetectedButton: "Detectie resetten",
    statsTitle: "Teststatus",
    statsHint: "Live luisteraarstatistieken",
    totalPressesLabel: "Totaal aantal aanslagen",
    activeCountLabel: "Nu ingedrukt",
    lastCodeLabel: "Laatste code",
    responseSpeedLabel: "Reactiesnelheid",
    responseMetaIdle: "Wachten op invoer",
    responseMetaAverage: "Gemiddeld {value}ms",
    eventHistoryTitle: "Gebeurtenisgeschiedenis",
    clearLogButton: "Log wissen",
    eventLogPlaceholder: "Na een toetsaanslag verschijnen hier de laatste 12 gebeurtenissen.",
    activeKeysTitle: "Toetsen die nu ingedrukt zijn",
    activeKeysHint: "Ondersteunt meerdere toetsen tegelijk",
    activeKeysPlaceholder: "Geen",
    standard: "Standaard",
    left: "Links",
    right: "Rechts",
    numpad: "Numpad",
    eventTypeKeydown: "ingedrukt",
    eventTypeKeyup: "losgelaten",
    eventTypeRepeat: "herhaling",
    keyValueUnknown: "Onbekend",
    codeValueUnknown: "OnbekendeCode",
    logExtra: "key={key} | positie={location}{repeat}",
    repeatSuffix: " | herhaling",
    on: "AAN",
    off: "UIT",
    unmapped: "Niet toegewezen",
  },
  pl: {
    pageTitle: "Keyboader Tester | Test klawiatury",
    languageLabel: "Jezyk",
    languageOptionAuto: "Auto",
    eyebrowText: "Inspektor klawiatury",
    heroTitle: "Sprawdz kazdy klawisz w czasie rzeczywistym",
    heroText:
      "Nacisnij dowolny klawisz, aby zobaczyc jego polozenie fizyczne, stan zdarzenia, liczbe nacisniec i ostatnia aktywnosc. To pomaga wykryc martwe klawisze, powtorzenia i bledy mapowania.",
    lastEventLabel: "Ostatnie zdarzenie",
    waitingInput: "Oczekiwanie na wejscie",
    lastKeyMetaIdle: "zdarzenie / code / klawisz / polozenie",
    noActiveKeys: "Zaden klawisz nie jest obecnie przytrzymany",
    keepPressingHint: "Klawisze pozostaja podswietlone, dopoki sa przytrzymane",
    keyboardLayoutTitle: "Uklad klawiatury",
    keyboardLayoutHint: "Podswietlone klawisze oznaczaja przechwycone zdarzenia",
    resetDetectedButton: "Resetuj wykrycie",
    statsTitle: "Stan testu",
    statsHint: "Metryki nasluchu na zywo",
    totalPressesLabel: "Laczna liczba nacisniec",
    activeCountLabel: "Obecnie przytrzymane",
    lastCodeLabel: "Ostatni code",
    responseSpeedLabel: "Szybkosc reakcji",
    responseMetaIdle: "Oczekiwanie na wejscie",
    responseMetaAverage: "Srednio {value}ms",
    eventHistoryTitle: "Historia zdarzen",
    clearLogButton: "Wyczysc dziennik",
    eventLogPlaceholder: "Po nacisnieciu klawisza zobaczysz tutaj ostatnie 12 zdarzen.",
    activeKeysTitle: "Obecnie przytrzymane klawisze",
    activeKeysHint: "Obsluguje wiele klawiszy jednoczesnie",
    activeKeysPlaceholder: "Brak",
    standard: "Standard",
    left: "Lewo",
    right: "Prawo",
    numpad: "Klawiatura numeryczna",
    eventTypeKeydown: "wcisniecie",
    eventTypeKeyup: "puszczenie",
    eventTypeRepeat: "powtorzenie",
    keyValueUnknown: "Nieznany",
    codeValueUnknown: "NieznanyCode",
    logExtra: "key={key} | polozenie={location}{repeat}",
    repeatSuffix: " | powtorzenie",
    on: "WL",
    off: "WYL",
    unmapped: "Nieprzypisany",
  },
  sv: {
    pageTitle: "Keyboader Tester | Tangentbordstest",
    languageLabel: "Sprak",
    languageOptionAuto: "Auto",
    eyebrowText: "Tangentbordsinspektor",
    heroTitle: "Kontrollera varje tangent i realtid",
    heroText:
      "Tryck pa valfri tangent for att se fysisk position, handelsestatus, antal tryckningar och senaste aktivitet. Det hjalper dig att hitta doda tangenter, dubbeltryck och mappningsfel.",
    lastEventLabel: "Senaste handelse",
    waitingInput: "Vantar pa inmatning",
    lastKeyMetaIdle: "handelse / code / tangent / position",
    noActiveKeys: "Inga tangenter halls nere just nu",
    keepPressingHint: "Tangenter forblir markerade sa lange de halls nere",
    keyboardLayoutTitle: "Tangentbordslayout",
    keyboardLayoutHint: "Markerade tangenter visar upptackta handelser",
    resetDetectedButton: "Aterstall detektering",
    statsTitle: "Teststatus",
    statsHint: "Live-matningar fran lyssnaren",
    totalPressesLabel: "Totalt antal tryckningar",
    activeCountLabel: "Halls nere nu",
    lastCodeLabel: "Senaste code",
    responseSpeedLabel: "Svarshastighet",
    responseMetaIdle: "Vantar pa inmatning",
    responseMetaAverage: "Genomsnitt {value}ms",
    eventHistoryTitle: "Handelsehistorik",
    clearLogButton: "Rensa logg",
    eventLogPlaceholder: "Nar du trycker pa en tangent visas de senaste 12 handelserna har.",
    activeKeysTitle: "Tangenter som halls nere",
    activeKeysHint: "Stoder flera samtidiga tangenter",
    activeKeysPlaceholder: "Inga",
    standard: "Standard",
    left: "Vanster",
    right: "Hoger",
    numpad: "Numeriskt tangentbord",
    eventTypeKeydown: "nedtryckt",
    eventTypeKeyup: "slappt",
    eventTypeRepeat: "upprepning",
    keyValueUnknown: "Okand",
    codeValueUnknown: "OkandCode",
    logExtra: "key={key} | position={location}{repeat}",
    repeatSuffix: " | upprepning",
    on: "PA",
    off: "AV",
    unmapped: "Ej mappad",
  },
  da: {
    pageTitle: "Keyboader Tester | Tastaturtest",
    languageLabel: "Sprog",
    languageOptionAuto: "Auto",
    eyebrowText: "Tastaturinspektor",
    heroTitle: "Kontroller hver tast i realtid",
    heroText:
      "Tryk pa en vilkarlig tast for at se fysisk placering, haendelsesstatus, antal tryk og seneste aktivitet. Det er nyttigt til at finde dode taster, dobbelttryk og mappingsfejl.",
    lastEventLabel: "Seneste haendelse",
    waitingInput: "Venter pa input",
    lastKeyMetaIdle: "haendelse / code / tast / placering",
    noActiveKeys: "Ingen taster holdes nede lige nu",
    keepPressingHint: "Taster forbliver fremhaevede, mens de holdes nede",
    keyboardLayoutTitle: "Tastaturlayout",
    keyboardLayoutHint: "Fremhaevede taster viser registrerede haendelser",
    resetDetectedButton: "Nulstil registrering",
    statsTitle: "Teststatus",
    statsHint: "Live-maalinger fra lytteren",
    totalPressesLabel: "Samlet antal tryk",
    activeCountLabel: "Holdes nede nu",
    lastCodeLabel: "Seneste code",
    responseSpeedLabel: "Responshastighed",
    responseMetaIdle: "Venter pa input",
    responseMetaAverage: "Gennemsnit {value}ms",
    eventHistoryTitle: "Haendelseshistorik",
    clearLogButton: "Ryd log",
    eventLogPlaceholder: "Nar du trykker pa en tast, vises de seneste 12 haendelser her.",
    activeKeysTitle: "Taster der holdes nede",
    activeKeysHint: "Understotter flere samtidige taster",
    activeKeysPlaceholder: "Ingen",
    standard: "Standard",
    left: "Venstre",
    right: "Hojre",
    numpad: "Numerisk tastatur",
    eventTypeKeydown: "ned",
    eventTypeKeyup: "op",
    eventTypeRepeat: "gentagelse",
    keyValueUnknown: "Ukendt",
    codeValueUnknown: "UkendtCode",
    logExtra: "key={key} | placering={location}{repeat}",
    repeatSuffix: " | gentagelse",
    on: "TIL",
    off: "FRA",
    unmapped: "Ikke tilknyttet",
  },
  fi: {
    pageTitle: "Keyboader Tester | Nappaimistotesti",
    languageLabel: "Kieli",
    languageOptionAuto: "Auto",
    eyebrowText: "Nappaimistoinspektori",
    heroTitle: "Tarkista jokainen painallus reaaliajassa",
    heroText:
      "Paina mita tahansa nappainta nahdaksesi fyysisen sijainnin, tapahtuman tilan, painallusmaaran ja viimeisimmat tapahtumat. Talla loydat rikkinnaiset nappaimet, kaksoispainallukset ja kartoitusvirheet.",
    lastEventLabel: "Viimeisin tapahtuma",
    waitingInput: "Odotetaan syotetta",
    lastKeyMetaIdle: "tapahtuma / code / nappain / sijainti",
    noActiveKeys: "Yhtaan nappainta ei pideta alhaalla",
    keepPressingHint: "Nappaimet pysyvat korostettuina niin kauan kuin pidat ne pohjassa",
    keyboardLayoutTitle: "Nappaimistoasettelu",
    keyboardLayoutHint: "Korostetut nappaimet osoittavat tunnistetut tapahtumat",
    resetDetectedButton: "Nollaa tunnistus",
    statsTitle: "Testin tila",
    statsHint: "Kuuntelijan reaaliaikaiset mittarit",
    totalPressesLabel: "Painalluksia yhteensa",
    activeCountLabel: "Pohjassa nyt",
    lastCodeLabel: "Viimeisin code",
    responseSpeedLabel: "Vasteaika",
    responseMetaIdle: "Odotetaan syotetta",
    responseMetaAverage: "Keskiarvo {value}ms",
    eventHistoryTitle: "Tapahtumahistoria",
    clearLogButton: "Tyhjenna loki",
    eventLogPlaceholder: "Kun painat nappainta, viimeiset 12 tapahtumaa näkyvat tassa.",
    activeKeysTitle: "Pohjassa olevat nappaimet",
    activeKeysHint: "Tukee useita samanaikaisia painalluksia",
    activeKeysPlaceholder: "Ei yhtaan",
    standard: "Vakio",
    left: "Vasen",
    right: "Oikea",
    numpad: "Numeronappaimisto",
    eventTypeKeydown: "painettu",
    eventTypeKeyup: "vapautettu",
    eventTypeRepeat: "toisto",
    keyValueUnknown: "Tuntematon",
    codeValueUnknown: "TuntematonCode",
    logExtra: "key={key} | sijainti={location}{repeat}",
    repeatSuffix: " | toisto",
    on: "PAALLA",
    off: "POIS",
    unmapped: "Ei kartoitettu",
  },
  cs: {
    pageTitle: "Keyboader Tester | Test klavesnice",
    languageLabel: "Jazyk",
    languageOptionAuto: "Auto",
    eyebrowText: "Inspektor klavesnice",
    heroTitle: "Zkontrolujte kazdou klavesu v realnem case",
    heroText:
      "Stisknete libovolnou klavesu a uvidite fyzickou polohu, stav udalosti, pocet stisku a posledni aktivitu. To pomaha odhalit nefunkcni klavesy, opakovani i chyby mapovani.",
    lastEventLabel: "Posledni udalost",
    waitingInput: "Cekani na vstup",
    lastKeyMetaIdle: "udalost / code / klavesa / poloha",
    noActiveKeys: "Zadne klavesy nejsou aktualne drzeny",
    keepPressingHint: "Klavesy zustanou zvyraznene, dokud je drzite",
    keyboardLayoutTitle: "Rozlozeni klavesnice",
    keyboardLayoutHint: "Zvyraznene klavesy znamenaji zachycene udalosti",
    resetDetectedButton: "Resetovat detekci",
    statsTitle: "Stav testu",
    statsHint: "Zive metriky posluchace",
    totalPressesLabel: "Celkovy pocet stisku",
    activeCountLabel: "Aktualne drzeno",
    lastCodeLabel: "Posledni code",
    responseSpeedLabel: "Rychlost odezvy",
    responseMetaIdle: "Cekani na vstup",
    responseMetaAverage: "Prumer {value}ms",
    eventHistoryTitle: "Historie udalosti",
    clearLogButton: "Vymazat zaznam",
    eventLogPlaceholder: "Po stisku klavesy se zde zobrazi poslednich 12 udalosti.",
    activeKeysTitle: "Aktualne drzeno",
    activeKeysHint: "Podporuje vice soucasnych klaves",
    activeKeysPlaceholder: "Zadne",
    standard: "Standard",
    left: "Leva",
    right: "Prava",
    numpad: "Numericka klavesnice",
    eventTypeKeydown: "stisk",
    eventTypeKeyup: "uvolneni",
    eventTypeRepeat: "opakovani",
    keyValueUnknown: "Neznama",
    codeValueUnknown: "NeznamyCode",
    logExtra: "key={key} | poloha={location}{repeat}",
    repeatSuffix: " | opakovani",
    on: "ZAP",
    off: "VYP",
    unmapped: "Nenamapovano",
  },
  hu: {
    pageTitle: "Keyboader Tester | Billentyuzet teszt",
    languageLabel: "Nyelv",
    languageOptionAuto: "Auto",
    eyebrowText: "Billentyuzet ellenorzo",
    heroTitle: "Ellenorizzen minden billentyut valos idoben",
    heroText:
      "Nyomjon meg barmelyik billentyut, hogy lassa a fizikai helyet, az esemeny allapotat, a lenyomasok szamat es a kozelmultbeli aktivitast. Igy konnyen felismerhetok a hibas billentyuk, ismetlesek es kiosztasi hibak.",
    lastEventLabel: "Utolso esemeny",
    waitingInput: "Bemenetre var",
    lastKeyMetaIdle: "esemeny / code / billentyu / hely",
    noActiveKeys: "Jelenleg nincs lenyomva tartott billentyu",
    keepPressingHint: "A billentyuk kiemelve maradnak, amig lenyomva tartja oket",
    keyboardLayoutTitle: "Billentyuzet kiosztas",
    keyboardLayoutHint: "A kiemelt billentyuk az eszlelt esemenyeket jelzik",
    resetDetectedButton: "Erzekeles visszaallitasa",
    statsTitle: "Teszt allapota",
    statsHint: "Elo figyelo metrikak",
    totalPressesLabel: "Osszes lenyomas",
    activeCountLabel: "Jelenleg nyomva",
    lastCodeLabel: "Utolso code",
    responseSpeedLabel: "Valaszido",
    responseMetaIdle: "Bemenetre var",
    responseMetaAverage: "Atlag {value}ms",
    eventHistoryTitle: "Esemenynaplo",
    clearLogButton: "Napló torlese",
    eventLogPlaceholder: "Miutan megnyom egy billentyut, itt jelenik meg az utolso 12 esemeny.",
    activeKeysTitle: "Jelenleg lenyomva tartott billentyuk",
    activeKeysHint: "Tobb egyideju billentyut is tamogat",
    activeKeysPlaceholder: "Nincs",
    standard: "Standard",
    left: "Bal",
    right: "Jobb",
    numpad: "Szambillentyuzet",
    eventTypeKeydown: "lenyomas",
    eventTypeKeyup: "felengedes",
    eventTypeRepeat: "ismetles",
    keyValueUnknown: "Ismeretlen",
    codeValueUnknown: "IsmeretlenCode",
    logExtra: "key={key} | hely={location}{repeat}",
    repeatSuffix: " | ismetles",
    on: "BE",
    off: "KI",
    unmapped: "Nincs hozzarendelve",
  },
  ro: {
    pageTitle: "Keyboader Tester | Test tastatura",
    languageLabel: "Limba",
    languageOptionAuto: "Auto",
    eyebrowText: "Inspector tastatura",
    heroTitle: "Verifica fiecare tasta in timp real",
    heroText:
      "Apasa orice tasta pentru a vedea pozitia fizica, starea evenimentului, numarul de apasari si activitatea recenta. Este util pentru a depista taste defecte, repetari si erori de mapare.",
    lastEventLabel: "Ultimul eveniment",
    waitingInput: "Se asteapta intrare",
    lastKeyMetaIdle: "eveniment / code / tasta / pozitie",
    noActiveKeys: "Nicio tasta nu este apasata in acest moment",
    keepPressingHint: "Tastele raman evidentiate cat timp sunt tinute apasate",
    keyboardLayoutTitle: "Aspect tastatura",
    keyboardLayoutHint: "Tastele evidentiate indica evenimentele capturate",
    resetDetectedButton: "Reseteaza detectarea",
    statsTitle: "Starea testului",
    statsHint: "Metrici live ale ascultatorului",
    totalPressesLabel: "Apasari totale",
    activeCountLabel: "Apasate acum",
    lastCodeLabel: "Ultimul code",
    responseSpeedLabel: "Viteza raspunsului",
    responseMetaIdle: "Se asteapta intrare",
    responseMetaAverage: "Medie {value}ms",
    eventHistoryTitle: "Istoric evenimente",
    clearLogButton: "Goleste jurnalul",
    eventLogPlaceholder: "Dupa ce apesi o tasta, aici apar ultimele 12 evenimente.",
    activeKeysTitle: "Taste tinute apasate",
    activeKeysHint: "Accepta mai multe taste simultan",
    activeKeysPlaceholder: "Niciuna",
    standard: "Standard",
    left: "Stanga",
    right: "Dreapta",
    numpad: "Tastatura numerica",
    eventTypeKeydown: "apasare",
    eventTypeKeyup: "eliberare",
    eventTypeRepeat: "repetare",
    keyValueUnknown: "Necunoscuta",
    codeValueUnknown: "CodeNecunoscut",
    logExtra: "key={key} | pozitie={location}{repeat}",
    repeatSuffix: " | repetare",
    on: "PORNIT",
    off: "OPRIT",
    unmapped: "Nemapat",
  },
  el: {
    pageTitle: "Keyboader Tester | Ελεγχος πληκτρολογιου",
    languageLabel: "Γλωσσα",
    languageOptionAuto: "Auto",
    eyebrowText: "Επιθεωρητης πληκτρολογιου",
    heroTitle: "Ελεγξτε καθε πληκτρο σε πραγματικο χρονο",
    heroText:
      "Πατηστε οποιοδηποτε πληκτρο για να δειτε τη φυσικη θεση, την κατασταση του συμβαντος, τον αριθμο πατηματων και την προσφατη δραστηριοτητα. Χρησιμο για προβληματα πληκτρων, επαναληψεων και χαρτογραφησης.",
    lastEventLabel: "Τελευταιο συμβαν",
    waitingInput: "Αναμονη για εισοδο",
    lastKeyMetaIdle: "συμβαν / code / πληκτρο / θεση",
    noActiveKeys: "Δεν κρατιεται κανενα πληκτρο αυτη τη στιγμη",
    keepPressingHint: "Τα πληκτρα μενουν τονισμενα οσο τα κρατατε πατημενα",
    keyboardLayoutTitle: "Διαταξη πληκτρολογιου",
    keyboardLayoutHint: "Τα τονισμενα πληκτρα δειχνουν καταγεγραμμενα συμβαντα",
    resetDetectedButton: "Επαναφορα ανιχνευσης",
    statsTitle: "Κατασταση δοκιμης",
    statsHint: "Ζωντανες μετρησεις ακροατη",
    totalPressesLabel: "Συνολικα πατηματα",
    activeCountLabel: "Κρατιουνται τωρα",
    lastCodeLabel: "Τελευταιο code",
    responseSpeedLabel: "Ταχυτητα αποκρισης",
    responseMetaIdle: "Αναμονη για εισοδο",
    responseMetaAverage: "Μεσος ορος {value}ms",
    eventHistoryTitle: "Ιστορικο συμβαντων",
    clearLogButton: "Καθαρισμος καταγραφης",
    eventLogPlaceholder: "Αφου πατησετε ενα πληκτρο, εδω εμφανιζονται τα τελευταια 12 συμβαντα.",
    activeKeysTitle: "Πληκτρα που κρατιουνται",
    activeKeysHint: "Υποστηριζει πολλα ταυτοχρονα πληκτρα",
    activeKeysPlaceholder: "Καμια",
    standard: "Τυπικη",
    left: "Αριστερα",
    right: "Δεξια",
    numpad: "Αριθμητικο",
    eventTypeKeydown: "πατημα",
    eventTypeKeyup: "απελευθερωση",
    eventTypeRepeat: "επαναληψη",
    keyValueUnknown: "Αγνωστο",
    codeValueUnknown: "ΑγνωστοςCode",
    logExtra: "key={key} | θεση={location}{repeat}",
    repeatSuffix: " | επαναληψη",
    on: "ON",
    off: "OFF",
    unmapped: "Χωρις αντιστοιχιση",
  },
  tr: {
    pageTitle: "Keyboader Tester | Klavye testi",
    languageLabel: "Dil",
    languageOptionAuto: "Auto",
    eyebrowText: "Klavye denetleyici",
    heroTitle: "Her tusa gercek zamanli bak",
    heroText:
      "Herhangi bir tusa basin; fiziksel konum, olay durumu, basma sayisi ve son etkinlik hemen gorunsun. Bozuk tuslari, tekrar basmalari ve esleme hatalarini bulmak icin kullanislidir.",
    lastEventLabel: "Son olay",
    waitingInput: "Giris bekleniyor",
    lastKeyMetaIdle: "olay / code / tus / konum",
    noActiveKeys: "Su anda basili tutulan tus yok",
    keepPressingHint: "Tuslar basili tuttugunuz surece vurgulu kalir",
    keyboardLayoutTitle: "Klavye duzeni",
    keyboardLayoutHint: "Vurgulanan tuslar yakalanan olaylari gosterir",
    resetDetectedButton: "Algilamayi sifirla",
    statsTitle: "Test durumu",
    statsHint: "Canli dinleyici olcumleri",
    totalPressesLabel: "Toplam basim",
    activeCountLabel: "Su anda basili",
    lastCodeLabel: "Son code",
    responseSpeedLabel: "Tepki hizi",
    responseMetaIdle: "Giris bekleniyor",
    responseMetaAverage: "Ortalama {value}ms",
    eventHistoryTitle: "Olay gecmisi",
    clearLogButton: "Kaydi temizle",
    eventLogPlaceholder: "Bir tusa bastiktan sonra son 12 olay burada gorunur.",
    activeKeysTitle: "Su anda basili tuslar",
    activeKeysHint: "Birden fazla tusa ayni anda destek verir",
    activeKeysPlaceholder: "Yok",
    standard: "Standart",
    left: "Sol",
    right: "Sag",
    numpad: "Sayisal tus takimi",
    eventTypeKeydown: "basildi",
    eventTypeKeyup: "birakildi",
    eventTypeRepeat: "tekrar",
    keyValueUnknown: "Bilinmiyor",
    codeValueUnknown: "BilinmeyenCode",
    logExtra: "key={key} | konum={location}{repeat}",
    repeatSuffix: " | tekrar",
    on: "ACIK",
    off: "KAPALI",
    unmapped: "Eslenmemis",
  },
  uk: {
    pageTitle: "Keyboader Tester | Тест клавиатури",
    languageLabel: "Мова",
    languageOptionAuto: "Auto",
    eyebrowText: "Iнспектор клавiатури",
    heroTitle: "Перевiряйте кожну клавiшу в реальному часi",
    heroText:
      "Натиснiть будь-яку клавiшу, щоб побачити фiзичне розташування, стан подiї, кiлькiсть натискань i нещодавню активнiсть. Це допомагає знаходити несправнi клавiшi, повтори та помилки розкладки.",
    lastEventLabel: "Остання подiя",
    waitingInput: "Очiкування вводу",
    lastKeyMetaIdle: "подiя / code / клавiша / розташування",
    noActiveKeys: "Зараз жодна клавiша не утримується",
    keepPressingHint: "Клавiшi залишаються пiдсвiченими, доки ви їх утримуєте",
    keyboardLayoutTitle: "Розкладка клавiатури",
    keyboardLayoutHint: "Пiдсвiченi клавiшi означають захопленi подiї",
    resetDetectedButton: "Скинути виявлення",
    statsTitle: "Стан тесту",
    statsHint: "Живi метрики слухача",
    totalPressesLabel: "Загальна кiлькiсть натискань",
    activeCountLabel: "Утримується зараз",
    lastCodeLabel: "Останнiй code",
    responseSpeedLabel: "Швидкiсть вiдгуку",
    responseMetaIdle: "Очiкування вводу",
    responseMetaAverage: "Середнє {value}ms",
    eventHistoryTitle: "Iсторiя подiй",
    clearLogButton: "Очистити журнал",
    eventLogPlaceholder: "Пiсля натискання клавiшi тут з'являться останнi 12 подiй.",
    activeKeysTitle: "Клавiшi, що зараз утримуються",
    activeKeysHint: "Пiдтримує кiлька одночасних клавiш",
    activeKeysPlaceholder: "Немає",
    standard: "Стандарт",
    left: "Лiво",
    right: "Право",
    numpad: "Цифровий блок",
    eventTypeKeydown: "натискання",
    eventTypeKeyup: "вiдпускання",
    eventTypeRepeat: "повтор",
    keyValueUnknown: "Невiдомо",
    codeValueUnknown: "НевiдомийCode",
    logExtra: "key={key} | розташування={location}{repeat}",
    repeatSuffix: " | повтор",
    on: "УВIМК.",
    off: "ВИМК.",
    unmapped: "Не зiставлено",
  },
  ru: {
    pageTitle: "Keyboader Tester | Тест клавиатуры",
    languageLabel: "Язык",
    languageOptionAuto: "Auto",
    eyebrowText: "Инспектор клавиатуры",
    heroTitle: "Проверяйте каждую клавишу в реальном времени",
    heroText:
      "Нажмите любую клавишу, чтобы увидеть физическое положение, состояние события, число нажатий и недавнюю активность. Это помогает находить неработающие клавиши, дребезг и ошибки раскладки.",
    lastEventLabel: "Последнее событие",
    waitingInput: "Ожидание ввода",
    lastKeyMetaIdle: "событие / code / клавиша / позиция",
    noActiveKeys: "Сейчас ни одна клавиша не удерживается",
    keepPressingHint: "Клавиши остаются подсвеченными, пока вы держите их нажатыми",
    keyboardLayoutTitle: "Раскладка клавиатуры",
    keyboardLayoutHint: "Подсвеченные клавиши показывают захваченные события",
    resetDetectedButton: "Сбросить обнаружение",
    statsTitle: "Состояние теста",
    statsHint: "Живые метрики слушателя",
    totalPressesLabel: "Всего нажатий",
    activeCountLabel: "Удерживается сейчас",
    lastCodeLabel: "Последний code",
    responseSpeedLabel: "Скорость отклика",
    responseMetaIdle: "Ожидание ввода",
    responseMetaAverage: "Среднее {value}ms",
    eventHistoryTitle: "История событий",
    clearLogButton: "Очистить журнал",
    eventLogPlaceholder: "После нажатия клавиши здесь появятся последние 12 событий.",
    activeKeysTitle: "Сейчас удерживаются",
    activeKeysHint: "Поддерживает несколько одновременных клавиш",
    activeKeysPlaceholder: "Нет",
    standard: "Стандарт",
    left: "Левая",
    right: "Правая",
    numpad: "Цифровой блок",
    eventTypeKeydown: "нажатие",
    eventTypeKeyup: "отпускание",
    eventTypeRepeat: "повтор",
    keyValueUnknown: "Неизвестно",
    codeValueUnknown: "НеизвестныйCode",
    logExtra: "key={key} | позиция={location}{repeat}",
    repeatSuffix: " | повтор",
    on: "ВКЛ",
    off: "ВЫКЛ",
    unmapped: "Не сопоставлено",
  },
  hi: {
    pageTitle: "Keyboader Tester | कीबोर्ड परीक्षण",
    languageLabel: "भाषा",
    languageOptionAuto: "स्वचालित",
    eyebrowText: "कीबोर्ड इंस्पेक्टर",
    heroTitle: "हर कुंजी को रियल टाइम में जांचें",
    heroText:
      "किसी भी कुंजी को दबाएं और उसकी भौतिक स्थिति, घटना की अवस्था, दबाने की गिनती और हाल की गतिविधि देखें। इससे खराब कुंजियां, दोहराव और मैपिंग समस्याएं पहचानना आसान होता है।",
    lastEventLabel: "आखिरी घटना",
    waitingInput: "इनपुट की प्रतीक्षा",
    lastKeyMetaIdle: "घटना / code / key / स्थान",
    noActiveKeys: "इस समय कोई कुंजी दबाकर नहीं रखी गई है",
    keepPressingHint: "जब तक कुंजियां दबाकर रखी जाती हैं, वे हाइलाइट रहती हैं",
    keyboardLayoutTitle: "कीबोर्ड लेआउट",
    keyboardLayoutHint: "हाइलाइट की गई कुंजियां पकड़ी गई घटनाएं दिखाती हैं",
    resetDetectedButton: "डिटेक्शन रीसेट करें",
    statsTitle: "परीक्षण स्थिति",
    statsHint: "लाइव लिस्नर मेट्रिक्स",
    totalPressesLabel: "कुल दबाव",
    activeCountLabel: "अभी दबाई हुई",
    lastCodeLabel: "आखिरी code",
    responseSpeedLabel: "प्रतिक्रिया गति",
    responseMetaIdle: "इनपुट की प्रतीक्षा",
    responseMetaAverage: "औसत {value}ms",
    eventHistoryTitle: "घटना इतिहास",
    clearLogButton: "लॉग साफ करें",
    eventLogPlaceholder: "कुंजी दबाने के बाद यहां हाल की 12 घटनाएं दिखाई देंगी।",
    activeKeysTitle: "अभी दबाकर रखी गई कुंजियां",
    activeKeysHint: "एक साथ कई कुंजियों का समर्थन",
    activeKeysPlaceholder: "कोई नहीं",
    standard: "मानक",
    left: "बायां",
    right: "दायां",
    numpad: "नंपैड",
    eventTypeKeydown: "दबाया",
    eventTypeKeyup: "छोड़ा",
    eventTypeRepeat: "दोहराव",
    keyValueUnknown: "अज्ञात",
    codeValueUnknown: "अज्ञातCode",
    logExtra: "key={key} | स्थान={location}{repeat}",
    repeatSuffix: " | repeat",
    on: "चालू",
    off: "बंद",
    unmapped: "मैप नहीं किया गया",
  },
  ko: {
    pageTitle: "Keyboader Tester | 키보드 테스트",
    languageLabel: "언어",
    languageOptionAuto: "자동",
    eyebrowText: "키보드 인스펙터",
    heroTitle: "모든 키를 실시간으로 확인하세요",
    heroText:
      "아무 키나 눌러 물리적 위치, 이벤트 상태, 입력 횟수, 최근 활동을 확인하세요. 고장난 키, 반복 입력, 매핑 문제를 찾는 데 유용합니다.",
    lastEventLabel: "최근 이벤트",
    waitingInput: "입력을 기다리는 중",
    lastKeyMetaIdle: "이벤트 / code / key / 위치",
    noActiveKeys: "현재 눌린 상태로 유지된 키가 없습니다",
    keepPressingHint: "키를 누르고 있는 동안 계속 강조 표시됩니다",
    keyboardLayoutTitle: "키보드 레이아웃",
    keyboardLayoutHint: "강조된 키는 감지된 이벤트를 의미합니다",
    resetDetectedButton: "감지 초기화",
    statsTitle: "테스트 상태",
    statsHint: "실시간 리스너 지표",
    totalPressesLabel: "총 입력 횟수",
    activeCountLabel: "현재 눌림",
    lastCodeLabel: "최근 code",
    responseSpeedLabel: "응답 속도",
    responseMetaIdle: "입력을 기다리는 중",
    responseMetaAverage: "평균 {value}ms",
    eventHistoryTitle: "이벤트 기록",
    clearLogButton: "기록 지우기",
    eventLogPlaceholder: "키를 누르면 최근 12개의 이벤트가 여기에 표시됩니다.",
    activeKeysTitle: "현재 눌린 키",
    activeKeysHint: "여러 키 동시 입력 지원",
    activeKeysPlaceholder: "없음",
    standard: "표준",
    left: "왼쪽",
    right: "오른쪽",
    numpad: "숫자 패드",
    eventTypeKeydown: "누름",
    eventTypeKeyup: "뗌",
    eventTypeRepeat: "반복",
    keyValueUnknown: "알 수 없음",
    codeValueUnknown: "알수없는Code",
    logExtra: "key={key} | 위치={location}{repeat}",
    repeatSuffix: " | 반복",
    on: "켜짐",
    off: "꺼짐",
    unmapped: "매핑 없음",
  },
  ja: {
    pageTitle: "Keyboader Tester | キーボードテスト",
    languageLabel: "言語",
    languageOptionAuto: "自動",
    eyebrowText: "キーボードインスペクター",
    heroTitle: "すべてのキーをリアルタイムで確認",
    heroText:
      "任意のキーを押すと、物理位置、イベント状態、押下回数、最近の操作履歴が表示されます。故障キー、チャタリング、マッピング異常の確認に便利です。",
    lastEventLabel: "最新イベント",
    waitingInput: "入力待ち",
    lastKeyMetaIdle: "イベント / code / key / 位置",
    noActiveKeys: "現在押されたままのキーはありません",
    keepPressingHint: "押し続けている間はキーがハイライトされます",
    keyboardLayoutTitle: "キーボード配列",
    keyboardLayoutHint: "ハイライトされたキーは検出されたイベントを示します",
    resetDetectedButton: "検出をリセット",
    statsTitle: "テスト状態",
    statsHint: "リアルタイムのリスナー指標",
    totalPressesLabel: "総押下回数",
    activeCountLabel: "現在押下中",
    lastCodeLabel: "最新 code",
    responseSpeedLabel: "応答速度",
    responseMetaIdle: "入力待ち",
    responseMetaAverage: "平均 {value}ms",
    eventHistoryTitle: "イベント履歴",
    clearLogButton: "履歴を消去",
    eventLogPlaceholder: "キーを押すと、直近 12 件のイベントがここに表示されます。",
    activeKeysTitle: "現在押されているキー",
    activeKeysHint: "複数キーの同時検出に対応",
    activeKeysPlaceholder: "なし",
    standard: "標準",
    left: "左",
    right: "右",
    numpad: "テンキー",
    eventTypeKeydown: "押下",
    eventTypeKeyup: "離す",
    eventTypeRepeat: "連打",
    keyValueUnknown: "不明",
    codeValueUnknown: "不明Code",
    logExtra: "key={key} | 位置={location}{repeat}",
    repeatSuffix: " | 連打",
    on: "オン",
    off: "オフ",
    unmapped: "未割り当て",
  },
};

const defaultLanguage = "en";
const supportedLanguages = Object.keys(translations);
const explicitLanguageStorageKey = "keyboader-language";

const languageSelectElement = document.querySelector("#languageSelect");
const textElementIds = [
  "eyebrowText",
  "languageLabel",
  "heroTitle",
  "heroText",
  "lastEventLabel",
  "keyboardLayoutTitle",
  "keyboardLayoutHint",
  "resetDetectedButton",
  "statsTitle",
  "statsHint",
  "totalPressesLabel",
  "activeCountLabel",
  "lastCodeLabel",
  "responseSpeedLabel",
  "eventHistoryTitle",
  "clearLogButton",
  "activeKeysTitle",
  "activeKeysHint",
];

const totalPressesElement = document.querySelector("#totalPresses");
const activeCountElement = document.querySelector("#activeCount");
const lastCodeElement = document.querySelector("#lastCode");
const responseSpeedElement = document.querySelector("#responseSpeed");
const responseMetaElement = document.querySelector("#responseMeta");
const responseSpeedCardElement = document.querySelector("#responseSpeedCard");
const lastKeyLabelElement = document.querySelector("#lastKeyLabel");
const lastKeyMetaElement = document.querySelector("#lastKeyMeta");
const activeHintElement = document.querySelector("#activeHint");
const activeKeysElement = document.querySelector("#activeKeys");
const eventLogElement = document.querySelector("#eventLog");
const clearLogButton = document.querySelector("#clearLogButton");
const resetDetectedButton = document.querySelector("#resetDetectedButton");
const logItemTemplate = document.querySelector("#logItemTemplate");
const lockElements = new Map(
  Array.from(document.querySelectorAll("[data-lock]")).map((element) => [element.dataset.lock, element]),
);

const pressedCodes = new Set();
const testedCodes = new Set();
const unknownKeys = new Map();
const fallbackReleaseTimers = new Map();

let selectedLanguage = "auto";
let resolvedLanguage = defaultLanguage;

let totalPresses = 0;
let responseSampleCount = 0;
let responseAverage = 0;
let pendingResponseFrame = 0;

const languageLookup = new Map();

Object.entries(languageCatalog).forEach(([languageCode, metadata]) => {
  languageLookup.set(languageCode.toLowerCase(), languageCode);

  metadata.aliases.forEach((alias) => {
    languageLookup.set(alias.toLowerCase(), languageCode);
  });
});

function normalizeLanguage(input) {
  if (!input) {
    return null;
  }

  const value = String(input).trim();
  if (!value) {
    return null;
  }

  const normalizedValue = value.toLowerCase().replace(/_/g, "-");

  if (languageLookup.has(normalizedValue)) {
    return languageLookup.get(normalizedValue);
  }

  const parts = normalizedValue.split("-");

  while (parts.length > 1) {
    parts.pop();
    const partial = parts.join("-");

    if (languageLookup.has(partial)) {
      return languageLookup.get(partial);
    }
  }

  return languageLookup.get(parts[0]) || null;
}

function inferLanguageFromSource(value) {
  if (!value) {
    return null;
  }

  const lowerValue = String(value).toLowerCase();
  const tokens = lowerValue.match(/[a-z]{2,}(?:-[a-z]{2,4})?/g) || [];

  for (const token of tokens) {
    const match = normalizeLanguage(token);

    if (match) {
      return match;
    }
  }

  return null;
}

function renderLanguageOptions() {
  if (!languageSelectElement) {
    return;
  }

  const previousValue = languageSelectElement.value;
  languageSelectElement.replaceChildren();

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = t("languageOptionAuto");
  languageSelectElement.append(autoOption);

  supportedLanguages.forEach((languageCode) => {
    const option = document.createElement("option");
    option.value = languageCode;
    option.textContent = languageCatalog[languageCode].label;
    languageSelectElement.append(option);
  });

  languageSelectElement.value = supportedLanguages.includes(previousValue) || previousValue === "auto"
    ? previousValue
    : selectedLanguage;
}

function detectAutoLanguage() {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = normalizeLanguage(params.get("lang"));
  if (queryLanguage) {
    return queryLanguage;
  }

  const referrerLanguage = inferLanguageFromSource(document.referrer);
  if (referrerLanguage) {
    return referrerLanguage;
  }

  const hostLanguage = inferLanguageFromSource(window.location.hostname);
  if (hostLanguage) {
    return hostLanguage;
  }

  const browserLanguage = normalizeLanguage(
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages[0]
      : navigator.language,
  );

  return browserLanguage || defaultLanguage;
}

function getMessages() {
  return translations[resolvedLanguage] || translations[defaultLanguage];
}

function t(key, replacements = {}) {
  const template = getMessages()[key] ?? translations[defaultLanguage][key] ?? key;

  return Object.entries(replacements).reduce(
    (message, [token, value]) => message.replace(`{${token}}`, String(value)),
    template,
  );
}

function getPreferredLanguage() {
  const storedLanguage = normalizeLanguage(localStorage.getItem(explicitLanguageStorageKey));
  return storedLanguage || defaultLanguage;
}

function refreshStaticText() {
  renderLanguageOptions();

  textElementIds.forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = t(id);
    }
  });

  document.documentElement.lang = resolvedLanguage;
  document.title = t("pageTitle");
  languageSelectElement?.setAttribute("aria-label", t("languageLabel"));

  if (totalPresses === 0) {
    lastKeyLabelElement.textContent = t("waitingInput");
    lastKeyMetaElement.textContent = t("lastKeyMetaIdle");
  }

  if (responseSampleCount === 0) {
    responseMetaElement.textContent = t("responseMetaIdle");
  } else {
    responseMetaElement.textContent = t("responseMetaAverage", {
      value: responseAverage.toFixed(1),
    });
  }

  if (eventLogElement.querySelector(".placeholder")) {
    eventLogElement.innerHTML = `<li class="placeholder">${t("eventLogPlaceholder")}</li>`;
  }

  updateActiveKeys();
  updateLockState();
}

function applyLanguage(nextSelection) {
  selectedLanguage = nextSelection;
  resolvedLanguage = nextSelection === "auto" ? detectAutoLanguage() : nextSelection;

  if (selectedLanguage === "auto") {
    localStorage.removeItem(explicitLanguageStorageKey);
  } else {
    localStorage.setItem(explicitLanguageStorageKey, selectedLanguage);
  }

  if (languageSelectElement) {
    languageSelectElement.value = selectedLanguage;
  }

  refreshStaticText();
}

function resolveCode(event) {
  const code = event.code || "";
  const key = event.key || "";
  const keyCode = event.keyCode || event.which || 0;

  if (code && keyElements.has(code)) {
    return code;
  }

  // Browser/driver aliases for Print Screen.
  if (
    code === "Snapshot" ||
    code === "Print" ||
    code === "SysRq" ||
    key === "PrintScreen" ||
    key === "Print" ||
    key === "SysRq" ||
    key === "PrtSc" ||
    keyCode === 44
  ) {
    return "PrintScreen";
  }

  // Fallback for layouts that only report generic Shift + location.
  if ((code === "Shift" || key === "Shift" || keyCode === 16) && event.location === 2) {
    return "ShiftRight";
  }

  if ((code === "Shift" || key === "Shift" || keyCode === 16) && event.location === 1) {
    return "ShiftLeft";
  }

  // Some environments report generic Shift with location=0; prefer right Shift for visibility.
  if ((code === "Shift" || key === "Shift" || keyCode === 16) && event.location === 0) {
    return "ShiftRight";
  }

  return code;
}

function getEventTimestamp(event) {
  if (typeof event.timeStamp !== "number") {
    return null;
  }

  // Some engines report epoch-based timestamps; convert to performance timeline.
  if (event.timeStamp > 1e12) {
    return event.timeStamp - performance.timeOrigin;
  }

  return event.timeStamp;
}

function updateResponseSpeed(event) {
  const eventTime = getEventTimestamp(event);

  if (eventTime === null || !responseSpeedElement || !responseMetaElement || !responseSpeedCardElement) {
    return;
  }

  if (pendingResponseFrame) {
    cancelAnimationFrame(pendingResponseFrame);
  }

  // Measure from keydown to a confirmed rendered frame (two RAF hops)
  // to avoid near-zero readings caused by same-frame timestamps.
  pendingResponseFrame = requestAnimationFrame((paintTime) => {
    pendingResponseFrame = requestAnimationFrame((finalPaintTime) => {
      pendingResponseFrame = 0;
      const latencyMs = Math.max(0.8, Math.min(999, finalPaintTime - eventTime));
      responseSampleCount += 1;
      responseAverage += (latencyMs - responseAverage) / responseSampleCount;

      responseSpeedElement.textContent = `${latencyMs.toFixed(1)}ms`;
      responseMetaElement.textContent = t("responseMetaAverage", {
        value: responseAverage.toFixed(1),
      });

      responseSpeedCardElement.classList.remove("is-fast", "is-normal", "is-slow");

      if (latencyMs <= 20) {
        responseSpeedCardElement.classList.add("is-fast");
      } else if (latencyMs <= 40) {
        responseSpeedCardElement.classList.add("is-normal");
      } else {
        responseSpeedCardElement.classList.add("is-slow");
      }
    });
  });
}

function formatKeyLabel(event) {
  if (!event.key || event.key === " ") {
    return event.code === "Space" ? "Space" : t("keyValueUnknown");
  }

  if (event.key.length === 1) {
    return event.key.toUpperCase();
  }

  return event.key;
}

function formatLocation(location) {
  const labels = {
    0: t("standard"),
    1: t("left"),
    2: t("right"),
    3: t("numpad"),
  };

  return labels[location] || t("standard");
}

function localizeEventType(type) {
  if (type === "keydown" || type === "down") {
    return t("eventTypeKeydown");
  }

  if (type === "keyup" || type === "up") {
    return t("eventTypeKeyup");
  }

  if (type === "repeat") {
    return t("eventTypeRepeat");
  }

  return type;
}

function setLastEvent(event, type) {
  const resolvedCode = resolveCode(event) || event.code;
  const label = formatKeyLabel(event);
  lastKeyLabelElement.textContent = label;
  lastCodeElement.textContent = resolvedCode || "-";
  lastKeyMetaElement.textContent = `${localizeEventType(type)} / ${resolvedCode || t("codeValueUnknown")} / ${label} / ${formatLocation(event.location)}`;
}

function updateActiveKeys() {
  activeCountElement.textContent = String(pressedCodes.size);
  activeKeysElement.replaceChildren();

  if (pressedCodes.size === 0) {
    const placeholder = document.createElement("span");
    placeholder.className = "placeholder-chip";
    placeholder.textContent = t("activeKeysPlaceholder");
    activeKeysElement.append(placeholder);
    activeHintElement.textContent = t("noActiveKeys");
    return;
  }

  activeHintElement.textContent = t("keepPressingHint");

  Array.from(pressedCodes)
    .sort((left, right) => left.localeCompare(right))
    .forEach((code) => {
      const chip = document.createElement("span");
      chip.className = "active-chip";
      chip.textContent = code;
      activeKeysElement.append(chip);
    });
}

function updateLockState(event) {
  ["CapsLock", "NumLock", "ScrollLock"].forEach((lockName) => {
    const lockElement = lockElements.get(lockName);

    if (!lockElement) {
      return;
    }

    const isOn = typeof event?.getModifierState === "function" ? event.getModifierState(lockName) : lockElement.classList.contains("is-on");
    lockElement.classList.toggle("is-on", isOn);
    lockElement.querySelector("b").textContent = isOn ? t("on") : t("off");
  });
}

function appendLog(event, type) {
  const isPlaceholder = eventLogElement.querySelector(".placeholder");
  if (isPlaceholder) {
    isPlaceholder.remove();
  }

  const resolvedCode = resolveCode(event) || event.code;
  const fragment = logItemTemplate.content.cloneNode(true);
  const entry = fragment.querySelector(".log-entry");
  entry.querySelector(".log-type").textContent = localizeEventType(type);
  entry.querySelector(".log-code").textContent = resolvedCode || t("codeValueUnknown");
  entry.querySelector(".log-key").textContent = formatKeyLabel(event);
  entry.querySelector(".log-extra").textContent = t("logExtra", {
    key: JSON.stringify(event.key),
    location: formatLocation(event.location),
    repeat: event.repeat ? t("repeatSuffix") : "",
  });
  eventLogElement.prepend(fragment);

  while (eventLogElement.children.length > 12) {
    eventLogElement.lastElementChild?.remove();
  }
}

function ensureUnknownKey(code) {
  if (!code || keyElements.has(code) || unknownKeys.has(code)) {
    return keyElements.get(code) || unknownKeys.get(code);
  }

  const keyboardLayout = document.querySelector("#keyboardLayout");
  const dynamicKey = document.createElement("button");
  dynamicKey.type = "button";
  dynamicKey.className = "key is-unknown";
  dynamicKey.dataset.code = code;
  dynamicKey.innerHTML = `<span>${code}</span><small>${t("unmapped")}</small>`;
  keyboardLayout.append(dynamicKey);
  unknownKeys.set(code, dynamicKey);
  return dynamicKey;
}

function activateKey(event) {
  const resolvedCode = resolveCode(event);
  const keyElement = keyElements.get(resolvedCode) || ensureUnknownKey(resolvedCode || event.code);

  if (!keyElement) {
    return;
  }

  testedCodes.add(resolvedCode || event.code);
  keyElement.classList.add("is-tested");
  keyElement.classList.add("is-active");
  keyElement.classList.toggle("is-repeating", event.repeat);
}

function releaseKey(event) {
  const resolvedCode = resolveCode(event);
  const keyElement = keyElements.get(resolvedCode) || unknownKeys.get(resolvedCode || event.code);

  if (!keyElement) {
    return;
  }

  keyElement.classList.remove("is-active", "is-repeating");
}

function clearFallbackRelease(code) {
  const timerId = fallbackReleaseTimers.get(code);
  if (timerId) {
    clearTimeout(timerId);
    fallbackReleaseTimers.delete(code);
  }
}

function scheduleFallbackRelease(code) {
  clearFallbackRelease(code);

  // PrintScreen is often intercepted by OS screenshot overlays and may never emit keyup.
  if (code !== "PrintScreen") {
    return;
  }

  const timerId = setTimeout(() => {
    fallbackReleaseTimers.delete(code);

    if (!pressedCodes.has(code)) {
      return;
    }

    pressedCodes.delete(code);
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-active", "is-repeating");
    updateActiveKeys();
  }, 220);

  fallbackReleaseTimers.set(code, timerId);
}

function handleKeydown(event) {
  event.preventDefault();
  const resolvedCode = resolveCode(event);
  totalPresses += 1;
  totalPressesElement.textContent = String(totalPresses);
  updateResponseSpeed(event);
  const code = resolvedCode || event.code;
  pressedCodes.add(code);
  scheduleFallbackRelease(code);
  setLastEvent(event, event.repeat ? "repeat" : "keydown");
  activateKey(event);
  updateActiveKeys();
  updateLockState(event);
  appendLog(event, event.repeat ? "repeat" : "down");
}

function handleKeyup(event) {
  event.preventDefault();
  const resolvedCode = resolveCode(event);
  const code = resolvedCode || event.code;
  clearFallbackRelease(code);
  pressedCodes.delete(code);
  setLastEvent(event, "keyup");
  releaseKey(event);
  updateActiveKeys();
  updateLockState(event);
  appendLog(event, "up");
}

function resetPressedState() {
  fallbackReleaseTimers.forEach((timerId) => clearTimeout(timerId));
  fallbackReleaseTimers.clear();

  pressedCodes.forEach((code) => {
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-active", "is-repeating");
  });

  pressedCodes.clear();
  updateActiveKeys();
}

function resetDetectedState() {
  testedCodes.forEach((code) => {
    const keyElement = keyElements.get(code) || unknownKeys.get(code);
    keyElement?.classList.remove("is-tested");
  });

  testedCodes.clear();
}

document.addEventListener("keydown", handleKeydown, true);
document.addEventListener("keyup", handleKeyup, true);
window.addEventListener("blur", resetPressedState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    resetPressedState();
  }
});

clearLogButton.addEventListener("click", () => {
  eventLogElement.innerHTML = `<li class="placeholder">${t("eventLogPlaceholder")}</li>`;
});

if (resetDetectedButton) {
  resetDetectedButton.addEventListener("click", resetDetectedState);
}

if (languageSelectElement) {
  languageSelectElement.addEventListener("change", (event) => {
    applyLanguage(event.currentTarget.value);
  });
}

selectedLanguage = normalizeLanguage(localStorage.getItem(explicitLanguageStorageKey)) || defaultLanguage;
resolvedLanguage = getPreferredLanguage();
if (languageSelectElement) {
  languageSelectElement.value = selectedLanguage;
}
refreshStaticText();
updateActiveKeys();