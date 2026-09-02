import type { CommunityResource } from "./community";

/** Recursos públicos seleccionados del navegador: un enlace por dominio y sin material privado. */
export const browserResources: CommunityResource[] = [
  {
    category: "Computer Science", title: "Computer Science", source: "cs.fyi",
    description: "Explicaciones breves y visuales de conceptos fundamentales de computación.", href: "https://cs.fyi/", topics: ["algoritmos", "sistemas", "fundamentos"], level: "Inicial", format: "Guías", language: "Inglés", access: "Gratis"
  },
  {
    category: "Computer Science", title: "Reflection on Trusting Trust", source: "CMU",
    description: "Texto clásico sobre confianza, compiladores y puertas traseras en la cadena de construcción.", href: "https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf", topics: ["compiladores", "supply chain", "confianza"], level: "Avanzado", format: "Paper", language: "Inglés", access: "Gratis"
  },
  {
    category: "Computer Science", title: "Cyber Security Base", source: "University of Helsinki", description: "Curso introductorio con fundamentos de seguridad y ejercicios guiados.", href: "https://cybersecuritybase.mooc.fi/", topics: ["fundamentos", "secure coding", "web"], level: "Inicial", format: "Curso", language: "Inglés", access: "Gratis"
  },
  {
    category: "Computer Science", title: "OpenSecurityTraining2", source: "OpenSecurityTraining2", description: "Rutas formativas de bajo nivel sobre arquitectura, ensamblador y seguridad.", href: "https://opensecuritytraining.info/Learning-Paths.html", topics: ["arquitectura", "x86", "bajo nivel"], level: "Avanzado", format: "Cursos", language: "Inglés", access: "Gratis"
  },
  {
    category: "Computer Science", title: "Python Crash Course", source: "Python Crash Course", description: "Libro para construir una base práctica de programación en Python.", href: "https://www.kea.nu/files/textbooks/humblepy/pythoncrashcourse.pdf", topics: ["Python", "programación", "automatización"], level: "Inicial", format: "PDF", language: "Inglés", access: "Enlace externo"
  },
  {
    category: "Computer Science", title: "Learn Python", source: "learnpython.org", description: "Tutorial interactivo para practicar sintaxis y estructuras básicas de Python.", href: "https://www.learnpython.org/", topics: ["Python", "programación", "práctica"], level: "Inicial", format: "Tutorial interactivo", language: "Inglés", access: "Gratis"
  },
  {
    category: "Computer Science", title: "RegexOne", source: "RegexOne", description: "Ejercicios progresivos para aprender expresiones regulares.", href: "https://regexone.com/", topics: ["regex", "texto", "validación"], level: "Inicial", format: "Ejercicios", language: "Inglés", access: "Gratis"
  },
  {
    category: "Linux", title: "Vim Cheat Sheet", source: "rtorr", description: "Referencia rápida de comandos y movimientos de Vim.", href: "https://vim.rtorr.com/", topics: ["Vim", "editor", "terminal"], level: "Inicial", format: "Cheat sheet", language: "Inglés", access: "Gratis"
  },
  {
    category: "Linux", title: "Vim avanzado", source: "The Valuable Dev", description: "Guía para profundizar en edición, navegación y personalización de Vim.", href: "https://thevaluable.dev/vim-advanced/", topics: ["Vim", "editor", "productividad"], level: "Intermedio", format: "Guía", language: "Inglés", access: "Gratis"
  },
  {
    category: "Linux", title: "Tmux Cheat Sheet", source: "tmuxcheatsheet.com", description: "Referencia rápida para multiplexar terminales y sesiones persistentes.", href: "https://tmuxcheatsheet.com/", topics: ["tmux", "terminal", "sesiones"], level: "Inicial", format: "Cheat sheet", language: "Inglés", access: "Gratis"
  },
  {
    category: "Windows", title: "SS64 Windows Commands", source: "SS64", description: "Referencia de comandos de Windows para administración y troubleshooting.", href: "https://ss64.com/nt/", topics: ["Windows", "CMD", "administración"], level: "Inicial", format: "Referencia", language: "Inglés", access: "Gratis"
  },
  {
    category: "Network", title: "Scapy · Building Network Tools", source: "thePacketGeek", description: "Introducción práctica a la construcción de herramientas de red con Scapy.", href: "https://thepacketgeek.com/scapy/building-network-tools/", topics: ["Scapy", "Python", "paquetes"], level: "Intermedio", format: "Tutorial", language: "Inglés", access: "Gratis"
  },
  {
    category: "Network", title: "OSI Model", source: "Imperva", description: "Referencia visual para relacionar capas OSI, protocolos y controles.", href: "https://www.imperva.com/learn/application-security/osi-model/", topics: ["OSI", "protocolos", "redes"], level: "Inicial", format: "Guía", language: "Inglés", access: "Gratis"
  },
  {
    category: "Network", title: "Common Ports Cheat Sheet", source: "StationX", description: "Tabla de puertos y servicios comunes para reconocimiento y administración.", href: "https://www.stationx.net/common-ports-cheat-sheet/", topics: ["puertos", "servicios", "TCP/IP"], level: "Inicial", format: "Cheat sheet", language: "Inglés", access: "Gratis"
  },
  {
    category: "Network", title: "curl", source: "curl", description: "Documentación oficial de la herramienta para transferencias y pruebas HTTP.", href: "https://curl.se/", topics: ["HTTP", "CLI", "automatización"], level: "Inicial", format: "Documentación", language: "Inglés", access: "Gratis"
  },
  {
    category: "Network", title: "KRACK Attacks", source: "KRACK Attacks", description: "Sitio técnico sobre la vulnerabilidad de reinstalación de claves en WPA2.", href: "https://www.krackattacks.com/", topics: ["Wi-Fi", "WPA2", "protocolos"], level: "Avanzado", format: "Investigación", language: "Inglés", access: "Gratis"
  },
  {
    category: "Hacking Web", title: "OWASP CSRF Cheat Sheet", source: "OWASP", description: "Controles recomendados para prevenir ataques CSRF en aplicaciones web.", href: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html", topics: ["CSRF", "cookies", "APIs"], level: "Intermedio", format: "Cheat sheet", language: "Inglés", access: "Gratis"
  },
  {
    category: "Mobile Security", title: "OWASP MASTG", source: "OWASP", description: "Guía de pruebas de seguridad para aplicaciones móviles Android e iOS.", href: "https://mas.owasp.org/MASTG/", topics: ["mobile", "testing", "Android", "iOS"], level: "Avanzado", format: "Guía", language: "Inglés", access: "Gratis"
  },
  {
    category: "Hacking Web", title: "OWASP Juice Shop", source: "OWASP", description: "Aplicación deliberadamente vulnerable para practicar seguridad web en un entorno controlado.", href: "https://owasp.org/www-project-juice-shop/", topics: ["web", "OWASP", "laboratorio"], level: "Mixto", format: "Laboratorio", language: "Inglés", access: "Gratis"
  },
  {
    category: "Hacking Web", title: "YesWeHack", source: "YesWeHack", description: "Plataforma de bug bounty para conocer programas y prácticas de divulgación responsable.", href: "https://www.yeswehack.com/", topics: ["bug bounty", "divulgación", "web"], level: "Intermedio", format: "Plataforma", language: "Inglés", access: "Cuenta y reglas por programa"
  },
  {
    category: "Hacking Web", title: "PayloadsAllTheThings", source: "Swissky", description: "Repositorio de referencia para estudiar payloads y técnicas en laboratorios autorizados.", href: "https://swisskyrepo.github.io/PayloadsAllTheThings/", topics: ["payloads", "web", "pentesting"], level: "Avanzado", format: "Repositorio", language: "Inglés", access: "Gratis", curation: "pendiente", warning: "Es material dual-use y no fue curado completamente. Usalo solo en objetivos propios o autorizados y revisá cada ejemplo antes de ejecutarlo."
  },
  {
    category: "Hacking Web", title: "HTML/CSS/JS Tools", source: "HTML CSS JS", description: "Colección de herramientas rápidas para trabajar con HTML, CSS y JavaScript.", href: "https://html-css-js.com/", topics: ["HTML", "CSS", "JavaScript"], level: "Inicial", format: "Herramientas", language: "Inglés", access: "Enlace externo no auditado", curation: "pendiente", warning: "No se revisaron todas las herramientas ni el tratamiento de los datos. No pegues secretos ni información sensible."
  },
  {
    category: "Hacking Web", title: "Domain Dossier", source: "CentralOps", description: "Herramienta histórica para consultar información pública de dominios y redes.", href: "https://centralops.net/co/DomainDossier.aspx", topics: ["DNS", "dominios", "reconocimiento"], level: "Intermedio", format: "Herramienta OSINT", language: "Inglés", access: "Enlace externo no auditado", curation: "pendiente", warning: "El servicio puede estar desactualizado y no fue auditado por completo. Usalo solo con dominios autorizados."
  },
  {
    category: "Full Stack Development", title: "Boot.dev", source: "Boot.dev", description: "Ruta práctica para aprender programación y backend construyendo proyectos.", href: "https://www.boot.dev/", topics: ["backend", "Python", "Go"], level: "Inicial", format: "Cursos", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Full Stack Development", title: "Coddy", source: "Coddy", description: "Ejercicios interactivos de programación y desarrollo web.", href: "https://coddy.tech/", topics: ["programación", "web", "ejercicios"], level: "Inicial", format: "Plataforma", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Full Stack Development", title: "Postgres Sandbox", source: "database.build", description: "Entorno de práctica para explorar consultas y conceptos de bases de datos.", href: "https://database.build/", topics: ["PostgreSQL", "SQL", "bases de datos"], level: "Inicial", format: "Sandbox", language: "Inglés", access: "Gratis; no uses datos reales"
  },
  {
    category: "Full Stack Development", title: "GitDiagram", source: "GitDiagram", description: "Generador de diagramas para visualizar la estructura de repositorios.", href: "https://gitdiagram.com/", topics: ["Git", "arquitectura", "diagramas"], level: "Inicial", format: "Herramienta", language: "Inglés", access: "Enlace externo no auditado", curation: "pendiente", warning: "No se verificó completamente qué información procesa. Evitá enviar repositorios privados o secretos."
  },
  {
    category: "Full Stack Development", title: "Mermaid Live", source: "Mermaid", description: "Editor para crear diagramas como código y documentar sistemas.", href: "https://mermaid.live/", topics: ["diagramas", "documentación", "arquitectura"], level: "Inicial", format: "Editor web", language: "Inglés", access: "Gratis; enlace externo"
  },
  {
    category: "Cloud", title: "AWS Cheat Sheets", source: "Tutorials Dojo", description: "Referencia rápida de servicios y conceptos frecuentes de AWS.", href: "https://tutorialsdojo.com/aws-cheat-sheets/", topics: ["AWS", "servicios", "cloud"], level: "Intermedio", format: "Cheat sheets", language: "Inglés", access: "Gratis; enlace externo"
  },
  {
    category: "Cloud", title: "AWS CLI Cheat Sheet", source: "Blue Matador", description: "Comandos frecuentes de AWS CLI para operar recursos desde terminal.", href: "https://www.bluematador.com/learn/aws-cli-cheatsheet", topics: ["AWS CLI", "automatización", "IAM"], level: "Intermedio", format: "Cheat sheet", language: "Inglés", access: "Gratis"
  },
  {
    category: "Cloud", title: "Microsoft SC-401", source: "Microsoft Learn", description: "Curso oficial sobre protección de información y cumplimiento en Microsoft 365.", href: "https://learn.microsoft.com/en-us/training/courses/sc-401t00", topics: ["Microsoft 365", "identidad", "cumplimiento"], level: "Intermedio", format: "Curso", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Blue Team", title: "CyberDefenders Roadmap", source: "CyberDefenders", description: "Ruta de aprendizaje orientada a análisis defensivo y threat hunting.", href: "https://cyberdefenders.org/community/cybersecurity-roadmap/", topics: ["SOC", "forense", "threat hunting"], level: "Mixto", format: "Roadmap", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Blue Team", title: "Wintriage", source: "DFIR Spain", description: "Herramienta y explicación para realizar triage de sistemas Windows.", href: "https://www.dfirspain.es/2023/01/wintriage-herramienta-de-triage-para.html", topics: ["Windows", "DFIR", "triage"], level: "Avanzado", format: "Herramienta y guía", language: "Español", access: "Gratis; enlace externo"
  },
  {
    category: "Blue Team", title: "MemProcFS", source: "UFRisk", description: "Sistema para montar un volcado de memoria como filesystem y analizarlo.", href: "https://github.com/ufrisk/MemProcFS", topics: ["memoria", "forense", "Windows"], level: "Avanzado", format: "Proyecto", language: "Inglés", access: "Gratis"
  },
  {
    category: "Blue Team", title: "No More Ransom", source: "No More Ransom", description: "Portal para identificar ransomware y consultar herramientas de recuperación disponibles.", href: "https://www.nomoreransom.org/es/index.html", topics: ["ransomware", "respuesta", "recuperación"], level: "Inicial", format: "Portal", language: "Español", access: "Gratis"
  },
  {
    category: "Blue Team", title: "Google Security Operations", source: "Google Cloud", description: "Ruta de aprendizaje con actividades prácticas sobre operaciones de seguridad, SIEM y respuesta.", href: "https://www.skills.google/paths/581", topics: ["SOC", "SIEM", "SOAR", "detección"], level: "Intermedio", format: "Ruta de aprendizaje", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Cloud", title: "Google Skills", source: "Google Cloud", description: "Plataforma de aprendizaje práctico para desarrollar habilidades de Google Cloud mediante cursos, laboratorios y credenciales.", href: "https://www.skills.google/paths/2268", topics: ["Google Cloud", "cloud", "laboratorios", "certificaciones"], level: "Mixto", format: "Plataforma de aprendizaje", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Red Team · Pentesting", title: "Hack Smarter", source: "Hack Smarter", description: "Catálogo de laboratorios y material de práctica ofensiva en entornos controlados.", href: "https://www.hacksmarter.org/catalog", topics: ["pentesting", "laboratorios", "web"], level: "Mixto", format: "Laboratorios", language: "Inglés", access: "Enlace externo no auditado", curation: "pendiente", warning: "No se alcanzó a curar todo el catálogo. Respetá las reglas de cada laboratorio y no reutilices técnicas fuera de su alcance."
  },
  {
    category: "Red Team · Pentesting", title: "0xdf", source: "0xdf", description: "Write-ups técnicos de máquinas y desafíos para estudiar metodología después de intentarlos.", href: "https://0xdf.gitlab.io/", topics: ["enumeración", "Linux", "web"], level: "Avanzado", format: "Write-ups", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "DbgMan", source: "0xdbgman", description: "Notas y recursos sobre debugging, reversing y análisis técnico.", href: "https://0xdbgman.github.io/", topics: ["debugging", "reversing", "bajo nivel"], level: "Avanzado", format: "Notas", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "VulNyx notes", source: "j4ckie0x17", description: "Notas de resolución de máquinas VulNyx para estudiar enumeración y explotación.", href: "https://j4ckie0x17.gitbook.io/notes-pentesting/writeups/vulnyx/", topics: ["VulNyx", "enumeración", "máquinas"], level: "Avanzado", format: "Write-ups", language: "Inglés", access: "Enlace externo no auditado", curation: "pendiente", warning: "Los write-ups y comandos no fueron curados por completo. Usalos después de intentar el reto y solo en laboratorios autorizados."
  },
  {
    category: "CTF", title: "CTFtime", source: "CTFtime", description: "Calendario y archivo de competencias CTF de la comunidad.", href: "https://ctftime.org/", topics: ["CTF", "competencias", "comunidad"], level: "Mixto", format: "Calendario", language: "Inglés", access: "Gratis"
  },
  {
    category: "CTF", title: "Hack The Box Machines", source: "Hack The Box", description: "Máquinas y laboratorios de práctica para entrenar metodologías ofensivas.", href: "https://app.hackthebox.com/machines", topics: ["máquinas", "pentesting", "CTF"], level: "Mixto", format: "Laboratorios", language: "Inglés", access: "Cuenta; modalidad según recurso"
  },
  {
    category: "CTF", title: "Red Team Roadmap", source: "HollowSec", description: "Mapa comunitario para orientar el aprendizaje de hacking ético y red team.", href: "https://0xnotkyo.gitbook.io/faq.hollowsec/summary-md/roadmap-hacking-etico", topics: ["red team", "roadmap", "pentesting"], level: "Mixto", format: "Roadmap", language: "Español", access: "Enlace externo no auditado", curation: "pendiente", warning: "Es una guía comunitaria y no fue curada por completo. Contrastá cada recomendación con documentación oficial."
  },
  {
    category: "CTF", title: "Self-Taught Course", source: "Racoten", description: "Ruta autodidacta con recursos y ejercicios para construir fundamentos de seguridad.", href: "https://racoten.github.io/Self-Taught-Course/", topics: ["fundamentos", "estudio", "seguridad"], level: "Mixto", format: "Curso autodidacta", language: "Inglés", access: "Enlace externo no auditado", curation: "pendiente", warning: "No se alcanzó a verificar todo el material enlazado. Confirmá fuentes, licencias y vigencia antes de seguirlo."
  },
  {
    category: "Computer Science", title: "Aprende Python", source: "AprendePython.es", description: "Curso y material en español para aprender Python desde los fundamentos.", href: "https://aprendepython.es/", topics: ["Python", "programación", "español"], level: "Inicial", format: "Curso", language: "Español", access: "Gratis"
  },
  {
    category: "Computer Science", title: "Python en Microsoft", source: "Microsoft", description: "Curso introductorio para aprender Python con herramientas y ejercicios de Microsoft.", href: "https://vscodeedu.com/courses/intro-to-python", topics: ["Python", "programación", "Microsoft"], level: "Inicial", format: "Curso", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Computer Science", title: "Free Programming Books", source: "EbookFoundation", description: "Colección comunitaria de libros y recursos gratuitos de programación.", href: "https://github.com/EbookFoundation/free-programming-books", topics: ["programación", "libros", "recursos abiertos"], level: "Mixto", format: "Repositorio", language: "Mixto", access: "Gratis"
  },
  {
    category: "Computer Science", title: "Flavio Copes Books", source: "Flavio Copes", description: "Libros y guías de programación y desarrollo web para estudio autodidacta.", href: "https://flaviocopes.com/books/", topics: ["JavaScript", "web", "programación"], level: "Inicial", format: "Libros", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Computer Science", title: "Codewars", source: "Codewars", description: "Desafíos de programación para practicar resolución de problemas en distintos lenguajes.", href: "https://www.codewars.com/", topics: ["algoritmos", "programación", "kata"], level: "Mixto", format: "Desafíos", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Red Team · Pentesting", title: "Paul Jerimy Certification Roadmap", source: "Paul Jerimy", description: "Mapa de certificaciones para orientar distintos recorridos profesionales en ciberseguridad.", href: "https://pauljerimy.com/security-certification-roadmap/", topics: ["certificaciones", "roadmap", "carrera"], level: "Mixto", format: "Roadmap", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "Courses & Certs baratos", source: "RedTeam Leaders", description: "Catálogo de cursos y certificaciones de seguridad ofensiva y hacking ético.", href: "https://courses.redteamleaders.com/catalog", topics: ["pentesting", "certificaciones", "formación"], level: "Mixto", format: "Cursos", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Red Team · Pentesting", title: "SysReptor", source: "SysReptor", description: "Herramienta para organizar evaluaciones de seguridad y generar informes técnicos de pentesting.", href: "https://sysreptor.com/", topics: ["reportes", "pentesting", "documentación"], level: "Intermedio", format: "Herramienta", language: "Inglés", access: "Enlace externo; modalidad según servicio"
  },
  {
    category: "Red Team · Pentesting", title: "Fortinet Training", source: "Fortinet", description: "Cursos oficiales sobre redes, seguridad y tecnologías de Fortinet.", href: "https://www.fortinet.com/lat/training/cybersecurity-professionals", topics: ["redes", "firewalls", "certificaciones"], level: "Mixto", format: "Cursos", language: "Español", access: "Gratis y opciones de pago"
  },
  {
    category: "Cloud", title: "Microsoft Security, Compliance and Identity Fundamentals", source: "Microsoft Learn", description: "Ruta oficial para estudiar conceptos fundamentales de seguridad, cumplimiento e identidad en Microsoft.", href: "https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/?practice-assessment-type=certification", topics: ["Microsoft", "identidad", "cumplimiento"], level: "Inicial", format: "Certificación", language: "Inglés", access: "Gratis; examen opcional"
  },
  {
    category: "Blue Team", title: "ISC2 Certified in Cybersecurity", source: "ISC2", description: "Certificación introductoria y material de referencia para fundamentos de ciberseguridad.", href: "https://www.isc2.org/certifications/cc", topics: ["fundamentos", "gestión de riesgos", "seguridad"], level: "Inicial", format: "Certificación", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Blue Team", title: "Cybrary", source: "Cybrary", description: "Plataforma de cursos para explorar seguridad, redes, cloud y roles defensivos.", href: "https://www.cybrary.it/", topics: ["SOC", "redes", "cloud", "carreras"], level: "Mixto", format: "Cursos", language: "Inglés", access: "Gratis y opciones de pago"
  },
  {
    category: "Blue Team", title: "Forense · Stego Tools", source: "0xRick", description: "Lista de herramientas para estudiar esteganografía y análisis de archivos en ejercicios forenses.", href: "https://0xrick.github.io/lists/stego/#tools", topics: ["esteganografía", "forense", "archivos"], level: "Intermedio", format: "Lista de herramientas", language: "Inglés", access: "Gratis; enlace externo"
  },
];
